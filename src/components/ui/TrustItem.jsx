import { motion } from "framer-motion";
import { Languages, Award, Clock, User } from "lucide-react";
import { fadeUp } from "../../lib/motion";

const ICONS = {
  dev:    Languages,
  human:  Award,
  fast:   Clock,
  direct: User,
};

export default function TrustItem({ id, title, desc, index }) {
  const Icon = ICONS[id] ?? User;
  return (
    <motion.div
      variants={fadeUp(index * 0.07)}
      style={{
        display: "flex", gap: 18, alignItems: "flex-start",
        padding: "20px 22px", background: "var(--white)",
        borderRadius: "var(--radius)", border: "1px solid var(--cream)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: "var(--indigo-light)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1,
      }}>
        <Icon size={18} color="var(--indigo)" />
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--muted)" }}>{desc}</div>
      </div>
    </motion.div>
  );
}
