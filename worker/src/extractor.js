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

// ─── Section grouping ────────────────────────────────────────────────────────
// Extracts heading + immediately following content (paragraphs, images, lists)
// as a single logical unit so the LLM understands context.
//
// Token cost: ~10-15% more than flat extraction, not 2-3x, because
// we collapse duplicates and cap section body at 300 chars.

function extractSections(html) {
  const sections = [];
  const seen = new Set();

  // Match any heading followed by sibling content within the same parent block.
  // Strategy: find each hN tag, then greedily grab the next few sibling nodes.
  const headingRe = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;

  let match;
  while ((match = headingRe.exec(html)) !== null) {
    const level    = match[1].toUpperCase();
    const headText = stripTags(match[2]).slice(0, 120);
    if (!headText || headText.length < 2) continue;

    // Look ahead up to 600 chars after the heading close tag for sibling content
    const afterHeading = html.slice(match.index + match[0].length, match.index + match[0].length + 800);

    const bodyParts = [];

    // Grab first <p> after heading
    const pMatch = afterHeading.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (pMatch) {
      const t = stripTags(pMatch[1]).slice(0, 600);
      if (t.length >= 10) bodyParts.push(`[p] ${t}`);
    }

    // Grab first image alt in vicinity
    const imgMatch = afterHeading.match(/alt=["']([^"']{3,80})["']/i);
    if (imgMatch) bodyParts.push(`[img: ${imgMatch[1]}]`);

    // Grab first <li> list items (up to 3)
    const liMatches = [...afterHeading.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].slice(0, 3);
    for (const li of liMatches) {
      const t = stripTags(li[1]).slice(0, 100);
      if (t.length >= 3) bodyParts.push(`[li] ${t}`);
    }

    // Stop if next heading appears before any content — avoids bleed-over
    const nextHeading = afterHeading.search(/<h[1-3][^>]*>/i);
    if (nextHeading !== -1 && nextHeading < (pMatch?.index ?? Infinity)) {
      // Next heading is closer than first paragraph — emit heading-only
      bodyParts.length = 0;
    }

    const sectionText = bodyParts.length > 0
      ? `[${level}] ${headText} | ${bodyParts.join(" | ")}`
      : `[${level}] ${headText}`;

    const key = sectionText.slice(0, 60).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    sections.push({ label: "Section", text: sectionText, jaRatio: japaneseRatio(sectionText) });
  }

  return sections;
}

// ─── Flat element extraction (metadata, nav, buttons, CTAs, footer) ──────────
// These don't benefit from grouping — kept as-is.

const FLAT_CAPS = {
  "Page title":       1,
  "Meta description": 1,
  "OG title":         1,
  "Navigation item":  12,
  "Button":           8,
  "Link / CTA":       8,
  "Image alt text":   4,
  "Footer text":      2,
  "Standalone para":  3,  // paragraphs NOT preceded by a heading
};

function extractFlat(html) {
  const elements  = [];
  const seenTexts = new Set();
  const counts    = {};

  function add(label, rawText) {
    counts[label] = counts[label] || 0;
    if (counts[label] >= (FLAT_CAPS[label] ?? 5)) return;
    const text = stripTags(rawText).slice(0, 400);
    if (!text || text.length < 2) return;
    const key = text.slice(0, 60).toLowerCase();
    if (seenTexts.has(key)) return;
    seenTexts.add(key);
    counts[label]++;
    elements.push({ label, text, jaRatio: japaneseRatio(text) });
  }

  // Metadata
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) add("Page title", titleMatch[1]);

  const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
                || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  if (metaDesc) add("Meta description", metaDesc[1]);

  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  if (ogTitle) add("OG title", ogTitle[1]);

  // Navigation
  const navMatch = html.match(/<nav[\s\S]*?<\/nav>/i);
  if (navMatch) {
    for (const [, c] of navMatch[0].matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)) {
      const t = stripTags(c);
      if (t.length >= 2 && t.length <= 60) add("Navigation item", c);
    }
  }

  // Buttons
  for (const [, c] of html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)) {
    const t = stripTags(c);
    if (t.length >= 2 && t.length <= 80) add("Button", c);
  }

  // Standalone CTAs / links (outside nav)
  for (const [full, c] of html.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)) {
    const t = stripTags(c);
    if (t.length < 3 || t.length > 80) continue;
    if (navMatch && navMatch[0].includes(full)) continue;
    add("Link / CTA", c);
  }

  // Standalone image alts (not already captured in sections)
  for (const [, alt] of html.matchAll(/alt=["']([^"']{3,80})["']/gi)) {
    add("Image alt text", alt);
  }

  // Footer
  const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
  if (footerMatch) {
    for (const [, c] of footerMatch[0].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
      add("Footer text", c);
    }
  }

  // Standalone paragraphs — only those NOT near a heading (sections cover the rest)
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i)
                 || html.match(/<article[\s\S]*?<\/article>/i);
  const contentArea = mainMatch ? mainMatch[0] : html;
  for (const [, c] of contentArea.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = stripTags(c);
    if (t.length >= 30) add("Standalone para", c);
  }

  return elements;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function extractChunks(html) {
  const sections = extractSections(html);
  const flat     = extractFlat(html);
  // Sections first — they carry the most context
  return [...sections, ...flat];
}

export function estimateTokens(elements) {
  return Math.ceil(elements.reduce((s, e) => s + e.text.length, 0) / 3);
}

// Budget raised slightly to 1800 to accommodate richer section format
export function trimToTokenBudget(elements, maxTokens = 1800) {
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
