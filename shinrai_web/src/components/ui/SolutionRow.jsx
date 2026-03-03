import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motion";

export default function SolutionRow({ num, title, desc, isLast }) {
  return (
    <motion.div
      variants={fadeUp()}
      style={{
        display: "grid", gridTemplateColumns: "52px 1fr 2fr",
        gap: "0 28px", alignItems: "start",
        padding: "26px 0",
        borderBottom: isLast ? "none" : "1px solid var(--cream)",
      }}
    >
      <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22, color: "var(--accent)", paddingTop: 2 }}>
        {num}
      </span>
      <span style={{ fontWeight: 600, fontSize: 15, paddingTop: 2 }}>{title}</span>
      <span style={{ fontSize: 14, lineHeight: 1.7, color: "var(--muted)" }}>{desc}</span>
    </motion.div>
  );
}
