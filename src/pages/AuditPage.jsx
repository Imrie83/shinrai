import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, ExternalLink, AlertTriangle, Info } from "lucide-react";

import { fadeUp, stagger } from "../lib/motion";
import { useLang } from "../context/LangContext";
import { useNav } from "../context/NavContext";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import SectionLabel from "../components/SectionLabel";

const AUDIT_WORKER_URL = import.meta.env.VITE_AUDIT_WORKER_URL || "http://localhost:8787/audit";

// ─── Rate limiting (3 audits/day via localStorage) ───────────────────────────
const RATE_KEY  = "shinrai_audit_usage";
const DAILY_MAX = 3;

function todayStr() { return new Date().toISOString().slice(0, 10); }

function getRateData() {
  try { const r = localStorage.getItem(RATE_KEY); return r ? JSON.parse(r) : { count: 0, date: "" }; }
  catch { return { count: 0, date: "" }; }
}

function getUsageToday() {
  const d = getRateData(); return d.date === todayStr() ? d.count : 0;
}

function incrementUsage() {
  const today = todayStr();
  const d = getRateData();
  const count = (d.date === today ? d.count : 0) + 1;
  try { localStorage.setItem(RATE_KEY, JSON.stringify({ count, date: today })); } catch {}
  return count;
}

// ─── Result cache (5 days via localStorage) ───────────────────────────────────
const CACHE_TTL_MS = 5 * 24 * 60 * 60 * 1000;

function cacheKey(url, lang) { return `shinrai_cache_${lang}_${url}`; }

function getCached(url, lang) {
  try {
    const raw = localStorage.getItem(cacheKey(url, lang));
    if (!raw) return null;
    const { result, cachedAt } = JSON.parse(raw);
    if (Date.now() - cachedAt > CACHE_TTL_MS) { localStorage.removeItem(cacheKey(url, lang)); return null; }
    return result;
  } catch { return null; }
}

function setCache(url, lang, result) {
  try { localStorage.setItem(cacheKey(url, lang), JSON.stringify({ result, cachedAt: Date.now() })); } catch {}
}

// ─── ScoreRing ────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const radius = 54, stroke = 8;
  const normalised = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalised;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#2e7d32" : score >= 45 ? "#b7770d" : "#c0392b";
  return (
    <div className="audit-score-ring">
      <svg width={120} height={120} viewBox="0 0 120 120">
        <circle cx={60} cy={60} r={normalised} fill="none" stroke="var(--cream)" strokeWidth={stroke} />
        <circle cx={60} cy={60} r={normalised} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="audit-score-ring__label">
        <span className="audit-score-ring__number" style={{ color }}>{score}</span>
        <span className="audit-score-ring__sub">/100</span>
      </div>
    </div>
  );
}

// ─── IssueCard ────────────────────────────────────────────────────────────────
function IssueCard({ issue, t }) {
  const [expanded, setExpanded] = useState(false);
  const SEV = {
    high:   { color: "#c0392b", bg: "#fff0ef", border: "#ffc5c0" },
    medium: { color: "#b7770d", bg: "#fffbf0", border: "#ffe0a0" },
    low:    { color: "#2e7d32", bg: "#f0faf0", border: "#b6e8b6" },
  };
  const cfg = SEV[issue.severity] || SEV.low;
  const typeLabel     = t.auditTypes?.[issue.type] || issue.type;
  const severityLabel = t.auditSeverity?.[issue.severity] || issue.severity;

  return (
    <div className="audit-issue" style={{ borderColor: cfg.border, background: cfg.bg }}>
      <div className="audit-issue__header" onClick={() => setExpanded(e => !e)}>
        <div className="audit-issue__meta">
          <span className="audit-issue__type">{typeLabel}</span>
          <span className="audit-issue__severity" style={{ color: cfg.color, background: `${cfg.color}18` }}>
            {severityLabel}
          </span>
          <span className="audit-issue__location">{issue.location}</span>
        </div>
        <button className="audit-issue__toggle" aria-label="Toggle details">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
            <div className="audit-issue__body">
              {issue.original && (
                <div className="audit-issue__row">
                  <span className="audit-issue__row-label">{t.auditRowFound}</span>
                  <span className="audit-issue__row-value audit-issue__row-value--original">{issue.original}</span>
                </div>
              )}
              {issue.suggestion && (
                <div className="audit-issue__row">
                  <span className="audit-issue__row-label">{t.auditRowSuggestion}</span>
                  <span className="audit-issue__row-value audit-issue__row-value--suggestion">{issue.suggestion}</span>
                </div>
              )}
              {issue.explanation && (
                <div className="audit-issue__row">
                  <span className="audit-issue__row-label">{t.auditRowWhy}</span>
                  <span className="audit-issue__row-value">{issue.explanation}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AuditPage() {
  const { lang, t } = useLang();
  const { navigate, page } = useNav();
  const [url, setUrl]         = useState("");
  const [status, setStatus]   = useState("idle");
  const [result, setResult]   = useState(null);
  const [errMsg, setErrMsg]   = useState("");
  const [fromCache, setFromCache] = useState(false);

  // Holds the AbortController for the in-flight fetch
  const abortRef = useRef(null);

  // Cancel any in-flight request when the component unmounts (user navigates away)
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  function goToContact() {
    navigate("home");
    setTimeout(() => {
      const el = document.querySelector("#contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 120);
  }

  const usageToday = getUsageToday();
  const isLimited  = usageToday >= DAILY_MAX;

  async function handleAudit(e) {
    e.preventDefault();
    if (!url || isLimited) return;

    // Cache hit — free, no counter increment
    const cached = getCached(url, lang);
    if (cached) {
      setResult(cached);
      setFromCache(true);
      setStatus("done");
      return;
    }

    // Re-check rate limit right before the real call
    if (getUsageToday() >= DAILY_MAX) { setStatus("limited"); return; }

    setStatus("loading");
    setResult(null);
    setErrMsg("");
    setFromCache(false);

    // Cancel any previous in-flight request, then create a fresh controller
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res  = await fetch(AUDIT_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, lang }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setErrMsg(err.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      // Read newline-delimited stream — blank lines are keepalives, last line is the result
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let lastJson = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete last chunk
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed) lastJson = trimmed; // non-empty line = real data
        }
      }
      // flush remaining buffer
      if (buffer.trim()) lastJson = buffer.trim();

      if (!lastJson) {
        setErrMsg("No response from audit service.");
        setStatus("error");
        return;
      }

      const data = JSON.parse(lastJson);
      if (data.error) { setErrMsg(data.error); setStatus("error"); return; }

      setCache(url, lang, data);
      incrementUsage();
      setResult(data);
      setStatus("done");
    } catch (err) {
      // Ignore abort errors — user navigated away intentionally
      if (err.name === "AbortError") return;
      setErrMsg("Could not reach the audit service. Please try again in a moment.");
      setStatus("error");
    }
  }

  const counts      = result?.issueCounts || { high: 0, medium: 0, low: 0 };
  const totalIssues = counts.high + counts.medium + counts.low;

  // Flat list: high → medium → low (AI already caps at 2 per severity)
  const sortedIssues = [
    ...(result?.issues?.filter(i => i.severity === "high")   || []),
    ...(result?.issues?.filter(i => i.severity === "medium") || []),
    ...(result?.issues?.filter(i => i.severity === "low")    || []),
  ];
  const hiddenCount = Math.max(0, totalIssues - sortedIssues.length);

  const auditsLeft = Math.max(0, DAILY_MAX - usageToday);

  return (
    <>
      <SiteNav />
      <section className="section-pad">
        <div className="section-inner" style={{ maxWidth: 720 }}>
          <motion.div variants={stagger} initial="hidden" animate="show">

            <motion.div variants={fadeUp(0)}>
              <SectionLabel>{t.auditSectionLabel}</SectionLabel>
              <h1 className="hero-h1" style={{ marginBottom: 16 }}>
                {t.auditTitle[0]}<br />
                <em style={{ fontStyle: "italic", color: "var(--indigo)" }}>{t.auditTitle[1]}</em>
              </h1>
              <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.75, marginBottom: 40 }}>
                {t.auditSub}
              </p>
            </motion.div>

            {/* Form */}
            <motion.form variants={fadeUp(0.08)} onSubmit={handleAudit} className="audit-form">
              <div className="audit-form__row">
                <input
                  type="url" required
                  placeholder={t.auditPlaceholder}
                  value={url} onChange={e => setUrl(e.target.value)}
                  className="form-input audit-form__input"
                  disabled={status === "loading" || isLimited}
                />
                <button type="submit" className="btn-primary audit-form__btn"
                  disabled={status === "loading" || !url || isLimited}>
                  {status === "loading"
                    ? <><span className="audit-spinner" />{t.auditBtnLoading}</>
                    : <>{t.auditBtn} <ArrowRight size={15} /></>}
                </button>
              </div>
              <p className="audit-form__note">
                {t.auditNote}
                {!isLimited && auditsLeft < DAILY_MAX && (
                  <span className="audit-form__usage">
                    {lang === "ja"
                      ? `（本日あと${auditsLeft}回）`
                      : `(${auditsLeft} free audit${auditsLeft === 1 ? "" : "s"} left today)`}
                  </span>
                )}
              </p>
            </motion.form>

            {/* CTA below form */}
            <motion.div variants={fadeUp(0.12)} className="audit-bottom-cta">
              <p>{t.auditCtaText}</p>
              <button className="btn-secondary" onClick={goToContact}>
                {t.auditCtaBtn} <ArrowRight size={15} />
              </button>
            </motion.div>

            {/* Rate limited */}
            {(isLimited || status === "limited") && (
              <motion.div variants={fadeUp()} className="audit-rate-limit">
                <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{t.auditRateLimit}</span>
              </motion.div>
            )}

            {/* Loading */}
            {status === "loading" && (
              <motion.div variants={fadeUp()} className="audit-loading">
                <div className="audit-loading__dots"><span /><span /><span /></div>
                <p>{t.auditLoadingMsg}<br /><small>{t.auditLoadingSub}</small></p>
              </motion.div>
            )}

            {/* Error */}
            {status === "error" && (
              <motion.div variants={fadeUp()} className="audit-error">
                <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{errMsg}</span>
              </motion.div>
            )}

            {/* Results */}
            {status === "done" && result && (
              <motion.div variants={stagger} initial="hidden" animate="show">

                {fromCache && (
                  <motion.div variants={fadeUp()} className="audit-cached-note">
                    <Info size={14} style={{ flexShrink: 0 }} />
                    <span>{t.auditCachedNote}</span>
                  </motion.div>
                )}

                {result.screenshot && (
                  <motion.div variants={fadeUp()} style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>{t.auditScreenshotLabel}</p>
                    <img src={`data:image/jpeg;base64,${result.screenshot}`} alt="Page screenshot"
                      style={{ width: "100%", borderRadius: 12, border: "1px solid var(--cream)",
                        boxShadow: "var(--shadow-sm)", maxHeight: 400, objectFit: "cover", objectPosition: "top" }} />
                  </motion.div>
                )}

                {result.jsWarning && (
                  <motion.div variants={fadeUp()} className="audit-js-warning">
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    <span>{t.auditJsWarning}</span>
                  </motion.div>
                )}

                <motion.div variants={fadeUp()} className="audit-summary">
                  <ScoreRing score={result.score} />
                  <div className="audit-summary__text">
                    <div className="audit-summary__counts">
                      {counts.high   > 0 && <span className="audit-count audit-count--high">{counts.high} {t.auditSeverity.high}</span>}
                      {counts.medium > 0 && <span className="audit-count audit-count--medium">{counts.medium} {t.auditSeverity.medium}</span>}
                      {counts.low    > 0 && <span className="audit-count audit-count--low">{counts.low} {t.auditSeverity.low}</span>}
                      {totalIssues === 0 && (
                        <span className="audit-count audit-count--low">
                          <CheckCircle2 size={13} /> {t.auditNoIssues}
                        </span>
                      )}
                    </div>
                    <p className="audit-summary__body">{result.summary}</p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="audit-source-link">
                      <ExternalLink size={12} /> {url}
                    </a>
                  </div>
                </motion.div>

                {sortedIssues.length > 0 && (
                  <motion.div variants={fadeUp(0.1)}>
                    <div className="audit-issues-header">
                      <h2 style={{ fontFamily: "var(--serif)", fontSize: 22 }}>{t.auditIssuesHeader}</h2>
                      <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.auditIssuesNote}</span>
                    </div>

                    {/* Sample banner shown when AI found more issues than it returned */}
                    {hiddenCount > 0 && (
                      <div className="audit-sample-banner">
                        <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{t.auditSampleBanner(totalIssues)}</span>
                      </div>
                    )}

                    <div className="audit-issues-list">
                      {sortedIssues.map((issue, i) => (
                        <IssueCard key={i} issue={issue} t={t} />
                      ))}
                    </div>
                  </motion.div>
                )}

              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
