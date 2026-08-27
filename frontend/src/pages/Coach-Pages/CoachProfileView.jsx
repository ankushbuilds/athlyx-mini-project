import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  FiEdit,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiClock,
  FiUserPlus
} from "react-icons/fi";

import AthleteSidebar from "../../components/AthleteSidebar";
import CoachSidebar from "../../components/CoachSidebar";

const API = "http://localhost:5000/api";

const CoachProfileView = () => {
  const navigate = useNavigate();
  const params = useParams();

  const coachId = params.coachId || params.id;

  // ==================================================
  // STATE
  // ==================================================

  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [connectionStatus, setConnectionStatus] =
    useState("none");

  const [connectionLoading, setConnectionLoading] =
    useState(false);

  const [connectionMessage, setConnectionMessage] =
    useState("");

  // ==================================================
  // CURRENT USER
  // ==================================================

  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      return null;
    }
  };

  const currentUser = getCurrentUser();

  const currentUserRole =
    currentUser?.role?.toLowerCase();

  // ==================================================
  // OWN PROFILE
  // ==================================================

  const isOwnProfile = !coachId;

  // ==================================================
  // SIDEBAR
  // ==================================================

  const renderSidebar = () => {
    if (currentUserRole === "athlete") {
      return <AthleteSidebar />;
    }

    return <CoachSidebar />;
  };

  // ==================================================
  // FETCH COACH PROFILE
  // ==================================================

  useEffect(() => {
    fetchCoachProfile();
  }, [coachId]);

  const fetchCoachProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setConnectionMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", {
          replace: true
        });

        return;
      }

      // ==================================================
      // VIEW SPECIFIC COACH
      // ==================================================

      if (coachId) {
        console.log(
          "Viewing Coach ID:",
          coachId
        );

        const response = await axios.get(
          `${API}/users/coaches/${coachId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const coachData =
          response.data?.coach || null;

        if (!coachData) {
          setError(
            "Coach profile not found."
          );

          return;
        }

        setCoach(coachData);

        // ==================================================
        // ATHLETE → CHECK CONNECTION STATUS
        // ==================================================

        if (currentUserRole === "athlete") {
          await fetchConnectionStatus(
            coachId,
            token
          );
        } else {
          setConnectionStatus("none");
        }

        return;
      }

      // ==================================================
      // VIEW OWN COACH PROFILE
      // ==================================================

      const response = await axios.get(
        `${API}/coaches/get-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCoach(
        response.data?.coach || null
      );

      setConnectionStatus("none");

    } catch (error) {
      console.error(
        "Failed to fetch coach profile:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/auth", {
          replace: true
        });

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

  // ==================================================
  // FETCH CONNECTION STATUS
  // ==================================================

  const fetchConnectionStatus = async (
    selectedCoachId,
    token
  ) => {
    try {
      console.log(
        "Checking connection with coach:",
        selectedCoachId
      );

      const response = await axios.get(
        `${API}/connections/status/coach/${selectedCoachId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "Connection status:",
        response.data
      );

      setConnectionStatus(
        response.data?.status || "none"
      );

    } catch (error) {
      console.error(
        "Failed to fetch connection status:",
        error
      );

      setConnectionStatus("none");
    }
  };

  // ==================================================
  // SEND CONNECTION REQUEST
  // ==================================================

  const handleSendRequest = async () => {
    if (
      connectionLoading ||
      !coachId
    ) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/auth", {
          replace: true
        });

        return;
      }

      if (currentUserRole !== "athlete") {
        setConnectionMessage(
          "Only athletes can send connection requests."
        );

        return;
      }

      setConnectionLoading(true);
      setConnectionMessage("");
      setError("");

      console.log(
        "Sending connection request to coach:",
        coachId
      );

      const response =
        await axios.post(
          `${API}/connections/send/coach/${coachId}`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      console.log(
        "Send request response:",
        response.data
      );

      setConnectionStatus(
        response.data?.status ||
          "pending"
      );

      // SUCCESS MESSAGE
      setConnectionMessage(
        response.data?.message ||
          "Connection request sent successfully."
      );

    } catch (error) {
      console.error(
        "Failed to send connection request:",
        error
      );

      const status =
        error.response?.data?.status;

      if (status) {
        setConnectionStatus(status);
      }

      // ERROR MESSAGE
      setError(
        error.response?.data?.message ||
          "Failed to send connection request."
      );

    } finally {
      setConnectionLoading(false);
    }
  };

  // ==================================================
  // EXPERIENCE
  // ==================================================

  const formatExperience = (
    experience
  ) => {
    if (
      experience === undefined ||
      experience === null ||
      experience === ""
    ) {
      return "0 Years";
    }

    return `${experience} ${
      Number(experience) === 1
        ? "Year"
        : "Years"
    }`;
  };

  // ==================================================
  // CONNECTION BUTTON
  // ==================================================

  const renderConnectionButton = () => {

    // ================================================
    // CONNECTED
    // ================================================

    if (
      connectionStatus === "accepted" ||
      connectionStatus === "connected"
    ) {
      return (
        <button
          type="button"
          className="bottom-edit-profile-btn"
          disabled
        >
          <FiCheckCircle />
          Connected
        </button>
      );
    }

    // ================================================
    // PENDING
    // ================================================

    if (
      connectionStatus === "pending"
    ) {
      return (
        <button
          type="button"
          className="bottom-edit-profile-btn"
          disabled
        >
          <FiClock />
          Request Pending
        </button>
      );
    }

    // ================================================
    // REJECTED
    // ================================================

    if (
      connectionStatus === "rejected"
    ) {
      return (
        <button
          type="button"
          className="bottom-edit-profile-btn"
          onClick={
            handleSendRequest
          }
          disabled={
            connectionLoading
          }
        >
          <FiUserPlus />

          {connectionLoading
            ? "Sending..."
            : "Send Request Again"}
        </button>
      );
    }

    // ================================================
    // NO CONNECTION
    // ================================================

    return (
      <button
        type="button"
        className="bottom-edit-profile-btn"
        onClick={
          handleSendRequest
        }
        disabled={
          connectionLoading
        }
      >
        <FiUserPlus />

        {connectionLoading
          ? "Sending..."
          : "Connect"}
      </button>
    );
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="athlete-profile-view-page">

        {renderSidebar()}

        <main className="athlete-profile-view-content">

          <div className="profile-view-container">

            <div className="page-heading">

              <span className="page-eyebrow">
                COACH PROFILE
              </span>

              <h1>
                Coach Profile
              </h1>

            </div>

            <section className="profile-view-section">

              <h2>
                Loading Profile
              </h2>

              <p className="profile-bio">
                Please wait while we load
                the coach profile.
              </p>

            </section>

          </div>

        </main>

      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div className="athlete-profile-view-page">

        {renderSidebar()}

        <main className="athlete-profile-view-content">

          <div className="profile-view-container">

            <div className="page-heading">

              <span className="page-eyebrow">
                COACH PROFILE
              </span>

              <h1>
                Coach Profile
              </h1>

            </div>

            <div className="profile-error">
              {error}
            </div>

          </div>

        </main>

      </div>
    );
  }

  // ==================================================
  // PROFILE NOT FOUND
  // ==================================================

  if (!coach) {
    return (
      <div className="athlete-profile-view-page">

        {renderSidebar()}

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

  // ==================================================
  // ADDRESS
  // ==================================================

  const address =
    coach.address || {};

  const fullLocation = [
    address.city,
    address.state,
    address.country
  ]
    .filter(Boolean)
    .join(", ");

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="athlete-profile-view-page">

      {renderSidebar()}

      <main className="athlete-profile-view-content">

        <div className="profile-view-container">

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="page-heading profile-page-heading">

            <div>

              <span className="page-eyebrow">
                COACH PROFILE
              </span>

              <h1>
                {isOwnProfile
                  ? "My Profile"
                  : "Coach Profile"}
              </h1>

            </div>

          </div>

          {/* ==========================================
              PROFILE HEADER
          ========================================== */}

          <section className="profile-view-header">

            <div className="profile-view-photo">

              {coach.profilePic ? (
                <img
                  src={coach.profilePic}
                  alt={
                    coach.name ||
                    "Coach"
                  }
                />
              ) : (
                <div className="profile-view-placeholder">
                  <FiUser />
                </div>
              )}

            </div>

            <div className="profile-view-user-info">

              <div className="coach-profile-title-row">

                {/* ==================================
                    COACH DETAILS
                ================================== */}

                <div className="coach-profile-details">

                  <h1>
                    {coach.name ||
                      "Coach"}
                  </h1>

                  <p>
                    {coach.sport ||
                      "Sport not added"}

                    {coach.specialization &&
                      ` • ${coach.specialization}`}
                  </p>

                  <span>
                    {fullLocation ||
                      "Location not added"}
                  </span>

                </div>

                {/* ==================================
                    ATHLETE → CONNECT
                ================================== */}

                {!isOwnProfile &&
                  currentUserRole ===
                    "athlete" && (

                    <div className="coach-connect-action">

                      {renderConnectionButton()}

                    </div>

                  )}

              </div>

            </div>

          </section>

          {/* ==========================================
              CONNECTION SUCCESS MESSAGE
          ========================================== */}

          {!isOwnProfile &&
            currentUserRole === "athlete" &&
            connectionMessage && (

              <div className="connection-success-message">

                <FiCheckCircle />

                <span>
                  {connectionMessage}
                </span>

              </div>

            )}

          {/* ==========================================
              PERSONAL INFORMATION
          ========================================== */}

          <section className="profile-view-section">

            <h2>
              Personal Information
            </h2>

            <div className="profile-details-grid">

              <div className="profile-detail">

                <span>
                  <FiUser />
                  Name
                </span>

                <strong>
                  {coach.name ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  <FiMail />
                  Email
                </span>

                <strong>
                  {coach.email ||
                    "Not available"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  <FiPhone />
                  Phone
                </span>

                <strong>
                  {coach.phone ||
                    "Not added"}
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

          {/* ==========================================
              COACHING INFORMATION
          ========================================== */}

          <section className="profile-view-section">

            <h2>
              Coaching Information
            </h2>

            <div className="profile-details-grid">

              <div className="profile-detail">

                <span>
                  Primary Sport
                </span>

                <strong>
                  {coach.sport ||
                    "Not added"}
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

          {/* ==========================================
              LOCATION
          ========================================== */}

          <section className="profile-view-section">

            <h2>
              Location
            </h2>

            <div className="profile-details-grid">

              <div className="profile-detail">

                <span>
                  <FiMapPin />
                  City
                </span>

                <strong>
                  {address.city ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  State
                </span>

                <strong>
                  {address.state ||
                    "Not added"}
                </strong>

              </div>

              <div className="profile-detail">

                <span>
                  Country
                </span>

                <strong>
                  {address.country ||
                    "India"}
                </strong>

              </div>

            </div>

          </section>

          {/* ==========================================
              AVAILABILITY
          ========================================== */}

          <section className="profile-view-section">

            <h2>
              Availability
            </h2>

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

          {/* ==========================================
              SKILLS
          ========================================== */}

          <section className="profile-view-section">

            <h2>
              Skills
            </h2>

            <div className="profile-skills">

              {Array.isArray(
                coach.skills
              ) &&
              coach.skills.length > 0 ? (

                coach.skills.map(
                  (skill, index) => (
                    <span
                      key={index}
                    >
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

          {/* ==========================================
              ACHIEVEMENTS
          ========================================== */}

          <section className="profile-view-section">

            <h2>
              Achievements
            </h2>

            {Array.isArray(
              coach.achievements
            ) &&
            coach.achievements.length > 0 ? (

              <div className="achievement-list">

                {coach.achievements.map(
                  (
                    achievement,
                    index
                  ) => (

                    <div
                      className="achievement-card"
                      key={index}
                    >

                      <h3>
                        {typeof achievement ===
                        "string"
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

          {/* ==========================================
              ABOUT
          ========================================== */}

          <section className="profile-view-section">

            <h2>
              About
            </h2>

            <div className="profile-bio">

              {coach.bio ||
                "No bio added yet."}

            </div>

          </section>

          {/* ==========================================
              BOTTOM ACTIONS
          ========================================== */}

          <div className="profile-bottom-actions">

            {/* ========================================
                COACH → OWN PROFILE
            ======================================== */}

            {isOwnProfile &&
              currentUserRole ===
                "coach" && (

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

              )}

          </div>

        </div>

      </main>

    </div>
  );
};

export default CoachProfileView;