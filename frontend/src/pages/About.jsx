import Navbar from "../components/Navbar";
import {
  FiTarget,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiShield,
  FiZap
} from "react-icons/fi";

const About = () => {
  return (
    <div className="info-page">
      <Navbar />

      <main className="info-content">
        <div className="info-card about-card">

          <div className="about-hero">
            <div className="info-card-header about-header">
              <span className="info-label">ABOUT ATHLYX</span>

              <h1>
                Discover Talent.
                <br />
                <span>Create Opportunities.</span>
              </h1>

              <p>
                Athlyx is a digital platform built to connect athletes with
                coaches, scouts and academies through a simple and professional
                talent discovery experience.
              </p>
            </div>

            <div className="about-logo-box">
              <div className="about-logo-glow"></div>
              <img src="/logo.png" alt="Athlyx Logo" />
              <span>ATHLYX</span>
              <small>SPORTS TALENT PLATFORM</small>
            </div>
          </div>

          <div className="about-intro">
            <div className="about-intro-icon">
              <FiTarget />
            </div>

            <div>
              <h2>What is Athlyx?</h2>

              <p>
                Athlyx provides athletes with a dedicated space to showcase
                their sporting profile, skills, achievements and experience.
                At the same time, coaches, scouts and academies can discover
                promising talent and explore new opportunities.
              </p>
            </div>
          </div>

          <div className="about-divider"></div>

          <div className="about-section">
            <div className="section-heading">
              <span className="info-label">OUR PURPOSE</span>

              <h2>What We Do</h2>

              <p>
                We bring athletes and sports professionals together on one
                centralized platform.
              </p>
            </div>

            <div className="about-grid">

              <div className="about-item">
                <div className="about-item-icon">
                  <FiUsers />
                </div>

                <h3>Connect Athletes</h3>

                <p>
                  Help athletes create professional profiles and connect
                  with coaches, scouts and academies.
                </p>
              </div>

              <div className="about-item">
                <div className="about-item-icon">
                  <FiAward />
                </div>

                <h3>Showcase Talent</h3>

                <p>
                  Give athletes a platform to highlight their skills,
                  achievements, experience and sporting journey.
                </p>
              </div>

              <div className="about-item">
                <div className="about-item-icon">
                  <FiTrendingUp />
                </div>

                <h3>Create Opportunities</h3>

                <p>
                  Make it easier for sports professionals to discover
                  talented athletes and potential opportunities.
                </p>
              </div>

            </div>
          </div>

          <div className="about-divider"></div>

          <div className="about-mission">
            <div>
              <span className="info-label">OUR VISION</span>

              <h2>
                Making sports talent easier to discover.
              </h2>
            </div>

            <p>
              Our vision is to build a centralized sports ecosystem where
              talent can be discovered based on skills, achievements and
              potential rather than simply who they know.
            </p>
          </div>

          <div className="about-divider"></div>

          <div className="about-values">
            <div className="section-heading">
              <span className="info-label">WHY ATHLYX</span>

              <h2>Built Around Talent</h2>

              <p>
                Athlyx focuses on creating a professional and accessible
                environment for the entire sports community.
              </p>
            </div>

            <div className="values-grid">

              <div className="value-item">
                <FiShield />
                <div>
                  <h3>Professional Profiles</h3>
                  <p>
                    Present sporting information in one organized profile.
                  </p>
                </div>
              </div>

              <div className="value-item">
                <FiZap />
                <div>
                  <h3>Talent Discovery</h3>
                  <p>
                    Make discovering promising athletes simpler and faster.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="about-roles">

            <div className="section-heading">
              <span className="info-label">COMMUNITY</span>

              <h2>Built For The Sports Community</h2>

              <p>
                Athlyx is designed to support different members of the
                sporting ecosystem.
              </p>
            </div>

            <div className="role-list">
              <span>Athletes</span>
              <span>Coaches</span>
              <span>Scouts</span>
              <span>Academies</span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default About;