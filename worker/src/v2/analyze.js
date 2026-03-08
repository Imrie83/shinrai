import { extractChunks, trimToTokenBudget, detectJsFramework } from "../extractor.js";
import { analyzeVision as analyzeOllamaVision } from "../providers/ollama.js";
import { analyzeVision as analyzeOpenAIVision } from "../providers/openai.js";
import { analyzeVision as analyzeClaudeVision } from "../providers/claude.js";

export async function analyzeV2(url, env, lang = "en", clientSignal) {
  const serviceUrl = (env.SCREENSHOT_SERVICE_URL || "http://localhost:3000").replace(/\/$/, "");

  const provider = (env.AI_PROVIDER || "ollama").toLowerCase();

  // Ollama runs locally and can be slow — no timeout, just pass the client signal.
  // Cloud providers (OpenAI, Claude) get a 60s hard timeout on top of the client signal.
  const isLocal = provider === "ollama";
  const timeoutSignal = isLocal ? null : AbortSignal.timeout(60_000);
  const signal = clientSignal && timeoutSignal
    ? AbortSignal.any([clientSignal, timeoutSignal])
    : (clientSignal || timeoutSignal || undefined);

  let screenshot, html, finalUrl;
  try {
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
    screenshot = data.screenshot;
    html = data.html;
    finalUrl = data.finalUrl || url;
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
