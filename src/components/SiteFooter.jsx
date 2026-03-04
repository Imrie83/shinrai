import { useLang } from "../context/LangContext";
import { useNav }  from "../context/NavContext";

const SiteFooter = () => {
  const { lang, t } = useLang();
  const { navigate } = useNav();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <button className="site-footer__logo" onClick={() => navigate("home")}>Shinrai<span>.</span></button>
          <span className="site-footer__tagline">{t.footerTagline}</span>
        </div>
        <div className="site-footer__bottom">
          <div className="site-footer__links">
            {[
              [lang === "ja" ? "プライバシーポリシー" : "Privacy Policy", "privacy"],
              [lang === "ja" ? "特定商取引法に基づく表示" : "Specified Commercial Transactions", "tokusho"],
            ].map(([label, page]) => (
              <button key={page} className="site-footer__link" onClick={() => navigate(page)}>{label}</button>
            ))}
          </div>
          <span className="site-footer__copy">© {t.footerCopy}</span>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
