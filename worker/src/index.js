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

    // Stream the response so cloudflared tunnels don't time out while Ollama thinks.
    // We trickle a newline every 5s to keep the connection alive, then write the
    // real JSON result as the final line. The browser reads it as newline-delimited JSON.
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Keepalive interval — sends a blank line every 5s
    const keepalive = setInterval(() => {
      writer.write(encoder.encode("\n")).catch(() => clearInterval(keepalive));
    }, 5000);

    // Run the analysis in the background
    analyzeV2(url, env, lang, request.signal)
      .then(result => {
        clearInterval(keepalive);
        writer.write(encoder.encode(JSON.stringify(result) + "\n"));
        writer.close();
      })
      .catch(e => {
        clearInterval(keepalive);
        if (e.name !== "AbortError") {
          console.error("Analysis error:", e.message);
          writer.write(encoder.encode(JSON.stringify({ error: `Analysis failed: ${e.message}` }) + "\n"));
        }
        writer.close();
      });

    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "application/x-ndjson",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "X-Content-Type-Options": "nosniff",
      },
    });
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
