import { motion } from "framer-motion";
import { Languages, Award, Clock, User } from "lucide-react";
import { fadeUp } from "../lib/motion";
const ICONS = { languages: Languages, award: Award, clock: Clock, user: User };
const TrustItem = ({ id, title, desc, index }) => {
  const Icon = ICONS[id] ?? User;
  return (
    <motion.div variants={fadeUp(index * 0.07)} className="trust-item">
      <div className="trust-item__icon"><Icon size={18} color="var(--indigo)" /></div>
      <div><div className="trust-item__title">{title}</div><div className="trust-item__desc">{desc}</div></div>
    </motion.div>
  );
};
export default TrustItem;
