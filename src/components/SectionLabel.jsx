const SectionLabel = ({ children, light }) => (
  <div className={`section-label${light ? " section-label--light" : ""}`}>
    <span className="section-label__line" />{children}
  </div>
);

export default SectionLabel;
