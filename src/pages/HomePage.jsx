import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Globe, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

import { fadeUp, stagger } from "../lib/motion";
import { useLang } from "../context/LangContext";
import { useNav }  from "../context/NavContext";
import SectionLabel from "../components/SectionLabel";
import ProblemCard  from "../components/ProblemCard";
import SolutionRow  from "../components/SolutionRow";
import ProcessCard  from "../components/ProcessCard";
import TrustItem    from "../components/TrustItem";
import TechStack    from "../components/TechStack";
import SiteNav      from "../components/SiteNav";
import SiteFooter   from "../components/SiteFooter";

const HomePage = () => {
  const { t } = useLang();
  const { navigate } = useNav();
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const formRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        e.target,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      e.target.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  }

  return (
    <>
      <SiteNav />

      {/* HERO */}
      <section className="section-pad">
        <div className="section-inner grid-hero">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp(0)}>
              <div className="tag" style={{ display:"inline-flex", alignItems:"center", gap:7, marginBottom:28, padding:"6px 13px" }}>
                <Globe size={12} /> {t.badge}
              </div>
            </motion.div>
            <motion.h1 variants={fadeUp(0.05)} className="hero-h1" style={{ marginBottom:24 }}>
              {t.heroTitle.map((line, i) => <span key={i} style={{ display:"block" }}>{line}</span>)}
              {t.heroItalic && <em style={{ fontStyle:"italic", color:"var(--indigo)", display:"block" }}>{t.heroItalic}</em>}
            </motion.h1>
            <motion.p variants={fadeUp(0.1)} style={{ fontSize:16, lineHeight:1.75, color:"var(--muted)", marginBottom:32 }}>{t.heroSub}</motion.p>
            <motion.div variants={fadeUp(0.15)}>
              <button className="btn-primary" onClick={() => formRef.current?.scrollIntoView({ behavior:"smooth" })}>
                {t.cta} <ArrowRight size={15} />
              </button>
              <p style={{ fontSize:13, color:"var(--muted)", marginTop:10, textAlign:"center" }}>{t.ctaSub}</p>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp(0.18)} initial="hidden" animate="show" className="hero-card">
            <div className="hero-card__bar">
              <div className="hero-card__dots">
                {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} className="hero-card__dot" style={{ background:c }} />)}
              </div>
              <div className="hero-card__url">yourcompany.co.jp/en</div>
            </div>
            <div className="hero-card__before">
              <div className="hero-card__label hero-card__label--before">Before</div>
              <div className="hero-card__text hero-card__text--before">"Our company is doing the metal processing since 1987. We have good technology and many customers. Please contact us if you are interesting."</div>
            </div>
            <div className="hero-card__after">
              <div className="hero-card__label hero-card__label--after">After</div>
              <div className="hero-card__text hero-card__text--after">"Precision metal processing since 1987. Trusted by manufacturers across Japan and Southeast Asia. <strong>Request a quote today.</strong>"</div>
              <div className="hero-card__tags">
                {["Clear CTA","Professional tone","Builds trust"].map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEMS */}
      <section id="services" className="section-pad" style={{ background:"var(--cream)" }}>
        <div className="section-inner">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}>
            <motion.div variants={fadeUp()}>
              <SectionLabel>{t.problemsLabel}</SectionLabel>
              <h2 className="section-h2" style={{ marginBottom:10 }}>{t.problemsTitle}</h2>
              <p style={{ fontSize:15, color:"var(--muted)", marginBottom:44 }}>{t.problemsSub}</p>
            </motion.div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
              {t.problems.map((p, i) => <ProblemCard key={p.id} {...p} index={i} />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="section-pad">
        <div className="section-inner grid-solutions">
          <motion.div variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once:true }}>
            <SectionLabel>{t.solutionLabel}</SectionLabel>
            <h2 className="section-h2" style={{ marginBottom:14 }}>{t.solutionTitle}</h2>
            <p style={{ fontSize:15, color:"var(--muted)", lineHeight:1.7 }}>{t.solutionSub}</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}>
            {t.solutions.map((s, i) => <SolutionRow key={i} {...s} isLast={i === t.solutions.length - 1} />)}
          </motion.div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="section-pad" style={{ background:"var(--ink)" }}>
        <div className="section-inner">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}>
            <motion.div variants={fadeUp()}>
              <SectionLabel light>{t.processLabel}</SectionLabel>
              <h2 className="section-h2" style={{ color:"white", marginBottom:10 }}>{t.processTitle}</h2>
              <p style={{ fontSize:15, color:"rgba(255,255,255,0.45)", marginBottom:44 }}>{t.processSub}</p>
            </motion.div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
              {t.process.map((p, i) => <ProcessCard key={p.id} {...p} index={i} />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST + CASE STUDY */}
      <section id="trust" className="section-pad">
        <div className="section-inner grid-2col">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}>
            <motion.div variants={fadeUp()}>
              <SectionLabel>{t.trustLabel}</SectionLabel>
              <h2 className="section-h2" style={{ marginBottom:10 }}>{t.trustTitle}</h2>
              <p style={{ fontSize:15, color:"var(--muted)", marginBottom:32, lineHeight:1.7 }}>{t.trustSub}</p>
            </motion.div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {t.trustList.map((item, i) => <TrustItem key={item.id} {...item} index={i} />)}
            </div>
          </motion.div>
          <motion.div variants={fadeUp(0.18)} initial="hidden" whileInView="show" viewport={{ once:true }} style={{ display:"flex", alignItems:"center" }}>
            <div className="case-card">
              <div className="case-card__label">{t.caseLabel}</div>
              <div className="case-card__title">{t.caseTitle}</div>
              {t.caseRows.map(([label, val]) => (
                <div key={label} className="case-card__row">
                  <div className="case-card__row-label">{label}</div>
                  <div className="case-card__row-val">{val}</div>
                </div>
              ))}
              <div className="case-card__note">{t.caseNote}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BIO */}
      <section id="about" className="section-pad" style={{ background:"var(--cream)" }}>
        <div className="section-inner grid-bio">
          <motion.div variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once:true }}>
            <SectionLabel>{t.bioLabel}</SectionLabel>
            <div className="bio-photo"><img src="/portrait.jpg" alt="Marcin Zielinski" /></div>
            <div style={{ fontFamily:"var(--serif)", fontSize:22, marginBottom:4 }}>{t.bioTitle}</div>
            <div style={{ fontSize:13, color:"var(--muted)", marginBottom:16 }}>{t.bioRole}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {t.bioCredentials.map((c, i) => (
                <div key={i} style={{ display:"flex", gap:9, alignItems:"flex-start", fontSize:13 }}>
                  <CheckCircle2 size={14} color="var(--indigo)" style={{ flexShrink:0, marginTop:2 }} />
                  <span style={{ color:"var(--muted)", lineHeight:1.6 }}>{c}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp(0.1)} initial="hidden" whileInView="show" viewport={{ once:true }}>
            <h2 className="section-h2" style={{ marginBottom:20, marginTop:4 }}>{t.bioTitle}</h2>
            <p style={{ fontSize:15, lineHeight:1.85, color:"var(--muted)", marginBottom:28 }}>{t.bioCopy}</p>
            <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--indigo)", marginBottom:4 }}>{t.bioTechLabel}</p>
            <TechStack groups={t.bioTechGroups} />
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section-pad">
        <div style={{ maxWidth:540, margin:"0 auto" }} ref={formRef}>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}>
            <motion.div variants={fadeUp()} style={{ textAlign:"center", marginBottom:40 }}>
              <SectionLabel>{t.formLabel}</SectionLabel>
              <h2 className="section-h2" style={{ marginBottom:10 }}>{t.formTitle}</h2>
              <p style={{ fontSize:15, color:"var(--muted)" }}>{t.formSub}</p>
            </motion.div>
            {status === "success" ? (
              <motion.div variants={fadeUp()} style={{ textAlign:"center", padding:"48px 32px", background:"var(--white)", borderRadius:20, border:"1px solid var(--cream)" }}>
                <CheckCircle2 size={44} color="var(--indigo)" style={{ margin:"0 auto 14px" }} />
                <div style={{ fontFamily:"var(--serif)", fontSize:22 }}>{t.success}</div>
              </motion.div>
            ) : (
              <motion.form variants={fadeUp(0.08)} onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[{name:"name",type:"text",placeholder:t.name},{name:"email",type:"email",placeholder:t.email},{name:"site",type:"text",placeholder:t.site}].map(f => (
                  <input key={f.name} {...f} required className="form-input" />
                ))}
                {status === "error" && (
                  <div style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 16px", background:"#fff0f0", border:"1px solid #ffc0c0", borderRadius:10, fontSize:14, color:"#c0392b" }}>
                    <XCircle size={16} style={{ flexShrink:0 }} />
                    {t.formError}
                  </div>
                )}
                <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ marginTop:4 }}>
                  {status === "loading" ? t.sending : <>{t.send} <ArrowRight size={15} /></>}
                </button>
              </motion.form>
            )}
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
};
export default HomePage;
