const TechStack = ({ groups }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 24 }}>
    {groups.map(({ icon: Icon, label, techs }) => (
      <div key={label} style={{
        background: "var(--white)", borderRadius: 14,
        padding: "16px 18px", border: "1px solid var(--cream)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: "var(--indigo-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={14} color="var(--indigo)" />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--indigo)" }}>
            {label}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {techs.map((tech) => (
            <span key={tech} style={{
              fontSize: 12, background: "var(--cream)", color: "var(--ink)",
              padding: "2px 9px", borderRadius: 99, fontWeight: 500,
            }}>{tech}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default TechStack;
