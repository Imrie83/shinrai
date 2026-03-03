export function LegalSection({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      {title && (
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 22, marginBottom: 12 }}>{title}</h2>
      )}
      <div style={{ fontSize: 15, lineHeight: 1.8, color: "var(--muted)" }}>{children}</div>
    </div>
  );
}

export function LegalTable({ rows }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
      <tbody>
        {rows.map(([label, val]) => (
          <tr key={label} style={{ borderBottom: "1px solid var(--cream)" }}>
            <td style={{ padding: "12px 16px 12px 0", fontWeight: 600, color: "var(--ink)", width: "38%", verticalAlign: "top" }}>
              {label}
            </td>
            <td style={{ padding: "12px 0", color: "var(--muted)", lineHeight: 1.7 }}>
              {val}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
