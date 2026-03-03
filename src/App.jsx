import { useState, useEffect } from "react";
import GlobalStyles from "./components/GlobalStyles";
import HomePage    from "./pages/HomePage";
import PrivacyPage from "./pages/PrivacyPage";
import TokushoPage from "./pages/TokushoPage";
import T           from "./translations";
import { detectLang, persistLang } from "./lib/detectLang";

const PATHS = { home: "/", privacy: "/privacy", tokusho: "/tokusho" };

const pathToPage = (path) => {
  if (path === "/privacy")  return "privacy";
  if (path === "/tokusho")  return "tokusho";
  return "home";
};

export default function App() {
  const [lang, setLangState] = useState("en");
  const [page, setPage]      = useState("home");

  const setLang = (l) => {
    persistLang(l);
    setLangState(l);
  };

  // Init on mount
  useEffect(() => {
    setLangState(detectLang());
    setPage(pathToPage(window.location.pathname));
  }, []);

  // Handle browser back / forward
  useEffect(() => {
    const onPop = () => setPage(pathToPage(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (target) => {
    window.history.pushState({}, "", PATHS[target] ?? "/");
    setPage(target);
    window.scrollTo(0, 0);
  };

  const t     = T[lang];
  const props = { lang, setLang, navigate, t };

  return (
    <>
      <GlobalStyles />
      {page === "privacy" && <PrivacyPage {...props} />}
      {page === "tokusho" && <TokushoPage {...props} />}
      {page === "home"    && <HomePage    {...props} />}
    </>
  );
}
