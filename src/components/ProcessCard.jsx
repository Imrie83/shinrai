import { motion } from "framer-motion";
import { Search, FileText, Wrench, TrendingUp } from "lucide-react";
import { fadeUp } from "../lib/motion";
const ICONS = { search: Search, report: FileText, fix: Wrench, results: TrendingUp };
const ProcessCard = ({ id, step, title, desc, index }) => {
  const Icon = ICONS[id] ?? Search;
  return (
    <motion.div variants={fadeUp(index * 0.09)} whileHover={{ y: -4 }} className="process-card">
      <div className="process-card__step">{step}</div>
      <div className="process-card__icon"><Icon size={22} color="white" /></div>
      <div className="process-card__title">{title}</div>
      <div className="process-card__desc">{desc}</div>
    </motion.div>
  );
};
export default ProcessCard;
