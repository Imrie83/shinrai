import { createContext, useContext, useState, useEffect } from "react";

const NavContext = createContext(null);

const PATHS = { home: "/", privacy: "/privacy", tokusho: "/tokusho" };

function pathToPage(pathname) {
  if (pathname === "/privacy")  return "privacy";
  if (pathname === "/tokusho")  return "tokusho";
  return "home";
}

export function NavProvider({ children }) {
  const [page, setPage] = useState(() => pathToPage(window.location.pathname));

  function navigate(target) {
    window.history.pushState({}, "", PATHS[target] || "/");
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

// eslint-disable-next-line react-refresh/only-export-components
export function useNavigate() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNavigate must be used inside <NavProvider>");
  return ctx.navigate;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePage() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("usePage must be used inside <NavProvider>");
  return ctx.page;
}
