import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Globe, ArrowRight, CheckCircle2, User,
} from "lucide-react";
import { fadeUp, stagger } from "../lib/motion";
import SectionLabel from "../components/SectionLabel";
import ProblemCard  from "../components/ProblemCard";
import SolutionRow  from "../components/SolutionRow";
import ProcessCard  from "../components/ProcessCard";
import TrustItem    from "../components/TrustItem";
import TechStack    from "../components/TechStack";
import SiteNav      from "../components/SiteNav";
import SiteFooter   from "../components/SiteFooter";

const PRIMARY_BTN = {
  display: "inline-flex", alignItems: "center", gap: 10,
  background: "var(--indigo)", color: "white", padding: "14px 28px",
  borderRadius: 12, border: "none", fontFamily: "var(--sans)",
  fontSize: 15, fontWeight: 600, cursor: "pointer",
  boxShadow: "0 4px 20px rgba(44,63,160,0.25)", transition: "background 0.2s, transform 0.15s",
};

const HomePage = ({ lang, setLang, navigate, t }) => {
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.target).entries());
    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSent(true);
    } catch {
      alert("Error sending form");
    }
    setLoading(false);
  }

  return (
    <>
      <SiteNav lang={lang} setLang={setLang} navigate={navigate} t={t} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1080, margin: "0 auto", padding: "80px 24px 100px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center",
      }}>
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp(0)}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "var(--indigo-light)", color: "var(--indigo)",
              fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "6px 13px", borderRadius: 99, marginBottom: 28,
            }}>
              <Globe size={12} /> {t.badge}
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp(0.05)} style={{
            fontFamily: "var(--serif)", fontSize: 50, lineHeight: 1.1,
            letterSpacing: "-0.02em", marginBottom: 24,
          }}>
            {t.heroTitle.map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
            {t.heroItalic && (
              <em style={{ fontStyle: "italic", color: "var(--indigo)", display: "block" }}>{t.heroItalic}</em>
            )}
          </motion.h1>

          <motion.p variants={fadeUp(0.1)} style={{
            fontSize: 16, lineHeight: 1.75, color: "var(--muted)", maxWidth: 420, marginBottom: 36,
          }}>{t.heroSub}</motion.p>

          <motion.div variants={fadeUp(0.15)} style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <button
              style={PRIMARY_BTN}
              onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--indigo-dark)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--indigo)";      e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {t.cta} <ArrowRight size={15} />
            </button>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.ctaSub}</span>
          </motion.div>
        </motion.div>

        {/* Before / After card */}
        <motion.div variants={fadeUp(0.18)} initial="hidden" animate="show">
          <div style={{
            background: "var(--white)", borderRadius: 20,
            border: "1px solid var(--cream)", overflow: "hidden", boxShadow: "var(--shadow-lg)",
          }}>
            <div style={{ background: "var(--indigo)", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", gap: 5 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 6,
                padding: "3px 11px", fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "monospace",
              }}>yourcompany.co.jp/en</div>
            </div>

            <div style={{ padding: "18px 18px 0", borderBottom: "1px solid var(--cream)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c0392b", marginBottom: 8 }}>Before</div>
              <div style={{
                background: "#fff8f8", borderRadius: 10, padding: "14px 16px",
                border: "1px solid #ffe0e0", marginBottom: 16,
                fontSize: 13, lineHeight: 1.65, color: "#888", fontStyle: "italic",
              }}>
                "Our company is doing the metal processing since 1987. We have good technology and many customers. Please contact us if you are interesting."
              </div>
            </div>

            <div style={{ padding: "18px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#27ae60", marginBottom: 8 }}>After</div>
              <div style={{
                background: "#f0faf5", borderRadius: 10, padding: "14px 16px",
                border: "1px solid #b6e8cc", marginBottom: 12,
                fontSize: 13, lineHeight: 1.65, color: "#222",
              }}>
                "Precision metal processing since 1987. Trusted by manufacturers across Japan and Southeast Asia. <strong>Request a quote today.</strong>"
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Clear CTA", "Professional tone", "Builds trust"].map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── PROBLEMS ─────────────────────────────────────────────────────── */}
      <section id="services" style={{ background: "var(--cream)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div variants={fadeUp()}>
              <SectionLabel>{t.problemsLabel}</SectionLabel>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 38, letterSpacing: "-0.02em", marginBottom: 10 }}>{t.problemsTitle}</h2>
              <p style={{ fontSize: 15, color: "var(--muted)", marginBottom: 44, maxWidth: 540 }}>{t.problemsSub}</p>
            </motion.div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 20 }}>
              {t.problems.map((p, i) => <ProblemCard key={i} {...p} index={i} />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SOLUTIONS ────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64 }}>
          <motion.div variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionLabel>{t.solutionLabel}</SectionLabel>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 38, letterSpacing: "-0.02em", marginBottom: 14 }}>{t.solutionTitle}</h2>
            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7 }}>{t.solutionSub}</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {t.solutions.map((s, i) => (
              <SolutionRow key={i} {...s} isLast={i === t.solutions.length - 1} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────────────── */}
      <section id="process" style={{ background: "var(--ink)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div variants={fadeUp()}>
              <SectionLabel light>{t.processLabel}</SectionLabel>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 38, letterSpacing: "-0.02em", color: "white", marginBottom: 10 }}>{t.processTitle}</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 44, maxWidth: 460 }}>{t.processSub}</p>
            </motion.div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 20 }}>
              {t.process.map((p, i) => <ProcessCard key={i} {...p} index={i} />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST + CASE STUDY ───────────────────────────────────────────── */}
      <section id="trust" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div variants={fadeUp()}>
              <SectionLabel>{t.trustLabel}</SectionLabel>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 38, letterSpacing: "-0.02em", marginBottom: 10 }}>{t.trustTitle}</h2>
              <p style={{ fontSize: 15, color: "var(--muted)", marginBottom: 32, lineHeight: 1.7 }}>{t.trustSub}</p>
            </motion.div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {t.trustList.map((item, i) => <TrustItem key={i} {...item} index={i} />)}
            </div>
          </motion.div>

          <motion.div variants={fadeUp(0.18)} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ background: "var(--indigo)", borderRadius: 20, padding: "40px 36px", color: "white", width: "100%" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20 }}>
                {t.caseLabel}
              </div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, marginBottom: 28 }}>{t.caseTitle}</div>
              {t.caseRows.map(([label, val]) => (
                <div key={label} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>{val}</div>
                </div>
              ))}
              <div style={{
                marginTop: 20, padding: "12px 16px", background: "rgba(255,255,255,0.07)",
                borderRadius: 10, fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6,
              }}>{t.caseNote}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BIO ──────────────────────────────────────────────────────────── */}
      <section id="about" style={{ background: "var(--cream)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 64, alignItems: "start" }}>
          <motion.div variants={fadeUp()} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionLabel>{t.bioLabel}</SectionLabel>
            <div style={{
              width: "100%", aspectRatio: "4/5", maxWidth: 280,
              background: "var(--indigo-light)", borderRadius: 20,
              border: "2px dashed var(--indigo)", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 10,
              marginBottom: 22, color: "var(--indigo)",
            }}>
              <User size={44} strokeWidth={1} />
              <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.6 }}>Your photo here</div>
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 4 }}>{t.bioTitle}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 18 }}>{t.bioRole}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {t.bioCredentials.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13 }}>
                  <CheckCircle2 size={14} color="var(--indigo)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: "var(--muted)", lineHeight: 1.6 }}>{c}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 38, letterSpacing: "-0.02em", marginBottom: 22, marginTop: 44 }}>
              {t.bioTitle}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: "var(--muted)", marginBottom: 32 }}>{t.bioCopy}</p>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--indigo)", marginBottom: 4 }}>
              {t.bioTechLabel}
            </div>
            <TechStack groups={t.bioTechGroups} />
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT FORM ─────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }} ref={formRef}>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <motion.div variants={fadeUp()} style={{ textAlign: "center", marginBottom: 40 }}>
              <SectionLabel>{t.formLabel}</SectionLabel>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 38, letterSpacing: "-0.02em", marginBottom: 10 }}>{t.formTitle}</h2>
              <p style={{ fontSize: 15, color: "var(--muted)" }}>{t.formSub}</p>
            </motion.div>

            {!sent ? (
              <motion.form variants={fadeUp(0.08)} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { name: "name",  type: "text",  placeholder: t.name },
                  { name: "email", type: "email", placeholder: t.email },
                  { name: "site",  type: "text",  placeholder: t.site },
                ].map((f) => (
                  <input
                    key={f.name} {...f} required
                    style={{
                      width: "100%", padding: "15px 18px", background: "var(--white)",
                      border: "1px solid var(--cream)", borderRadius: 12,
                      fontSize: 15, fontFamily: "var(--sans)", color: "var(--ink)",
                      outline: "none", transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--indigo)")}
                    onBlur={(e)  => (e.target.style.borderColor = "var(--cream)")}
                  />
                ))}
                <button
                  type="submit" disabled={loading}
                  style={{
                    ...PRIMARY_BTN, justifyContent: "center", padding: "16px 32px", marginTop: 4,
                    cursor: loading ? "default" : "pointer",
                    background: loading ? "#8892c8" : "var(--indigo)",
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "var(--indigo-dark)"; e.currentTarget.style.transform = "translateY(-2px)"; }}}
                  onMouseLeave={(e) => { e.currentTarget.style.background = loading ? "#8892c8" : "var(--indigo)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {loading ? t.sending : <>{t.send} <ArrowRight size={15} /></>}
                </button>
              </motion.form>
            ) : (
              <motion.div variants={fadeUp()} style={{
                textAlign: "center", padding: "48px 32px",
                background: "var(--white)", borderRadius: 20, border: "1px solid var(--cream)",
              }}>
                <CheckCircle2 size={44} color="var(--indigo)" style={{ margin: "0 auto 14px" }} />
                <div style={{ fontFamily: "var(--serif)", fontSize: 22 }}>{t.success}</div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <SiteFooter lang={lang} navigate={navigate} t={t} />
    </>
  );
};

export default HomePage;
