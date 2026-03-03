import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import GlobalStyles from "./GlobalStyles";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

export const LegalSection = ({ title, children }) => (
  <div style={{ marginBottom: 40 }}>
    {title && (
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, marginBottom: 12 }}>{title}</h2>
    )}
    <div style={{ fontSize: 15, lineHeight: 1.8, color: "var(--muted)" }}>{children}</div>
  </div>
);

export const LegalTable = ({ rows }) => (
  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
    <tbody>
      {rows.map(([label, val]) => (
        <tr key={label} style={{ borderBottom: "1px solid var(--cream)" }}>
          <td style={{ padding: "12px 16px 12px 0", fontWeight: 600, color: "var(--ink)", width: "38%", verticalAlign: "top" }}>
            {label}
          </td>
          <td style={{ padding: "12px 0", color: "var(--muted)", lineHeight: 1.7 }}>{val}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const LegalShell = ({ title, subtitle, children, navigate, lang, setLang, t }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <GlobalStyles />
      <SiteNav lang={lang} setLang={setLang} navigate={navigate} t={t} />
      <main style={{ maxWidth: 740, margin: "0 auto", padding: "64px 24px 100px" }}>
        <button
          onClick={() => navigate("home")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "var(--muted)", background: "none",
            border: "none", cursor: "pointer", fontFamily: "var(--sans)",
            marginBottom: 40, padding: 0, transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--indigo)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          <ChevronLeft size={15} />
          {lang === "ja" ? "トップへ戻る" : "Back to home"}
        </button>

        <h1 style={{ fontFamily: "var(--serif)", fontSize: 42, letterSpacing: "-0.02em", marginBottom: 8 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 48 }}>{subtitle}</p>
        )}
        <div style={{ borderTop: "1px solid var(--cream)", paddingTop: 48 }}>{children}</div>
      </main>
      <SiteFooter lang={lang} navigate={navigate} t={t} />
    </>
  );
};

export default LegalShell;
