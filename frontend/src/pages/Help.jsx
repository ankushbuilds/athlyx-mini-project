import { useNavigate } from "react-router-dom";
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

  return (
    <div className="info-page">
      <Navbar />

      <main className="help-content">
        <section className="help-hero">
          <span className="help-badge">ATHLYX SUPPORT</span>

          <h1>How can we help?</h1>

          <p>
            Find helpful information about your Athlyx account,
            athlete profile and discovering sports opportunities.
          </p>
        </section>

        <section className="help-quick-section">
          <h2>Quick Help</h2>

          <div className="help-quick-grid">
            <div className="help-quick-card">
              <div className="help-icon">
                <FiUser />
              </div>

              <div>
                <h3>Profile</h3>
                <p>
                  Create and manage your athlete profile,
                  skills and achievements.
                </p>
              </div>
            </div>

            <div className="help-quick-card">
              <div className="help-icon">
                <FiSearch />
              </div>

              <div>
                <h3>Discover</h3>
                <p>
                  Learn how coaches, scouts and academies
                  can discover athletes.
                </p>
              </div>
            </div>

            <div className="help-quick-card">
              <div className="help-icon">
                <FiLock />
              </div>

              <div>
                <h3>Account & Security</h3>
                <p>
                  Manage your password, email and account
                  security settings.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="help-faq-section">
          <div className="help-section-heading">
            <h2>Frequently Asked Questions</h2>
            <p>
              Find answers to some of the most common questions
              about Athlyx.
            </p>
          </div>

          <div className="help-faq-list">
            <details className="help-faq">
              <summary>
                <span>How do I create my athlete profile?</span>
                <FiChevronDown />
              </summary>

              <p>
                Open your profile section from the dashboard and
                add your personal details, sport, skills,
                achievements and other relevant information.
              </p>
            </details>

            <details className="help-faq">
              <summary>
                <span>How can coaches and scouts discover me?</span>
                <FiChevronDown />
              </summary>

              <p>
                Complete your athlete profile with accurate
                information. A complete profile makes it easier
                for coaches, scouts and academies to discover
                your talent.
              </p>
            </details>

            <details className="help-faq">
              <summary>
                <span>How can I change my password?</span>
                <FiChevronDown />
              </summary>

              <p>
                Go to Settings from your athlete dashboard and
                select the Change Password option. Enter your
                current password and create a new password.
              </p>
            </details>

            <details className="help-faq">
              <summary>
                <span>How can I change my email address?</span>
                <FiChevronDown />
              </summary>

              <p>
                Open Settings and select Change Email Address.
                You will need to provide your new email address
                and current password.
              </p>
            </details>

            <details className="help-faq">
              <summary>
                <span>Can I update my profile information later?</span>
                <FiChevronDown />
              </summary>

              <p>
                Yes. You can edit your athlete profile whenever
                you need to update your personal details, skills,
                achievements or other information.
              </p>
            </details>
          </div>
        </section>

        <section className="help-support-card">
          <div className="help-support-icon">
            <FiMail />
          </div>

          <div className="help-support-content">
            <h2>Still need help?</h2>

            <p>
              If you couldn't find the answer you're looking for,
              our support team is here to help.
            </p>
          </div>

          <button onClick={() => navigate("/contact")}>
            Contact Support
          </button>
        </section>
      </main>
    </div>
  );
};

export default Help;