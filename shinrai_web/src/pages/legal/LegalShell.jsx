import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import { useLang } from "../../context/LangContext";
import { useNavigate } from "../../context/NavContext";

export default function LegalShell({ title, subtitle, children }) {
  const { lang } = useLang();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SiteNav />
      <main style={{ maxWidth: 740, margin: "0 auto", padding: "64px 24px 100px" }}>
        <button
          onClick={() => navigate("home")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "var(--muted)",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--sans)", marginBottom: 40, padding: 0, transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--indigo)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
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
        <div style={{ borderTop: "1px solid var(--cream)", paddingTop: 48 }}>
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
