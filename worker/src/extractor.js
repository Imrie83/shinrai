// Regex: CJK unified ideographs + Hiragana + Katakana
const CJK_RE = /[\u3000-\u9fff\uac00-\ud7af\uf900-\ufaff]/g;

function japaneseRatio(str) {
  const matches = str.match(CJK_RE);
  if (!matches) return 0;
  return matches.length / str.length;
}

function stripTags(str) {
  return str
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectJsFramework(html) {
  const clearIndicators = [
    /__NEXT_DATA__/i,
    /window\.__NUXT__/i,
    /ng-version=/i,
    /data-reactroot/i,
  ];
  if (!clearIndicators.some(r => r.test(html))) return false;
  const bodyMatch = html.match(/<body[\s\S]*?<\/body>/i);
  const bodyText  = bodyMatch
    ? bodyMatch[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    : "";
  return bodyText.length < 200;
}

// Per-type hard caps — keeps total output small regardless of page size
const CAPS = {
  "Page title":      1,
  "Meta description":1,
  "OG title":        1,
  "H1 heading":      3,
  "H2 heading":      5,
  "H3 heading":      3,
  "Navigation item": 15,
  "Button":          10,
  "Paragraph":       6,
  "Link / CTA":      10,
  "Image alt text":  6,
  "Footer text":     3,
};

export function extractChunks(html) {
  const elements  = [];
  const seenTexts = new Set();
  const counts    = {};

  function add(label, rawText) {
    // Enforce per-type cap
    counts[label] = (counts[label] || 0);
    if (counts[label] >= (CAPS[label] ?? 5)) return;

    // Truncate each element to 200 chars max — enough for the AI to judge it
    const text = stripTags(rawText).slice(0, 200);
    if (!text || text.length < 2) return;

    const key = text.slice(0, 60).toLowerCase();
    if (seenTexts.has(key)) return;
    seenTexts.add(key);

    counts[label]++;
    elements.push({ label, text, jaRatio: japaneseRatio(text) });
  }

  // ── Metadata ───────────────────────────────────────────────────────────────
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) add("Page title", titleMatch[1]);

  const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
                || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  if (metaDesc) add("Meta description", metaDesc[1]);

  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  if (ogTitle) add("OG title", ogTitle[1]);

  // ── Headings ───────────────────────────────────────────────────────────────
  for (const [, c] of html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)) add("H1 heading", c);
  for (const [, c] of html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)) add("H2 heading", c);
  for (const [, c] of html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)) add("H3 heading", c);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const navMatch = html.match(/<nav[\s\S]*?<\/nav>/i);
  if (navMatch) {
    for (const [, c] of navMatch[0].matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)) {
      const t = stripTags(c);
      if (t.length >= 2 && t.length <= 60) add("Navigation item", c);
    }
  }

  // ── Buttons ────────────────────────────────────────────────────────────────
  for (const [, c] of html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)) {
    const t = stripTags(c);
    if (t.length >= 2 && t.length <= 80) add("Button", c);
  }

  // ── Paragraphs (prefer main/article content area) ─────────────────────────
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i)
                 || html.match(/<article[\s\S]*?<\/article>/i);
  const contentArea = mainMatch ? mainMatch[0] : html;

  for (const [, c] of contentArea.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = stripTags(c);
    if (t.length >= 20) add("Paragraph", c);
  }

  // ── CTAs / standalone links ────────────────────────────────────────────────
  for (const [full, c] of html.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)) {
    const t = stripTags(c);
    if (t.length < 3 || t.length > 80) continue;
    if (navMatch && navMatch[0].includes(full)) continue;
    add("Link / CTA", c);
  }

  // ── Image alt text ─────────────────────────────────────────────────────────
  for (const [, alt] of html.matchAll(/alt=["']([^"']{3,80})["']/gi)) {
    add("Image alt text", alt);
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
  if (footerMatch) {
    for (const [, c] of footerMatch[0].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
      add("Footer text", c);
    }
  }

  return elements;
}

export function estimateTokens(elements) {
  return Math.ceil(elements.reduce((s, e) => s + e.text.length, 0) / 3);
}

// Hard budget: 1500 tokens — keeps model fast and within context
export function trimToTokenBudget(elements, maxTokens = 1500) {
  const result = [];
  let tokens = 0;
  for (const el of elements) {
    const t = Math.ceil(el.text.length / 3);
    if (tokens + t > maxTokens) break;
    result.push(el);
    tokens += t;
  }
  return result;
}
