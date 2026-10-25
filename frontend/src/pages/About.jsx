import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import {
  FiTarget,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiShield,
  FiZap
} from "react-icons/fi";

const About = () => {
  const { t } = useTranslation("public");

  return (
    <div className="info-page">
      <Navbar />

      <main className="info-content">
        <div className="info-card about-card">

          <div className="about-hero">
            <div className="info-card-header about-header">
              <span className="info-label">{t("about.label")}</span>

              <h1>
                {t("about.headline")}
                <br />
                <span>{t("about.headlineSecondLine")}</span>
              </h1>

              <p>
                {t("about.intro")}
              </p>
            </div>

            <div className="about-logo-box">
              <div className="about-logo-glow"></div>
              <img src="/logo.png" alt="Athlyx Logo" />
              <span>ATHLYX</span>
              <small>{t("about.sportsPlatform")}</small>
            </div>
          </div>

          <div className="about-intro">
            <div className="about-intro-icon">
              <FiTarget />
            </div>

            <div>
              <h2>{t("about.whatIs")}</h2>

              <p>
                {t("about.whatIsDescription")}
              </p>
            </div>
          </div>

          <div className="about-divider"></div>

          <div className="about-section">
            <div className="section-heading">
              <span className="info-label">{t("about.purpose")}</span>

              <h2>{t("about.whatWeDo")}</h2>

              <p>
                {t("about.whatWeDoDescription")}
              </p>
            </div>

            <div className="about-grid">

              <div className="about-item">
                <div className="about-item-icon">
                  <FiUsers />
                </div>

                <h3>{t("about.connectAthletes")}</h3>

                <p>
                  {t("about.connectAthletesDescription")}
                </p>
              </div>

              <div className="about-item">
                <div className="about-item-icon">
                  <FiAward />
                </div>

                <h3>{t("about.showcaseTalent")}</h3>

                <p>
                  {t("about.showcaseTalentDescription")}
                </p>
              </div>

              <div className="about-item">
                <div className="about-item-icon">
                  <FiTrendingUp />
                </div>

                <h3>{t("about.createOpportunities")}</h3>

                <p>
                  {t("about.createOpportunitiesDescription")}
                </p>
              </div>

            </div>
          </div>

          <div className="about-divider"></div>

          <div className="about-mission">
            <div>
              <span className="info-label">{t("about.vision")}</span>

              <h2>
                {t("about.visionHeadline")}
              </h2>
            </div>

            <p>
              {t("about.visionDescription")}
            </p>
          </div>

          <div className="about-divider"></div>

          <div className="about-values">
            <div className="section-heading">
              <span className="info-label">{t("about.whyAthlyx")}</span>

              <h2>{t("about.builtAroundTalent")}</h2>

              <p>
                {t("about.builtAroundTalentDescription")}
              </p>
            </div>

            <div className="values-grid">

              <div className="value-item">
                <FiShield />
                <div>
                  <h3>{t("about.professionalProfiles")}</h3>
                  <p>
                    {t("about.professionalProfilesDescription")}
                  </p>
                </div>
              </div>

              <div className="value-item">
                <FiZap />
                <div>
                  <h3>{t("about.talentDiscovery")}</h3>
                  <p>
                    {t("about.talentDiscoveryDescription")}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="about-roles">

            <div className="section-heading">
              <span className="info-label">{t("about.community")}</span>

              <h2>{t("about.sportsCommunity")}</h2>

              <p>
                {t("about.sportsCommunityDescription")}
              </p>
            </div>

            <div className="role-list">
              <span>{t("about.athletes")}</span>
              <span>{t("about.coaches")}</span>
              <span>{t("about.scouts")}</span>
              <span>{t("about.academies")}</span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default About;