import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";

import { useLang } from "../context/LangContext";
import { useNav }  from "../context/NavContext";
import SiteNav    from "./SiteNav";
import SiteFooter from "./SiteFooter";

export const LegalSection = ({ title, children }) => (
  <div className="legal-section">{title && <h2>{title}</h2>}{children}</div>
);

export const LegalTable = ({ rows }) => (
  <div className="legal-table">
    <table><tbody>
      {rows.map(([label, val]) => <tr key={label}><td>{label}</td><td>{val}</td></tr>)}
    </tbody></table>
  </div>
);

const LegalShell = ({ title, subtitle, children }) => {
  const { lang } = useLang();
  const { navigate } = useNav();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <SiteNav />
      <main className="legal-main">
        <button className="legal-back" onClick={() => navigate("home")}>
          <ChevronLeft size={15} />{lang === "ja" ? "トップへ戻る" : "Back to home"}
        </button>
        <h1 className="legal-h1">{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 40 }}>{subtitle}</p>}
        <div className="legal-divider">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
};
export default LegalShell;
