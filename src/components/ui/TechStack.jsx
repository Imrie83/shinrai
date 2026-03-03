import { Code, Server, Database, Smartphone } from "lucide-react";

// Tech stack is not copy — it doesn't change per language.
// Labels are translated via the bioTechLabel key in translations.js,
// but the actual tech names and categories live here.
const GROUPS = [
  { icon: Code,       labelEn: "Frontend",  labelJa: "フロントエンド", techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"] },
  { icon: Server,     labelEn: "Backend",   labelJa: "バックエンド",   techs: ["Node.js", "Python", "PHP", "REST APIs", "GraphQL"] },
  { icon: Database,   labelEn: "Data",      labelJa: "データ",         techs: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Supabase"] },
  { icon: Smartphone, labelEn: "Tooling",   labelJa: "ツール・環境",   techs: ["Git", "Docker", "Vercel", "AWS", "CI/CD"] },
];

export default function TechStack({ lang = "en" }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 24 }}>
      {GROUPS.map(({ icon: Icon, labelEn, labelJa, techs }) => {
        const label = lang === "ja" ? labelJa : labelEn;
        return (
          <div key={labelEn} style={{
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
              {techs.map(tech => (
                <span key={tech} style={{
                  fontSize: 12, background: "var(--cream)", color: "var(--ink)",
                  padding: "2px 9px", borderRadius: 99, fontWeight: 500,
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
