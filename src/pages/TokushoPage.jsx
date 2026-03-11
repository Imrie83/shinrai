import { useLang } from "../context/LangContext";
import LegalShell, { LegalSection, LegalTable } from "../components/LegalShell";
const UPDATED = "2026-01-01";
const ROWS_JA = [
  ["販売者名","Marcin Zielinski"],["所在地","札幌市（番地は請求があり次第開示します）"],
  ["メールアドレス","[your@email.com]"],
  ["サービス内容","英語ウェブサイトのローカライズ、UX改善、英語コピーライティング"],
  ["料金","内容・ボリュームにより異なります。無料診断はお問い合わせください。"],
  ["支払方法","銀行振込（請求書発行後14日以内）"],["サービス提供時期","ご契約・ご入金確認後、通常2週間以内"],
  ["返品・キャンセル","デジタル成果物の性質上、納品後の返金は原則お受けしておりません。仕様を満たさない場合は修正対応いたします。"],
];
const ROWS_EN = [
  ["Seller","Marcin Zielinski"],["Location","Sapporo, Japan (full address available on request)"],
  ["Email","[your@email.com]"],
  ["Services","English website localization, UX improvement, English copywriting"],
  ["Pricing","Varies by scope. Free audit available on request."],
  ["Payment","Bank transfer (due within 14 days of invoice)"],
  ["Delivery","Typically within two weeks of confirmed engagement"],
  ["Cancellations","Refunds not accepted after delivery of digital work. Revisions provided if deliverables don't meet agreed spec."],
];
const TokushoPage = () => {
  const { lang } = useLang();
  if (lang === "ja") return (
    <LegalShell title="特定商取引法に基づく表示" subtitle={`最終更新日：${UPDATED}`}>
      <LegalSection title=""><p>特定商取引法第11条に基づき、以下の事項を表示します。</p><LegalTable rows={ROWS_JA} /></LegalSection>
    </LegalShell>
  );
  return (
    <LegalShell title="Specified Commercial Transactions" subtitle={`Last updated: ${UPDATED}`}>
      <LegalSection title=""><p>Disclosures per Japan's Act on Specified Commercial Transactions (特定商取引法, Article 11).</p><LegalTable rows={ROWS_EN} /></LegalSection>
    </LegalShell>
  );
};
export default TokushoPage;
