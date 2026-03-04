import { motion } from "framer-motion";
import { AlignLeft, Layers, Globe, BarChart3 } from "lucide-react";
import { fadeUp } from "../lib/motion";
const ICONS = { unclear: AlignLeft, context: Layers, tone: Globe, nextsteps: BarChart3 };
const ProblemCard = ({ id, title, desc, index }) => {
  const Icon = ICONS[id] ?? Globe;
  return (
    <motion.div variants={fadeUp(index * 0.07)} whileHover={{ y: -4 }} className="problem-card">
      <div className="card-icon"><Icon size={20} color="var(--indigo)" /></div>
      <div className="problem-card__title">{title}</div>
      <div className="problem-card__desc">{desc}</div>
    </motion.div>
  );
};
export default ProblemCard;
