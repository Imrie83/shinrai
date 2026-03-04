import { useLang } from "../context/LangContext";
import LegalShell, { LegalSection } from "../components/LegalShell";

const UPDATED = "2026-01-01";

const PrivacyPage = () => {
  const { lang } = useLang();

  if (lang === "ja") return (
    <LegalShell title="プライバシーポリシー" subtitle={`最終更新日：${UPDATED}`}>
      <LegalSection title="1. 収集する情報"><p>お問い合わせフォームを通じて、お名前・メールアドレス・ウェブサイトURLをお預かりします。</p></LegalSection>
      <LegalSection title="2. 利用目的"><ul><li>お問い合わせへの返信およびサービス提供</li><li>サービス品質の改善</li><li>法令上の義務の履行</li></ul></LegalSection>
      <LegalSection title="3. 第三者への提供"><p>ご本人の同意がある場合を除き、個人情報を第三者に提供することはありません。</p></LegalSection>
      <LegalSection title="4. データの保管"><p>サービス提供に必要な期間のみ保管し、不要となった情報は速やかに削除します。</p></LegalSection>
      <LegalSection title="5. クッキー"><p>現在、マーケティング目的のクッキーは使用していません。</p></LegalSection>
      <LegalSection title="6. お客様の権利"><p>個人情報の開示・訂正・削除はいつでも請求できます。📧 <strong>[your@email.com]</strong></p></LegalSection>
      <LegalSection title="7. お問い合わせ"><p>ご不明な点は <strong>[your@email.com]</strong> までご連絡ください。</p></LegalSection>
    </LegalShell>
  );

  return (
    <LegalShell title="Privacy Policy" subtitle={`Last updated: ${UPDATED}`}>
      <LegalSection title="1. Information Collected"><p>Via the contact form I collect your name, email address, and website URL.</p></LegalSection>
      <LegalSection title="2. How It's Used"><ul><li>To respond to your enquiry and deliver the service</li><li>To improve service quality</li><li>To comply with legal obligations</li></ul></LegalSection>
      <LegalSection title="3. Sharing"><p>Your data is never sold or shared with third parties, except with your consent or when required by law.</p></LegalSection>
      <LegalSection title="4. Retention"><p>Data is kept only as long as needed and deleted promptly when no longer required.</p></LegalSection>
      <LegalSection title="5. Cookies"><p>No marketing or tracking cookies are currently used.</p></LegalSection>
      <LegalSection title="6. Your Rights"><p>You can request access, correction, or deletion of your data at any time. 📧 <strong>[your@email.com]</strong></p></LegalSection>
      <LegalSection title="7. Contact"><p>Questions: <strong>[your@email.com]</strong></p></LegalSection>
    </LegalShell>
  );
};

export default PrivacyPage;
