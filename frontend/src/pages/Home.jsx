import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="home-hero">
          <div className="hero-content">
            <p className="hero-tag">LOCAL TALENT • BIG OPPORTUNITIES</p>

            <h1>
              Discover
              <span> Local Talent.</span>
            </h1>

            <p>
              Athlyx connects athletes, coaches and scouts on one platform.
              Discover promising talent from your local sports community and
              create new opportunities.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/discover")}
              >
                Explore Athletes
              </button>
            </div>
          </div>
        </section>

        <section className="sports-section">
          <div className="section-title">
            <p>EXPLORE</p>
            <h2>Find Talent By Sport</h2>
            <span>Explore athletes across different sports.</span>
          </div>

          <div className="sports-grid">
            <div
              className="sport-card"
              onClick={() => navigate("/discover? sport=Cricket")}
            >
              <span>🏏</span>
              <h3>Cricket</h3>
              <p>Discover cricket talent</p>
            </div>

            <div
              className="sport-card"
              onClick={() => navigate("/discover? sport=Football")}
            >
              <span>⚽</span>
              <h3>Football</h3>
              <p>Discover football talent</p>
            </div>

            <div
              className="sport-card"
              onClick={() => navigate("/discover? sport=Athletics")}
            >
              <span>🏃</span>
              <h3>Athletics</h3>
              <p>Discover athletic talent</p>
            </div>

            <div
              className="sport-card"
              onClick={() => navigate("/discover? sport=Hockey")}
            >
              <span>🏑</span>
              <h3>Hockey</h3>
              <p>Discover hockey talent</p>
            </div>

            <div
              className="sport-card"
              onClick={() => navigate("/discover? sport=Basketball")}
            >
              <span>🏀</span>
              <h3>Basketball</h3>
              <p>Discover basketball talent</p>
            </div>

            <div
              className="sport-card"
              onClick={() => navigate("/discover")}
            >
              <span>＋</span>
              <h3>More Sports</h3>
              <p>Explore more categories</p>
            </div>
          </div>
        </section>

        <section className="talent-section">
          <div className="section-title">
            <p>WHO IS ATHLYX FOR?</p>
            <h2>One Platform For Everyone</h2>
            <span>
              Athlyx brings athletes, coaches and scouts together.
            </span>
          </div>

          <div className="talent-grid">
            <div className="athlete-card">
              <div className="athlete-image">
                <span>ATHLETE</span>
              </div>

              <div className="athlete-info">
                <h3>For Athletes</h3>
                <p>
                  Create your profile, showcase your skills and get discovered
                  by coaches and scouts.
                </p>

                <button onClick={() => navigate("/auth")}>
                  Create Profile →
                </button>
              </div>
            </div>

            <div className="athlete-card">
              <div className="athlete-image">
                <span>COACH</span>
              </div>

              <div className="athlete-info">
                <h3>For Coaches</h3>
                <p>
                  Discover talented athletes and connect with promising local
                  sports talent.
                </p>

                <button onClick={() => navigate("/auth")}>
                  Get Started →
                </button>
              </div>
            </div>

            <div className="athlete-card">
              <div className="athlete-image">
                <span>SCOUT</span>
              </div>

              <div className="athlete-info">
                <h3>For Scouts</h3>
                <p>
                  Find emerging athletes, explore profiles and discover the
                  next potential star.
                </p>

                <button onClick={() => navigate("/auth")}>
                  Start Discovering →
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="how-section">
          <div className="section-title">
            <p>HOW IT WORKS</p>
            <h2>Simple. Discover. Connect. Grow.</h2>
            <span>
              Athlyx makes it easier to discover and connect with local
              sports talent.
            </span>
          </div>

          <div className="how-grid">
            <div className="how-card">
              <span>01</span>
              <h3>Create Profile</h3>
              <p>
                Athletes, coaches and scouts can create their profile and
                showcase their interests and skills.
              </p>
            </div>

            <div className="how-card">
              <span>02</span>
              <h3>Discover Talent</h3>
              <p>
                Explore athletes by sport and find promising local talent
                through the platform.
              </p>
            </div>

            <div className="how-card">
              <span>03</span>
              <h3>Connect</h3>
              <p>
                Build connections between athletes, coaches and scouts and
                create new opportunities.
              </p>
            </div>
          </div>
        </section>

        <section className="home-cta">
          <h2>Ready to discover your next opportunity?</h2>

          <p>
            Join Athlyx and become part of the local sports talent community.
          </p>

          <button onClick={() => navigate("/auth")}>
            Get Started
          </button>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-brand">
          <img src="/logo.png" alt="Athlyx" />
          <span>Athlyx</span>
        </div>

        <p>Discover Local Talent. Create Opportunities.</p>

        <p>© 2026 Athlyx. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;