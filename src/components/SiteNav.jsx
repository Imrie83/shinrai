import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLang } from "../context/LangContext";
import { useNav }  from "../context/NavContext";

const SiteNav = () => {
  const { lang, setLang, t } = useLang();
  const { navigate } = useNav();
  const [open, setOpen] = useState(false);
  return (
    <nav className="site-nav">
      <div className="site-nav__bar">
        <button className="site-nav__logo" onClick={() => { navigate("home"); setOpen(false); }}>
          Shinrai<span>.</span>
        </button>
        <div className="site-nav__links">
          {t.nav.map((item, i) => (
            <a key={i} href={t.navIds[i]}
              onClick={e => { if (window.location.pathname !== "/") { e.preventDefault(); navigate("home"); } }}>
              {item}
            </a>
          ))}
          <div className="site-nav__lang">
            {["en","ja"].map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`site-nav__lang-btn${lang === l ? " site-nav__lang-btn--active" : ""}`}>
                {l === "en" ? "EN" : "日本語"}
              </button>
            ))}
          </div>
        </div>
        <div className="site-nav__mobile-row">
          <div className="site-nav__lang">
            {["en","ja"].map(l => (
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
      <div className={`site-nav__drawer${open ? " site-nav__drawer--open" : ""}`}>
        {t.nav.map((item, i) => (
          <a key={i} href={t.navIds[i]}
            onClick={e => { setOpen(false); if (window.location.pathname !== "/") { e.preventDefault(); navigate("home"); } }}>
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
};
export default SiteNav;
