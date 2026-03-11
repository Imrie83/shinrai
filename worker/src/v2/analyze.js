import { extractChunks, trimToTokenBudget, detectJsFramework } from "../extractor.js";
import { analyzeVision as analyzeOllamaVision }  from "../providers/ollama.js";
import { analyzeVision as analyzeOpenAIVision }   from "../providers/openai.js";
import { analyzeVision as analyzeClaudeVision }   from "../providers/claude.js";

/**
 * Take a screenshot via Browserless.io REST API.
 * Returns { screenshot: base64string, html: string, finalUrl: string }
 */
async function screenshotBrowserless(url, apiKey, signal) {
  const base = "https://chrome.browserless.io";
  const auth = `?token=${apiKey}`;

  // Full-page JPEG screenshot
  const shotRes = await fetch(`${base}/screenshot${auth}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      options: { fullPage: true, type: "jpeg", quality: 60 },
      waitFor: 2500,
      blockAds: true,
    }),
    signal,
  });

  if (!shotRes.ok) {
    const err = await shotRes.text();
    throw new Error(`Browserless screenshot error ${shotRes.status}: ${err}`);
  }

  // Browserless returns raw binary — convert to base64
  const buffer = await shotRes.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const screenshot = btoa(binary);

  // Rendered HTML via /content endpoint
  const htmlRes = await fetch(`${base}/content${auth}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, waitFor: 2500, blockAds: true }),
    signal,
  });

  const html = htmlRes.ok ? await htmlRes.text() : "";

  return { screenshot, html, finalUrl: url };
}

/**
 * Take a screenshot via the local Playwright service (unchanged).
 */
async function screenshotLocal(url, serviceUrl, signal) {
  const res = await fetch(`${serviceUrl}/screenshot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    signal,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Screenshot service error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return { screenshot: data.screenshot, html: data.html || "", finalUrl: data.finalUrl || url };
}

export async function analyzeV2(url, env, lang = "en", clientSignal) {
  const provider = (env.AI_PROVIDER || "ollama").toLowerCase();

  // Ollama runs locally — no timeout. Cloud providers get 90s.
  const isLocal = provider === "ollama";
  const timeoutSignal = isLocal ? null : AbortSignal.timeout(90_000);
  const signal = clientSignal && timeoutSignal
    ? AbortSignal.any([clientSignal, timeoutSignal])
    : (clientSignal || timeoutSignal || undefined);

  // Use Browserless.io when BROWSERLESS_API_KEY is set, otherwise fall back
  // to the local Playwright service (SCREENSHOT_SERVICE_URL).
  let screenshot, html, finalUrl;
  try {
    if (env.BROWSERLESS_API_KEY) {
      ({ screenshot, html, finalUrl } = await screenshotBrowserless(url, env.BROWSERLESS_API_KEY, signal));
    } else {
      const serviceUrl = (env.SCREENSHOT_SERVICE_URL || "http://localhost:3000").replace(/\/$/, "");
      ({ screenshot, html, finalUrl } = await screenshotLocal(url, serviceUrl, signal));
    }
  } catch (e) {
    throw new Error(`Failed to get screenshot: ${e.message}`);
  }

  const allElements = extractChunks(html);
  const elements = trimToTokenBudget(allElements);
  const isJsRendered = detectJsFramework(html);

  let result;
  
  if (provider === "claude") result = await analyzeClaudeVision(screenshot, elements, env, lang, signal);
  else if (provider === "openai") result = await analyzeOpenAIVision(screenshot, elements, env, lang, signal);
  else result = await analyzeOllamaVision(screenshot, elements, env, lang, signal);

  result.screenshot = screenshot;
  result.finalUrl = finalUrl;
  if (isJsRendered) result.jsWarning = true;

  return result;
}
