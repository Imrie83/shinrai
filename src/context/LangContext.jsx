import { createContext, useContext, useState, useEffect } from "react";
import { T } from "../lib/translations";

const LangContext = createContext(null);

function detectLang() {
  const p = new URLSearchParams(window.location.search).get("lang");
  if (p === "ja" || p === "en") return p;
  const s = localStorage.getItem("shinrai-lang");
  if (s === "ja" || s === "en") return s;
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || "en"];

  return langs.some(l => l.startsWith("ja")) ? "ja" : "en";
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState("en");
  useEffect(() => { setLangState(detectLang()); }, []);
  function setLang(l) { localStorage.setItem("shinrai-lang", l); setLangState(l); }

  return <LangContext.Provider value={{ lang, setLang, t: T[lang] }}>{children}</LangContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  
  return ctx;
}
