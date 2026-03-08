/**
 * Shinrai Audit Worker
 *
 * POST /audit { "url": "https://example.co.jp", "lang": "en" | "ja" }
 * → { score, summary, issues[], screenshot, finalUrl }
 *
 * Env vars (wrangler secret put or Cloudflare dashboard):
 *   AI_PROVIDER            — "ollama" | "openai" | "claude"  (default: "ollama")
 *   OLLAMA_BASE_URL        — e.g. http://localhost:11434
 *   OLLAMA_MODEL           — default: qwen3.5:9b
 *   OPENAI_BASE_URL        — default: https://api.openai.com/v1
 *   OPENAI_API_KEY
 *   OPENAI_MODEL           — default: gpt-4o-mini
 *   ANTHROPIC_API_KEY
 *   ANTHROPIC_MODEL        — default: claude-sonnet-4-6
 *   SCREENSHOT_SERVICE_URL — e.g. http://localhost:3000
 *   ALLOWED_ORIGIN         — e.g. https://imrie83.github.io
 */

import { analyzeV2 } from "./v2/analyze.js";

const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_WINDOW;
  }

  record.count++;
  rateLimitMap.set(ip, record);
  return record.count <= RATE_LIMIT;
}

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get("Origin") || "";

    const allowedOrigins = [
      (env.ALLOWED_ORIGIN || "https://imrie83.github.io").replace(/\/$/, ""),
      "http://localhost:5173",
      "http://localhost:4173",
    ];

    const origin = allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : allowedOrigins[0];

    if (request.method === "OPTIONS") {
      return corsResponse(null, 204, origin);
    }

    if (request.method !== "POST") {
      return corsResponse({ error: "Method not allowed" }, 405, origin);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (!checkRateLimit(ip)) {
      return corsResponse({ error: "Rate limit exceeded. Please try again later." }, 429, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse({ error: "Invalid JSON body" }, 400, origin);
    }

    const { url, lang = "en" } = body;
    if (!url || !/^https?:\/\//i.test(url)) {
      return corsResponse({ error: "A valid URL is required" }, 400, origin);
    }

    let result;
    try {
      result = await analyzeV2(url, env, lang, request.signal);
    } catch (e) {
      if (e.name === "AbortError") return new Response(null, { status: 499 }); // client disconnected
      console.error("Analysis error:", e.message);
      return corsResponse({ error: `Analysis failed: ${e.message}` }, 502, origin);
    }

    return corsResponse(result, 200, origin);
  },
};

function corsResponse(body, status, origin) {
  return new Response(
    body === null ? null : JSON.stringify(body),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
