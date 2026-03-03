import { motion } from "framer-motion";
import { AlignLeft, Layers, Globe, BarChart3 } from "lucide-react";
import { fadeUp } from "../../lib/motion";

// Map translation ids to icons — keeps icons out of translations.js
const ICONS = {
  unclear:   AlignLeft,
  context:   Layers,
  tone:      Globe,
  nextsteps: BarChart3,
};

export default function ProblemCard({ id, title, desc, index }) {
  const Icon = ICONS[id] ?? Globe;
  return (
    <motion.div
      variants={fadeUp(index * 0.07)}
      whileHover={{ y: -4 }}
      style={{
        background: "var(--white)", borderRadius: "var(--radius)",
        padding: "28px 24px", border: "1px solid var(--cream)",
        boxShadow: "var(--shadow-sm)", transition: "box-shadow 0.2s, transform 0.2s",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: "var(--indigo-light)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
      }}>
        <Icon size={20} color="var(--indigo)" />
      </div>
      <div style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--muted)" }}>{desc}</div>
    </motion.div>
  );
}
