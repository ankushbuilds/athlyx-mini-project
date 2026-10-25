import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { FiMail, FiPhone, FiMapPin, FiClock, FiInstagram, FiLinkedin, FiSend } from "react-icons/fi";

const Contact = () => {
  const { t } = useTranslation("public");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact Form:", formData);

    alert(t("contact.messageSubmitted"));

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="info-page">
      <Navbar />

      <main className="info-content">

        <div className="info-card contact-card">

          <div className="info-card-header">
            <span className="info-label">{t("contact.getInTouch")}</span>

            <h1>{t("contact.contactUs")}</h1>

            <p>
              {t("contact.intro")}
            </p>
          </div>

          <div className="contact-grid">

            <div className="contact-item">
              <div className="contact-icon">
                <FiMail />
              </div>

              <div>
                <h3>{t("contact.emailSupport")}</h3>
                <p>support@athlyx.com</p>
                <span>{t("contact.generalQueries")}</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FiPhone />
              </div>

              <div>
                <h3>{t("contact.phoneSupport")}</h3>
                <p>+91 6398462796</p>
                <span>{t("contact.supportHoursAvailability")}</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FiMapPin />
              </div>

              <div>
                <h3>{t("contact.location")}</h3>
                <p>India</p>
                <span>{t("contact.servingIndia")}</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FiClock />
              </div>

              <div>
                <h3>{t("contact.supportHours")}</h3>
                <p>{t("contact.days")}</p>
                <span>10:00 AM - 6:00 PM</span>
              </div>
            </div>

          </div>

          <div className="contact-divider"></div>

          <div className="contact-lower">

            <div className="social-section">

              <div className="section-heading">
                <h2>{t("contact.connectWithUs")}</h2>
                <p>
                  {t("contact.followUpdates")}
                </p>
              </div>

              <div className="social-links">

                <a
                  href="https://www.instagram.com/ankushthakur_003/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  <FiInstagram />
                  <div>
                    <strong>Instagram</strong>
                    <span>@ankushthakur_003</span>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/ankush-singh-021144381/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  <FiLinkedin />
                  <div>
                    <strong>LinkedIn</strong>
                    <span>Ankush Singh</span>
                  </div>
                </a>

              </div>

            </div>

            <div className="contact-form-section">

              <div className="section-heading">
                <h2>{t("contact.sendUsMessage")}</h2>
                <p>
                  {t("contact.formIntro")}
                </p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>

                <div className="form-row">

                  <div className="contact-field">
                    <label>{t("contact.yourName")}</label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("contact.enterName")}
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label>{t("contact.emailAddress")}</label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("contact.enterEmail")}
                      required
                    />
                  </div>

                </div>

                <div className="contact-field">
                  <label>{t("contact.subject")}</label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t("contact.subjectPlaceholder")}
                    required
                  />
                </div>

                <div className="contact-field">
                  <label>{t("contact.message")}</label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("contact.messagePlaceholder")}
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="send-message-btn">
                  <FiSend />
                  {t("contact.sendMessage")}
                </button>

              </form>

            </div>

          </div>

          <div className="contact-footer-note">
            <strong>{t("contact.immediateHelp")}</strong>
            <span>
              {t("contact.helpLink")}
            </span>
          </div>

        </div>

      </main>
    </div>
  );
};

export default Contact;