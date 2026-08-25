import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiEdit,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiClock
} from "react-icons/fi";
import CoachSidebar from "../../components/CoachSidebar";

const CoachProfileView = () => {
  const navigate = useNavigate();

  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoachProfile();
  }, []);

  const fetchCoachProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/coaches/get-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCoach(response.data.coach || null);
    } catch (error) {
      console.error(
        "Failed to fetch coach profile:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/auth", { replace: true });
        return;
      }

      setError(
        error.response?.data?.message ||
        "Failed to load coach profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatExperience = (experience) => {
    if (!experience) {
      return "0 Years";
    }

    return `${experience} ${
      experience === 1 ? "Year" : "Years"
    }`;
  };

  if (loading) {
    return (
      <div className="athlete-profile-view-page">
        <CoachSidebar />

        <main className="athlete-profile-view-content">
          <div className="profile-view-container">
            <div className="page-heading">
              <span className="page-eyebrow">
                COACH PROFILE
              </span>

              <h1>My Profile</h1>
            </div>

            <section className="profile-view-section">
              <h2>Loading Profile</h2>

              <p className="profile-bio">
                Please wait while we load your profile.
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
        <CoachSidebar />

        <main className="athlete-profile-view-content">
          <div className="profile-view-container">
            <div className="page-heading">
              <span className="page-eyebrow">
                COACH PROFILE
              </span>

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

  if (!coach) {
    return (
      <div className="athlete-profile-view-page">
        <CoachSidebar />

        <main className="athlete-profile-view-content">
          <div className="profile-view-container">
            <div className="profile-error">
              Coach profile not found.
            </div>
          </div>
        </main>
      </div>
    );
  }

  const address = coach.address || {};

  const fullLocation = [
    address.city,
    address.state,
    address.country
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="athlete-profile-view-page">
      <CoachSidebar />

      <main className="athlete-profile-view-content">
        <div className="profile-view-container">

          <div className="page-heading profile-page-heading">
            <div>
              <span className="page-eyebrow">
                COACH PROFILE
              </span>

              <h1>My Profile</h1>
            </div>

          
          </div>

          <section className="profile-view-header">
            <div className="profile-view-photo">
              {coach.profilePic ? (
                <img
                  src={coach.profilePic}
                  alt={coach.name || "Coach"}
                />
              ) : (
                <div className="profile-view-placeholder">
                  <FiUser />
                </div>
              )}
            </div>

            <div className="profile-view-user-info">
              <h1>
                {coach.name || "Coach"}
              </h1>

              <p>
                {coach.sport || "Sport not added"}

                {coach.specialization &&
                  ` • ${coach.specialization}`}
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
                  <FiUser />
                  Name
                </span>

                <strong>
                  {coach.name || "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  <FiMail />
                  Email
                </span>

                <strong>
                  {coach.email || "Not available"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  <FiPhone />
                  Phone
                </span>

                <strong>
                  {coach.phone || "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  Organization
                </span>

                <strong>
                  {coach.organization || "Not added"}
                </strong>
              </div>

            </div>
          </section>

          <section className="profile-view-section">
            <h2>Coaching Information</h2>

            <div className="profile-details-grid">

              <div className="profile-detail">
                <span>
                  Primary Sport
                </span>

                <strong>
                  {coach.sport || "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  Specialization
                </span>

                <strong>
                  {coach.specialization ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  Experience
                </span>

                <strong>
                  {formatExperience(
                    coach.experience
                  )}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  Organization
                </span>

                <strong>
                  {coach.organization ||
                    "Not added"}
                </strong>
              </div>

            </div>
          </section>

          <section className="profile-view-section">
            <h2>Location</h2>

            <div className="profile-details-grid">

              <div className="profile-detail">
                <span>
                  <FiMapPin />
                  City
                </span>

                <strong>
                  {address.city || "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  State
                </span>

                <strong>
                  {address.state || "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  Country
                </span>

                <strong>
                  {address.country || "India"}
                </strong>
              </div>

            </div>
          </section>

          <section className="profile-view-section">
            <h2>Availability</h2>

            <div className="availability-status">
              {coach.isAvailable !== false ? (
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
              {Array.isArray(coach.skills) &&
              coach.skills.length > 0 ? (
                coach.skills.map((skill, index) => (
                  <span key={index}>
                    {skill}
                  </span>
                ))
              ) : (
                <p>
                  No skills added yet.
                </p>
              )}
            </div>
          </section>

          <section className="profile-view-section">
            <h2>Achievements</h2>

            {Array.isArray(coach.achievements) &&
            coach.achievements.length > 0 ? (
              <div className="achievement-list">
                {coach.achievements.map(
                  (achievement, index) => (
                    <div
                      className="achievement-card"
                      key={index}
                    >
                      <h3>
                        {typeof achievement === "string"
                          ? achievement
                          : achievement.title ||
                            "Achievement"}
                      </h3>

                      {typeof achievement !==
                        "string" &&
                        achievement.description && (
                          <p>
                            {
                              achievement.description
                            }
                          </p>
                        )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="profile-bio">
                No achievements added yet.
              </p>
            )}
          </section>

          <section className="profile-view-section">
            <h2>About</h2>

            <div className="profile-bio">
              {coach.bio ||
                "No bio added yet."}
            </div>
          </section>

          <div className="profile-bottom-actions">
            <button
              type="button"
              className="bottom-edit-profile-btn"
              onClick={() =>
                navigate(
                  "/coach/profile?mode=edit"
                )
              }
            >
              <FiEdit />
              Edit Coach Profile
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CoachProfileView;