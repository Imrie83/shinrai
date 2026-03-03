const SiteFooter = ({ lang, navigate, t }) => (
  <footer style={{ borderTop: "1px solid var(--cream)", background: "var(--white)", padding: "40px 24px" }}>
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16, marginBottom: 22, paddingBottom: 22,
        borderBottom: "1px solid var(--cream)",
      }}>
        <button
          onClick={() => navigate("home")}
          style={{ fontFamily: "var(--serif)", fontSize: 20, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Shinrai<span style={{ color: "var(--indigo)" }}>.</span>
        </button>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>{t.footerTagline}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            [lang === "ja" ? "プライバシーポリシー" : "Privacy Policy", "privacy"],
            [lang === "ja" ? "特定商取引法に基づく表示" : "Specified Commercial Transactions", "tokusho"],
          ].map(([label, page]) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              style={{
                fontSize: 12, color: "var(--muted)", background: "none",
                border: "none", cursor: "pointer", fontFamily: "var(--sans)",
                transition: "color 0.15s", padding: 0,
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--indigo)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>© {t.footerCopy}</div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
