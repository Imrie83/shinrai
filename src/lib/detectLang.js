export function detectLang() {
  const urlParam = new URLSearchParams(window.location.search).get("lang");
  if (urlParam === "ja" || urlParam === "en") return urlParam;

  const stored = localStorage.getItem("shinrai-lang");
  if (stored === "ja" || stored === "en") return stored;

  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || "en"];
  if (langs.some((l) => l.startsWith("ja"))) return "ja";

  return "en";
}

export function persistLang(lang) {
  localStorage.setItem("shinrai-lang", lang);
}
