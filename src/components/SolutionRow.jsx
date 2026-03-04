import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";
const SolutionRow = ({ num, title, desc, isLast }) => (
  <motion.div variants={fadeUp()} className={`solution-row${isLast ? " solution-row--last" : ""}`}>
    <div className="solution-row__grid">
      <span className="solution-row__num">{num}</span>
      <span className="solution-row__title">{title}</span>
      <span className="solution-row__desc">{desc}</span>
    </div>
  </motion.div>
);
export default SolutionRow;
