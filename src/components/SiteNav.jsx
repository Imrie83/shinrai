const SiteNav = ({ lang, setLang, navigate, t }) => (
  <nav style={{
    position: "sticky", top: 0, zIndex: 50,
    background: "rgba(247,244,239,0.88)", backdropFilter: "blur(14px)",
    borderBottom: "1px solid var(--cream)",
  }}>
    <div style={{
      maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <button
        onClick={() => navigate("home")}
        style={{ fontFamily: "var(--serif)", fontSize: 22, background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        Shinrai<span style={{ color: "var(--indigo)" }}>.</span>
      </button>

      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {t.nav.map((item, i) => (
          <a
            key={i}
            href={t.navIds[i]}
            onClick={(e) => {
              if (window.location.pathname !== "/") {
                e.preventDefault();
                navigate("home");
              }
            }}
            style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.target.style.color = "var(--ink)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
          >
            {item}
          </a>
        ))}

        <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>
          {["en", "ja"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "4px 11px", borderRadius: 8, border: "1px solid",
                borderColor:  lang === l ? "var(--indigo)" : "var(--cream)",
                background:   lang === l ? "var(--indigo)" : "transparent",
                color:        lang === l ? "white" : "var(--muted)",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "var(--sans)", transition: "all 0.15s",
              }}
            >
              {l === "en" ? "EN" : "日本語"}
            </button>
          ))}
        </div>
      </div>
    </div>
  </nav>
);

export default SiteNav;
