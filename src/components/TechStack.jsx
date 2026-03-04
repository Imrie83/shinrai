import { Code, Server, Database, Smartphone } from "lucide-react";

const ICONS = { frontend: Code, backend: Server, data: Database, tooling: Smartphone };

const TechStack = ({ groups }) => (
  <div className="tech-stack">
    {groups.map(({ id, label, techs }) => {
      const Icon = ICONS[id] ?? Code;

      return (
        <div key={id} className="tech-group">
          <div className="tech-group__header">
            <div className="tech-group__icon"><Icon size={14} color="var(--indigo)" /></div>
            <span className="tech-group__label">{label}</span>
          </div>
          <div className="tech-group__pills">
            {techs.map(t => <span key={t} className="tech-group__pill">{t}</span>)}
          </div>
        </div>
      );
    })}
  </div>
);

export default TechStack;
