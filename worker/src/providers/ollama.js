import { VISION_SYSTEM_PROMPT_EN, VISION_SYSTEM_PROMPT_JA, buildVisionUserPrompt, parseAIResponse } from "./shared.js";

export async function analyzeVision(screenshot, elements, env, lang = "en", signal) {
  if (!env.OLLAMA_BASE_URL) {
    throw new Error("OLLAMA_BASE_URL is not set.");
  }

  const baseUrl = env.OLLAMA_BASE_URL.replace(/\/$/, "");
  const model = env.OLLAMA_MODEL || "qwen3.5:9b";
  const systemPrompt = lang === "ja" ? VISION_SYSTEM_PROMPT_JA : VISION_SYSTEM_PROMPT_EN;

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: buildVisionUserPrompt(elements, lang),
          images: [screenshot],
        },
      ],
      format: "json",
      options: { temperature: 0.2, num_ctx: 8192 },
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Ollama error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.message?.content;
  if (!content || content.trim() === "") {
    throw new Error(`Ollama returned empty content. done_reason: ${data.done_reason}`);
  }

  return parseAIResponse(content);
}
