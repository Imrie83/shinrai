import { motion } from "framer-motion";
import { Search, FileText, Wrench, TrendingUp } from "lucide-react";
import { fadeUp } from "../../lib/motion";

const ICONS = {
  audit:  Search,
  report: FileText,
  fix:    Wrench,
  review: TrendingUp,
};

export default function ProcessCard({ id, step, title, desc, index }) {
  const Icon = ICONS[id] ?? Search;
  return (
    <motion.div
      variants={fadeUp(index * 0.09)}
      whileHover={{ y: -4 }}
      style={{
        background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius)",
        padding: "32px 24px", border: "1px solid rgba(255,255,255,0.1)",
        position: "relative", overflow: "hidden", transition: "transform 0.2s",
      }}
    >
      <div style={{
        position: "absolute", top: 16, right: 20,
        fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 52,
        color: "rgba(255,255,255,0.06)", lineHeight: 1, userSelect: "none",
      }}>
        {step}
      </div>
      <div style={{
        width: 48, height: 48, borderRadius: 14, background: "var(--indigo)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
      }}>
        <Icon size={22} color="white" />
      </div>
      <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "white", marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.55)" }}>{desc}</div>
    </motion.div>
  );
}
