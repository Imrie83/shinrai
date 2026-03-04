import { useNav } from "./context/NavContext";
import HomePage    from "./pages/HomePage";
import PrivacyPage from "./pages/PrivacyPage";
import TokushoPage from "./pages/TokushoPage";

export default function App() {
  const { page } = useNav();
  return (
    <>
      {page === "home"    && <HomePage />}
      {page === "privacy" && <PrivacyPage />}
      {page === "tokusho" && <TokushoPage />}
    </>
  );
}
