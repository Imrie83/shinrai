import { createContext, useContext, useState, useEffect } from "react";

const NavContext = createContext(null);

// Read base from Vite — "/shinrai/" in production, "/" in dev
const BASE = import.meta.env.BASE_URL; // always has leading and trailing slash

const PATHS = {
  home:    BASE,
  privacy: `${BASE}privacy`,
  tokusho: `${BASE}tokusho`,
};

function pathToPage(pathname) {
  if (pathname.endsWith("/privacy")) return "privacy";
  if (pathname.endsWith("/tokusho")) return "tokusho";
  return "home";
}

export function NavProvider({ children }) {
  const [page, setPage] = useState(() => {
    // Handle redirect from 404.html (GH Pages deep-link refresh)
    const redirect = sessionStorage.getItem("shinrai-redirect");
    if (redirect) {
      sessionStorage.removeItem("shinrai-redirect");
      // Push the real URL without triggering a reload
      window.history.replaceState({}, "", redirect);
    }
    return pathToPage(window.location.pathname);
  });

  function navigate(target) {
    window.history.pushState({}, "", PATHS[target] || BASE);
    setPage(target);
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    const onPop = () => setPage(pathToPage(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <NavContext.Provider value={{ page, navigate }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used inside <NavProvider>");
  return ctx;
}
