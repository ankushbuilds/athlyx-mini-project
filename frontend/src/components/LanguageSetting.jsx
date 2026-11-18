import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const LanguageSetting = () => {
  const { t } = useTranslation("common");

  return (
    <div className="settings-section">
      <h2>{t("language")}</h2>

      <div className="settings-item">
        <div className="settings-item-left">
          <div>
            <h3>{t("language")}</h3>
            <p>{t("languageDescription")}</p>
          </div>
        </div>

        <select
          className="settings-select"
          aria-label={t("selectLanguage")}
          value={i18n.resolvedLanguage || "en"}
          onChange={(event) => i18n.changeLanguage(event.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSetting;
