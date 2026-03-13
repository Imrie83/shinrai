import { useNav } from "./context/NavContext";
import HomePage    from "./pages/HomePage";
import PrivacyPage from "./pages/PrivacyPage";
import TokushoPage from "./pages/TokushoPage";
import AuditPage   from "./pages/AuditPage";
import FaqPage     from "./pages/FaqPage";

export default function App() {
  const { page } = useNav();
  return (
    <main>
      {page === "home"    && <HomePage />}
      {page === "privacy" && <PrivacyPage />}
      {page === "tokusho" && <TokushoPage />}
      {page === "audit"   && <AuditPage />}
      {page === "faq"     && <FaqPage />}
    </main>
  );
}
