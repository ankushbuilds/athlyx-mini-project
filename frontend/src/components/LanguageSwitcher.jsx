import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import i18n from "../i18n";


const LanguageSwitcher = ({ inline = false }) => {
  const { t } = useTranslation("common");
  const { pathname } = useLocation();

  const hasNavbar = [
    "/home",
    "/discover",
    "/about",
    "/contact",
    "/help"
  ].includes(pathname);

  if (hasNavbar && !inline) {
    return null;
  }

  const currentLanguage = i18n.resolvedLanguage || "en";
  const isHindi = currentLanguage.startsWith("hi");

  const toggleLanguage = () => {
    i18n.changeLanguage(isHindi ? "en" : "hi");
  };

  return (
    <button
      type="button"
      className="language-switcher"
      onClick={toggleLanguage}
      aria-label={t("selectLanguage")}
      aria-pressed={isHindi}
    >
      <span aria-hidden="true">文A</span>
      <span>{isHindi ? "हिंदी" : "English"}</span>
      <span className="language-switcher__arrow" aria-hidden="true">
        ⇄
      </span>
    </button>
  );
};

export default LanguageSwitcher;