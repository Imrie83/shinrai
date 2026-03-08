import { useNav } from "./context/NavContext";
import HomePage    from "./pages/HomePage";
import PrivacyPage from "./pages/PrivacyPage";
import TokushoPage from "./pages/TokushoPage";
import AuditPage   from "./pages/AuditPage";

export default function App() {
  const { page } = useNav();
  return (
    <main>
      {page === "home"    && <HomePage />}
      {page === "privacy" && <PrivacyPage />}
      {page === "tokusho" && <TokushoPage />}
      {page === "audit"   && <AuditPage />}
    </main>
  );
}
