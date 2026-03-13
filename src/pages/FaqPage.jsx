import { useLang } from "../context/LangContext";
import LegalShell, { LegalSection } from "../components/LegalShell";

const FaqPage = () => {
  const { t } = useLang();
  return (
    <LegalShell title={t.faqTitle} subtitle="">
      <LegalSection title="">
        {t.faq.map((item, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{item.q}</p>
            <p style={{ fontSize: 15, lineHeight: 1.75 }}>{item.a}</p>
          </div>
        ))}
      </LegalSection>
    </LegalShell>
  );
};
export default FaqPage;
