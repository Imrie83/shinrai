import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLang } from "../context/LangContext";
import { useNav }  from "../context/NavContext";

// Scroll to a section by id, works regardless of base path
function scrollTo(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

const SiteNav = () => {
  const { lang, setLang, t } = useLang();
  const { page, navigate } = useNav();
  const [open, setOpen] = useState(false);

  function handleNavClick(sectionId) {
    setOpen(false);
    if (page !== "home") {
      // Navigate home first, then scroll after the page has rendered
      navigate("home");
      setTimeout(() => scrollTo(sectionId), 100);
    } else {
      scrollTo(sectionId);
    }
  }

  return (
    <nav className="site-nav">
      <div className="site-nav__bar">
        <button className="site-nav__logo" onClick={() => { navigate("home"); setOpen(false); }}>
          Shinrai<span>.</span>
        </button>

        {/* Desktop links */}
        <div className="site-nav__links">
          {t.nav.map((item, i) => (
            <button key={i} className="site-nav__text-btn" onClick={() => handleNavClick(t.navIds[i])}>
              {item}
            </button>
          ))}
          <div className="site-nav__lang">
            {["en", "ja"].map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`site-nav__lang-btn${lang === l ? " site-nav__lang-btn--active" : ""}`}>
                {l === "en" ? "EN" : "日本語"}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: lang + hamburger */}
        <div className="site-nav__mobile-row">
          <div className="site-nav__lang">
            {["en", "ja"].map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`site-nav__lang-btn${lang === l ? " site-nav__lang-btn--active" : ""}`}>
                {l === "en" ? "EN" : "日本語"}
              </button>
            ))}
          </div>
          <button className="site-nav__hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`site-nav__drawer${open ? " site-nav__drawer--open" : ""}`}>
        {t.nav.map((item, i) => (
          <button key={i} className="site-nav__drawer-btn" onClick={() => handleNavClick(t.navIds[i])}>
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
};
export default SiteNav;
