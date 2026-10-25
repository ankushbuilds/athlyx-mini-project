import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("public");

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="home-hero">
          <div className="hero-content">
            <p className="hero-tag">{t("home.heroTag")}</p>

            <h1>
              {t("home.discover")}
              <span>{t("home.localTalent")}</span>
            </h1>

            <p>{t("home.heroDescription")}</p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate("/auth")}
              >
                {t("home.joinAthlyx")}
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/discover")}
              >
                {t("home.exploreAthletes")}
              </button>
            </div>
          </div>
        </section>

        <section className="sports-section">
          <div className="section-title">
            <p>{t("home.explore")}</p>
            <h2>{t("home.findTalentBySport")}</h2>
            <span>{t("home.exploreSports")}</span>
          </div>

          <div className="sports-grid">
            <div
              className="sport-card"
              onClick={() => navigate("/discover? sport=Cricket")}
            >
              <span>🏏</span>
              <h3>{t("home.cricket")}</h3>
              <p>{t("home.discoverCricket")}</p>
            </div>

            <div
              className="sport-card"
              onClick={() => navigate("/discover? sport=Football")}
            >
              <span>⚽</span>
              <h3>{t("home.football")}</h3>
              <p>{t("home.discoverFootball")}</p>
            </div>

            <div
              className="sport-card"
              onClick={() => navigate("/discover? sport=Athletics")}
            >
              <span>🏃</span>
              <h3>{t("home.athletics")}</h3>
              <p>{t("home.discoverAthletics")}</p>
            </div>

            <div
              className="sport-card"
              onClick={() => navigate("/discover? sport=Hockey")}
            >
              <span>🏑</span>
              <h3>{t("home.hockey")}</h3>
              <p>{t("home.discoverHockey")}</p>
            </div>

            <div
              className="sport-card"
              onClick={() => navigate("/discover? sport=Basketball")}
            >
              <span>🏀</span>
              <h3>{t("home.basketball")}</h3>
              <p>{t("home.discoverBasketball")}</p>
            </div>

            <div
              className="sport-card"
              onClick={() => navigate("/discover")}
            >
              <span>＋</span>
              <h3>{t("home.moreSports")}</h3>
              <p>{t("home.exploreMore")}</p>
            </div>
          </div>
        </section>

        <section className="talent-section">
          <div className="section-title">
            <p>{t("home.whoIsAthlyxFor")}</p>
            <h2>{t("home.onePlatform")}</h2>
            <span>
              {t("home.everyoneDescription")}
            </span>
          </div>

          <div className="talent-grid">
            <div className="athlete-card">
              <div className="athlete-image">
                <span>{t("home.athlete")}</span>
              </div>

              <div className="athlete-info">
                <h3>{t("home.forAthletes")}</h3>
                <p>{t("home.athletesDescription")}</p>

                <button onClick={() => navigate("/auth")}>
                  {t("home.createProfile")}
                </button>
              </div>
            </div>

            <div className="athlete-card">
              <div className="athlete-image">
                <span>{t("home.coach")}</span>
              </div>

              <div className="athlete-info">
                <h3>{t("home.forCoaches")}</h3>
                <p>{t("home.coachesDescription")}</p>

                <button onClick={() => navigate("/auth")}>
                  {t("home.getStarted")}
                </button>
              </div>
            </div>

            <div className="athlete-card">
              <div className="athlete-image">
                <span>{t("home.scout")}</span>
              </div>

              <div className="athlete-info">
                <h3>{t("home.forScouts")}</h3>
                <p>{t("home.scoutsDescription")}</p>

                <button onClick={() => navigate("/auth")}>
                  {t("home.startDiscovering")}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="how-section">
          <div className="section-title">
            <p>{t("home.howItWorks")}</p>
            <h2>{t("home.stepsTitle")}</h2>
            <span>{t("home.stepsDescription")}</span>
          </div>

          <div className="how-grid">
            <div className="how-card">
              <span>01</span>
              <h3>{t("home.createProfileStep")}</h3>
              <p>{t("home.profileStepDescription")}</p>
            </div>

            <div className="how-card">
              <span>02</span>
              <h3>{t("home.discoverTalent")}</h3>
              <p>{t("home.discoverStepDescription")}</p>
            </div>

            <div className="how-card">
              <span>03</span>
              <h3>{t("home.connect")}</h3>
              <p>{t("home.connectStepDescription")}</p>
            </div>
          </div>
        </section>

        <section className="home-cta">
          <h2>{t("home.readyForOpportunity")}</h2>

          <p>
            {t("home.joinCommunity")}
          </p>

          <button onClick={() => navigate("/auth")}>
            {t("home.joinNow")}
          </button>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-brand">
          <img src="/logo.png" alt="Athlyx" />
          <span>Athlyx</span>
        </div>

        <p>{t("home.footerTagline")}</p>

        <p>{t("home.copyright")}</p>
      </footer>
    </div>
  );
};

export default Home;