import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiEdit,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiDownload,
  FiX
} from "react-icons/fi";
import {
  PDFDownloadLink,
  PDFViewer
} from "@react-pdf/renderer";
import AthleteSidebar from "../../components/AthleteSidebar";
import AthleteResume from "../../components/AthleteResume";

const AthleteProfileView = () => {
  const navigate = useNavigate();

  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    fetchAthleteProfile();
  }, []);

  const fetchAthleteProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/athletes/get-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAthlete(response.data.athlete);
    } catch (error) {
      console.error(
        "Failed to fetch athlete profile:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/auth", { replace: true });
        return;
      }

      if (error.response?.status === 404) {
        navigate("/athlete/profile", {
          replace: true
        });
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load athlete profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatGender = (gender) => {
    if (!gender) {
      return "Not added";
    }

    return (
      gender.charAt(0).toUpperCase() +
      gender.slice(1)
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not added";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const resumeData = athlete
    ? {
        name: athlete.user?.name || "Athlete",
        email: athlete.user?.email || "",
        profilePic:
          athlete.user?.profilePic || "",
        dateOfBirth: athlete.dateOfBirth || "",
        gender: athlete.gender || "",
        phone: athlete.phone || "",
        city: athlete.address?.city || "",
        state: athlete.address?.state || "",
        country:
          athlete.address?.country || "India",
        sport: athlete.sport || "",
        position: athlete.position || "",
        experience:
          athlete.experience ?? 0,
        skills: athlete.skills || [],
        bio: athlete.bio || "",
        height: athlete.height || "",
        weight: athlete.weight || "",
        achievements:
          athlete.achievements || [],
        socialLinks: {
          instagram:
            athlete.socialLinks?.instagram ||
            "",
          facebook:
            athlete.socialLinks?.facebook ||
            "",
          youtube:
            athlete.socialLinks?.youtube ||
            ""
        }
      }
    : {};

  if (loading) {
    return (
      <div className="athlete-profile-view-page">
        <AthleteSidebar />

        <main className="athlete-profile-view-content">
          <div className="profile-view-container">
            <div className="page-heading">
              <h1>My Profile</h1>
            </div>

            <section className="profile-view-section">
              <h2>Loading Profile</h2>

              <p className="profile-bio">
                Please wait while we load your
                profile.
              </p>
            </section>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="athlete-profile-view-page">
        <AthleteSidebar />

        <main className="athlete-profile-view-content">
          <div className="profile-view-container">
            <div className="page-heading">
              <h1>My Profile</h1>
            </div>

            <div className="profile-error">
              {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="athlete-profile-view-page">
        <AthleteSidebar />
      </div>
    );
  }

  const profilePic =
    athlete.user?.profilePic || "";

  const fullLocation = [
    athlete.address?.city,
    athlete.address?.state,
    athlete.address?.country
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="athlete-profile-view-page">
      <AthleteSidebar />

      <main className="athlete-profile-view-content">
        <div className="profile-view-container">
          <div className="page-heading profile-page-heading">
            <div>
              <span className="page-eyebrow">
                ATHLETE PROFILE
              </span>

              <h1>My Profile</h1>
            </div>

            <button
              type="button"
              className="generate-resume-btn"
              onClick={() =>
                setShowResumeModal(true)
              }
            >
              <FiFileText />
              Generate Resume
            </button>
          </div>

          <section className="profile-view-header">
            <div className="profile-view-photo">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt={
                    athlete.user?.name ||
                    "Athlete"
                  }
                />
              ) : (
                <div className="profile-view-placeholder">
                  <FiUser />
                </div>
              )}
            </div>

            <div className="profile-view-user-info">
              <h1>
                {athlete.user?.name ||
                  "Athlete"}
              </h1>

              <p>
                {athlete.sport ||
                  "Sport not added"}

                {athlete.position &&
                  ` • ${athlete.position}`}
              </p>

              <span>
                {fullLocation ||
                  "Location not added"}
              </span>
            </div>
          </section>

          <section className="profile-view-section">
            <h2>Personal Information</h2>

            <div className="profile-details-grid">
              <div className="profile-detail">
                <span>
                  <FiUser /> Gender
                </span>

                <strong>
                  {formatGender(
                    athlete.gender
                  )}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  <FiCalendar /> Date of Birth
                </span>

                <strong>
                  {formatDate(
                    athlete.dateOfBirth
                  )}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  <FiPhone /> Phone
                </span>

                <strong>
                  {athlete.phone ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  <FiMail /> Email
                </span>

                <strong>
                  {athlete.user?.email ||
                    "Not available"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Height</span>

                <strong>
                  {athlete.height
                    ? `${athlete.height} cm`
                    : "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Weight</span>

                <strong>
                  {athlete.weight
                    ? `${athlete.weight} kg`
                    : "Not added"}
                </strong>
              </div>
            </div>
          </section>

          <section className="profile-view-section">
            <h2>Sports Information</h2>

            <div className="profile-details-grid">
              <div className="profile-detail">
                <span>
                  Primary Sport
                </span>

                <strong>
                  {athlete.sport ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Position</span>

                <strong>
                  {athlete.position ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Experience</span>

                <strong>
                  {athlete.experience
                    ? `${athlete.experience} Years`
                    : "0 Years"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Career Status</span>

                <strong>
                  {athlete.isAvailable
                    ? "Open to Opportunities"
                    : "Currently Unavailable"}
                </strong>
              </div>
            </div>
          </section>

          <section className="profile-view-section">
            <h2>Location</h2>

            <div className="profile-details-grid">
              <div className="profile-detail">
                <span>
                  <FiMapPin /> City
                </span>

                <strong>
                  {athlete.address?.city ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>State</span>

                <strong>
                  {athlete.address?.state ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Country</span>

                <strong>
                  {athlete.address?.country ||
                    "India"}
                </strong>
              </div>
            </div>
          </section>

          <section className="profile-view-section">
            <h2>Availability</h2>

            <div className="availability-status">
              {athlete.isAvailable ? (
                <>
                  <FiCheckCircle />
                  Available for opportunities
                </>
              ) : (
                <>
                  <FiClock />
                  Currently unavailable
                </>
              )}
            </div>
          </section>

          <section className="profile-view-section">
            <h2>Skills</h2>

            <div className="profile-skills">
              {athlete.skills?.length > 0 ? (
                athlete.skills.map(
                  (skill, index) => (
                    <span key={index}>
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p>
                  No skills added yet.
                </p>
              )}
            </div>
          </section>

          <section className="profile-view-section">
            <h2>Achievements</h2>

            {athlete.achievements?.length >
            0 ? (
              <div className="achievement-list">
                {athlete.achievements.map(
                  (
                    achievement,
                    index
                  ) => (
                    <div
                      className="achievement-card"
                      key={
                        achievement._id ||
                        index
                      }
                    >
                      <h3>
                        {achievement.title ||
                          "Achievement"}
                      </h3>

                      <p>
                        {achievement.description ||
                          "No description added."}
                      </p>

                      {achievement.year && (
                        <span>
                          {achievement.year}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="profile-bio">
                No achievements added
                yet.
              </p>
            )}
          </section>

          <section className="profile-view-section">
            <h2>About</h2>

            <div className="profile-bio">
              {athlete.bio ||
                "No bio added yet."}
            </div>
          </section>

          <section className="profile-view-section">
            <h2>Social Links</h2>

            <div className="profile-skills">
              {athlete.socialLinks
                ?.instagram && (
                <span>
                  <a
                    href={
                      athlete.socialLinks
                        .instagram
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration:
                        "none"
                    }}
                  >
                    <FiInstagram />
                    {" "}Instagram
                  </a>
                </span>
              )}

              {athlete.socialLinks
                ?.facebook && (
                <span>
                  <a
                    href={
                      athlete.socialLinks
                        .facebook
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration:
                        "none"
                    }}
                  >
                    <FiFacebook />
                    {" "}Facebook
                  </a>
                </span>
              )}

              {athlete.socialLinks
                ?.youtube && (
                <span>
                  <a
                    href={
                      athlete.socialLinks
                        .youtube
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration:
                        "none"
                    }}
                  >
                    <FiYoutube />
                    {" "}YouTube
                  </a>
                </span>
              )}

              {!athlete.socialLinks
                ?.instagram &&
                !athlete.socialLinks
                  ?.facebook &&
                !athlete.socialLinks
                  ?.youtube && (
                  <p>
                    No social links added.
                  </p>
                )}
            </div>
          </section>

          <div className="profile-bottom-actions">
            <button
              className="bottom-edit-profile-btn"
              onClick={() =>
                navigate(
                  "/athlete/profile?mode=edit"
                )
              }
            >
              <FiEdit />
              Edit Athlete Profile
            </button>

         
          </div>
        </div>
      </main>

      {showResumeModal && (
        <div
          className="resume-modal-overlay"
          onClick={() =>
            setShowResumeModal(false)
          }
        >
          <div
            className="resume-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="resume-modal-header">
              <div>
                <span className="page-eyebrow">
                  ATHLYX
                </span>

                <h2>
                  Resume Preview
                </h2>

                <p>
                  Review your athlete
                  resume before
                  downloading it.
                </p>
              </div>

              <button
                type="button"
                className="resume-modal-close"
                onClick={() =>
                  setShowResumeModal(false)
                }
                aria-label="Close resume preview"
              >
                <FiX />
              </button>
            </div>

            <div className="resume-preview">
              <PDFViewer
                width="100%"
                height="100%"
                showToolbar={false}
              >
                <AthleteResume
                  data={resumeData}
                />
              </PDFViewer>
            </div>

            <div className="resume-modal-footer">
              <button
                type="button"
                className="resume-cancel-btn"
                onClick={() =>
                  setShowResumeModal(false)
                }
              >
                Close
              </button>

              <PDFDownloadLink
                document={
                  <AthleteResume
                    data={resumeData}
                  />
                }
                fileName={`${(
                  athlete.user?.name ||
                  "Athlete"
                )
                  .replace(
                    /[^a-z0-9]/gi,
                    "-"
                  )
                  .toLowerCase()}-athlyx-resume.pdf`}
                className="resume-download-btn"
              >
                {({ loading }) =>
                  loading ? (
                    "Preparing PDF..."
                  ) : (
                    <>
                      <FiDownload />
                      Download as PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleteProfileView;