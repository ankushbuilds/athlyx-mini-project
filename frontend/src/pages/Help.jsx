import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import {
  FiUser,
  FiSearch,
  FiLock,
  FiMail,
  FiChevronDown
} from "react-icons/fi";

const Help = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("public");

  return (
    <div className="info-page">
      <Navbar />

      <main className="help-content">
        <section className="help-hero">
          <span className="help-badge">{t("help.support")}</span>

          <h1>{t("help.howCanWeHelp")}</h1>

          <p>
            {t("help.intro")}
          </p>
        </section>

        <section className="help-quick-section">
          <h2>{t("help.quickHelp")}</h2>

          <div className="help-quick-grid">
            <div className="help-quick-card">
              <div className="help-icon">
                <FiUser />
              </div>

              <div>
                <h3>{t("help.profile")}</h3>
                <p>
                  {t("help.profileDescription")}
                </p>
              </div>
            </div>

            <div className="help-quick-card">
              <div className="help-icon">
                <FiSearch />
              </div>

              <div>
                <h3>{t("help.discover")}</h3>
                <p>
                  {t("help.discoverDescription")}
                </p>
              </div>
            </div>

            <div className="help-quick-card">
              <div className="help-icon">
                <FiLock />
              </div>

              <div>
                <h3>{t("help.accountSecurity")}</h3>
                <p>
                  {t("help.accountSecurityDescription")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="help-faq-section">
          <div className="help-section-heading">
            <h2>{t("help.faq")}</h2>
            <p>
              {t("help.faqIntro")}
            </p>
          </div>

          <div className="help-faq-list">
            <details className="help-faq">
              <summary>
                <span>{t("help.createProfileQuestion")}</span>
                <FiChevronDown />
              </summary>

              <p>
                {t("help.createProfileAnswer")}
              </p>
            </details>

            <details className="help-faq">
              <summary>
                <span>{t("help.discoverQuestion")}</span>
                <FiChevronDown />
              </summary>

              <p>
                {t("help.discoverAnswer")}
              </p>
            </details>

            <details className="help-faq">
              <summary>
                <span>{t("help.changePasswordQuestion")}</span>
                <FiChevronDown />
              </summary>

              <p>
                {t("help.changePasswordAnswer")}
              </p>
            </details>

            <details className="help-faq">
              <summary>
                <span>{t("help.changeEmailQuestion")}</span>
                <FiChevronDown />
              </summary>

              <p>
                {t("help.changeEmailAnswer")}
              </p>
            </details>

            <details className="help-faq">
              <summary>
                <span>{t("help.updateProfileQuestion")}</span>
                <FiChevronDown />
              </summary>

              <p>
                {t("help.updateProfileAnswer")}
              </p>
            </details>
          </div>
        </section>

        <section className="help-support-card">
          <div className="help-support-icon">
            <FiMail />
          </div>

          <div className="help-support-content">
            <h2>{t("help.stillNeedHelp")}</h2>

            <p>
              {t("help.supportTeam")}
            </p>
          </div>

          <button onClick={() => navigate("/contact")}>
            {t("help.contactSupport")}
          </button>
        </section>
      </main>
    </div>
  );
};

export default Help;