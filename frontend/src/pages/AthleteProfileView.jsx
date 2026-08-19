import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiEdit,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiAward,
  FiActivity,
  FiCalendar,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiCheckCircle,
  FiClock
} from "react-icons/fi";

const AthleteProfileView = () => {
  const navigate = useNavigate();

  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      console.error("Failed to fetch athlete profile:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth", { replace: true });
        return;
      }

      if (error.response?.status === 404) {
        navigate("/athlete/profile", { replace: true });
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
    if (!gender) return "Not added";

    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  const formatDate = (date) => {
    if (!date) return "Not added";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="athlete-profile-view-page">
        <div className="profile-view-container">
          <section className="profile-view-section">
            <h2>Loading Profile</h2>
            <p className="profile-bio">
              Please wait while we load your profile.
            </p>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="athlete-profile-view-page">
        <div className="profile-view-container">
          <div className="profile-error">
            {error}
          </div>

          <button
            className="back-profile-btn"
            onClick={() => navigate("/athlete/dashboard")}
          >
            <FiArrowLeft />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!athlete) {
    return null;
  }

  const profilePic = athlete.user?.profilePic || "";

  const fullLocation = [
    athlete.address?.city,
    athlete.address?.state,
    athlete.address?.country
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="athlete-profile-view-page">
      <div className="profile-view-container">

        <div className="profile-view-top">
          <button
            className="back-profile-btn"
            onClick={() => navigate("/athlete/dashboard")}
          >
            <FiArrowLeft />
            Dashboard
          </button>

          <button
            className="edit-profile-btn"
            onClick={() =>
              navigate("/athlete/profile?mode=edit")
            }
          >
            <FiEdit />
            Edit Profile
          </button>
        </div>

        <section className="profile-view-header">
          <div className="profile-view-photo">
            {profilePic ? (
              <img
                src={profilePic}
                alt={athlete.user?.name || "Athlete"}
              />
            ) : (
              <div className="profile-view-placeholder">
                <FiUser />
              </div>
            )}
          </div>

          <div className="profile-view-user-info">
            <h1>
              {athlete.user?.name || "Athlete"}
            </h1>

            <p>
              {athlete.sport || "Sport not added"}
              {athlete.position && ` • ${athlete.position}`}
            </p>

            <span>
              {fullLocation || "Location not added"}
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
                {formatGender(athlete.gender)}
              </strong>
            </div>

            <div className="profile-detail">
              <span>
                <FiCalendar /> Date of Birth
              </span>
              <strong>
                {formatDate(athlete.dateOfBirth)}
              </strong>
            </div>

            <div className="profile-detail">
              <span>
                <FiPhone /> Phone
              </span>
              <strong>
                {athlete.phone || "Not added"}
              </strong>
            </div>

            <div className="profile-detail">
              <span>
                <FiMail /> Email
              </span>
              <strong>
                {athlete.user?.email || "Not available"}
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
              <span>Primary Sport</span>
              <strong>
                {athlete.sport || "Not added"}
              </strong>
            </div>

            <div className="profile-detail">
              <span>Position</span>
              <strong>
                {athlete.position || "Not added"}
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
                {athlete.address?.city || "Not added"}
              </strong>
            </div>

            <div className="profile-detail">
              <span>State</span>
              <strong>
                {athlete.address?.state || "Not added"}
              </strong>
            </div>

            <div className="profile-detail">
              <span>Country</span>
              <strong>
                {athlete.address?.country || "India"}
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
              athlete.skills.map((skill, index) => (
                <span key={index}>
                  {skill}
                </span>
              ))
            ) : (
              <p>No skills added yet.</p>
            )}
          </div>
        </section>

        <section className="profile-view-section">
          <h2>Achievements</h2>

          {athlete.achievements?.length > 0 ? (
            <div className="achievement-list">
              {athlete.achievements.map(
                (achievement, index) => (
                  <div
                    className="achievement-card"
                    key={achievement._id || index}
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
              No achievements added yet.
            </p>
          )}
        </section>

        <section className="profile-view-section">
          <h2>About</h2>

          <div className="profile-bio">
            {athlete.bio
              ? athlete.bio
              : "No bio added yet."}
          </div>
        </section>

        <section className="profile-view-section">
          <h2>Social Links</h2>

          <div className="profile-skills">

            {athlete.socialLinks?.instagram && (
              <span>
                <a
                  href={athlete.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "inherit",
                    textDecoration: "none"
                  }}
                >
                  <FiInstagram />
                  {" "}Instagram
                </a>
              </span>
            )}

            {athlete.socialLinks?.facebook && (
              <span>
                <a
                  href={athlete.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "inherit",
                    textDecoration: "none"
                  }}
                >
                  <FiFacebook />
                  {" "}Facebook
                </a>
              </span>
            )}

            {athlete.socialLinks?.youtube && (
              <span>
                <a
                  href={athlete.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "inherit",
                    textDecoration: "none"
                  }}
                >
                  <FiYoutube />
                  {" "}YouTube
                </a>
              </span>
            )}

            {!athlete.socialLinks?.instagram &&
              !athlete.socialLinks?.facebook &&
              !athlete.socialLinks?.youtube && (
                <p>
                  No social links added.
                </p>
              )}

          </div>
        </section>

        <button
          className="bottom-edit-profile-btn"
          onClick={() =>
            navigate("/athlete/profile?mode=edit")
          }
        >
          <FiEdit />
          Edit Athlete Profile
        </button>

      </div>
    </div>
  );
};

export default AthleteProfileView;