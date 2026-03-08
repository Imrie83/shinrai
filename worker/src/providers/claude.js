import { VISION_SYSTEM_PROMPT_EN, VISION_SYSTEM_PROMPT_JA, buildVisionUserPrompt, parseAIResponse } from "./shared.js";

export async function analyzeVision(screenshot, elements, env, lang = "en", signal) {
  const model = env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const systemPrompt = lang === "ja" ? VISION_SYSTEM_PROMPT_JA : VISION_SYSTEM_PROMPT_EN;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: "image/png", data: screenshot },
            },
            { type: "text", text: buildVisionUserPrompt(elements, lang) },
          ],
        },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return parseAIResponse(data.content[0].text);
}
