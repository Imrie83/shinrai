const SectionLabel = ({ children, light }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase",
    color: light ? "rgba(255,255,255,0.45)" : "var(--indigo)",
    marginBottom: 14,
  }}>
    <span style={{
      width: 22, height: 2, borderRadius: 2, flexShrink: 0,
      background: light ? "rgba(255,255,255,0.35)" : "var(--indigo)",
    }} />
    {children}
  </div>
);

export default SectionLabel;
