import { createContext, useContext, useState, useEffect } from "react";
import { T } from "../lib/translations";

const LangContext = createContext(null);

function detectLang() {
  // 1. Explicit URL param — ?lang=ja or ?lang=en — useful for testing / sharing
  const urlParam = new URLSearchParams(window.location.search).get("lang");
  if (urlParam === "ja" || urlParam === "en") return urlParam;

  // 2. User's previous manual choice (survives reloads)
  const stored = localStorage.getItem("shinrai-lang");
  if (stored === "ja" || stored === "en") return stored;

  // 3. Full browser language list — navigator.languages includes "ja" for
  //    Japanese users even when their primary UI language is English.
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || "en"];
  if (langs.some(l => l.startsWith("ja"))) return "ja";

  return "en";
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState("en"); // real value set in useEffect

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  function setLang(l) {
    localStorage.setItem("shinrai-lang", l);
    setLangState(l);
  }

  const t = T[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
