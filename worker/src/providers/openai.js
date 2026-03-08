import { VISION_SYSTEM_PROMPT_EN, VISION_SYSTEM_PROMPT_JA, buildVisionUserPrompt, parseAIResponse } from "./shared.js";

export async function analyzeVision(screenshot, elements, env, lang = "en", signal) {
  const baseUrl = (env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = env.OPENAI_MODEL || "gpt-4o-mini";
  const systemPrompt = lang === "ja" ? VISION_SYSTEM_PROMPT_JA : VISION_SYSTEM_PROMPT_EN;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: `data:image/png;base64,${screenshot}`, detail: "high" } },
            { type: "text", text: buildVisionUserPrompt(elements, lang) },
          ],
        },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return parseAIResponse(data.choices[0].message.content);
}
