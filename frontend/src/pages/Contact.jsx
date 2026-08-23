import { useState } from "react";
import Navbar from "../components/Navbar";
import { FiMail, FiPhone, FiMapPin, FiClock, FiInstagram, FiLinkedin, FiSend } from "react-icons/fi";

const Contact = () => {
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

    alert("Your message has been submitted successfully.");

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
            <span className="info-label">GET IN TOUCH</span>

            <h1>Contact Us</h1>

            <p>
              Have a question, feedback, or need assistance?
              Get in touch with the Athlyx team and we'll be happy
              to help you.
            </p>
          </div>

          <div className="contact-grid">

            <div className="contact-item">
              <div className="contact-icon">
                <FiMail />
              </div>

              <div>
                <h3>Email Support</h3>
                <p>support@athlyx.com</p>
                <span>For general queries and support</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FiPhone />
              </div>

              <div>
                <h3>Phone Support</h3>
                <p>+91 6398462796</p>
                <span>Available during support hours</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FiMapPin />
              </div>

              <div>
                <h3>Location</h3>
                <p>India</p>
                <span>Serving athletes across India</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FiClock />
              </div>

              <div>
                <h3>Support Hours</h3>
                <p>Mon - Sat</p>
                <span>10:00 AM - 6:00 PM</span>
              </div>
            </div>

          </div>

          <div className="contact-divider"></div>

          <div className="contact-lower">

            <div className="social-section">

              <div className="section-heading">
                <h2>Connect With Us</h2>
                <p>
                  Follow Athlyx for updates, opportunities and
                  sports-related content.
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
                <h2>Send Us a Message</h2>
                <p>
                  Fill out the form and our team will get back to you.
                </p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>

                <div className="form-row">

                  <div className="contact-field">
                    <label>Your Name</label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label>Email Address</label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                </div>

                <div className="contact-field">
                  <label>Subject</label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What can we help you with?"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label>Message</label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="send-message-btn">
                  <FiSend />
                  Send Message
                </button>

              </form>

            </div>

          </div>

          <div className="contact-footer-note">
            <strong>Need immediate help?</strong>
            <span>
              Check our Help & Support section for answers to common questions.
            </span>
          </div>

        </div>

      </main>
    </div>
  );
};

export default Contact;