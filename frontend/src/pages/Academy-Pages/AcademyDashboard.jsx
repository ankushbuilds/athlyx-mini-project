import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiUsers,
  FiUserPlus,
  FiMessageCircle,
  FiCompass,
  FiBriefcase,
  FiLogOut
} from "react-icons/fi";
import AcademySidebar from "../../components/AcademySidebar";

const API = "http://localhost:5000/api";

const AcademyDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD USER + DASHBOARD
  // ==========================================

  useEffect(() => {
    loadUser();
    fetchAcademyDashboard();
  }, []);

  // ==========================================
  // LOAD USER
  // ==========================================

  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }
  };

  // ==========================================
  // FETCH ACADEMY DASHBOARD
  // ==========================================

  const fetchAcademyDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", {
          replace: true
        });

        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const [
        profileResponse,
        athletesResponse,
        coachesResponse,
        requestsResponse
      ] = await Promise.all([
        axios.get(
          `${API}/academies/profile`,
          config
        ),

        axios.get(
          `${API}/connections/academy/athletes`,
          config
        ),

        axios.get(
          `${API}/connections/academy/coaches`,
          config
        ),

        axios.get(
          `${API}/connections/academy/requests`,
          config
        )
      ]);

      setProfile(
        profileResponse.data?.academy ||
        profileResponse.data ||
        null
      );

      setAthletes(
        athletesResponse.data?.athletes || []
      );

      setCoaches(
        coachesResponse.data?.coaches || []
      );

      setRequests(
        requestsResponse.data?.requests ||
        requestsResponse.data?.connections ||
        []
      );

    } catch (error) {
      console.error(
        "Failed to fetch academy dashboard:",
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

      if (error.response?.status === 404) {
        setProfile(null);
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHECK FIELD
  // ==========================================

  const isFilled = (value) => {
    if (
      value === undefined ||
      value === null
    ) {
      return false;
    }

    if (typeof value === "string") {
      return value.trim() !== "";
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "number") {
      return value > 0;
    }

    return Boolean(value);
  };

  // ==========================================
  // PROFILE COMPLETION
  // ==========================================

  const calculateProfileCompletion = () => {
    if (!profile) {
      return 0;
    }

    const fields = [
      profile.academyName,
      profile.profilePic,
      profile.sport,
      profile.specialization,
      profile.establishedYear,
      profile.phone,
      profile.address,
      profile.city,
      profile.state,
      profile.trainingPrograms,
      profile.facilities,
      profile.achievements,
      profile.bio,
      profile.socialLinks?.website,
      profile.socialLinks?.instagram,
      profile.socialLinks?.facebook
    ];

    const completedFields =
      fields.filter(isFilled).length;

    return Math.round(
      (completedFields / fields.length) * 100
    );
  };

  const profileCompletion =
    calculateProfileCompletion();

  // ==========================================
  // PROGRESS CLASS
  // ==========================================

  const getProgressClass = () => {
    if (profileCompletion < 40) {
      return "progress-low";
    }

    if (profileCompletion < 70) {
      return "progress-medium";
    }

    if (profileCompletion < 100) {
      return "progress-high";
    }

    return "progress-complete";
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/auth", {
      replace: true
    });
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="athlete-dashboard">

      {/* ========================================
          TOP HEADER
      ======================================== */}

      <header className="dashboard-header">

        <div className="logo">

          <img
            src="/logo.png"
            alt="Athlyx"
          />

          <span>
            Athlyx
          </span>

        </div>

        <div className="header-right">

          <button
            className="logout-btn"
            onClick={handleLogout}
          >

            <FiLogOut size={18} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </header>

      {/* ========================================
          DASHBOARD LAYOUT
      ======================================== */}

      <div className="dashboard-layout">

        <AcademySidebar />

        <main className="dashboard-content">

          {/* ======================================
              WELCOME SECTION
          ====================================== */}

          <section className="welcome-section">

            <h1>
              Welcome,{" "}
              {profile?.academyName ||
                user?.name ||
                "Academy"}
            </h1>

            <p>
              Manage your academy, athletes,
              coaches and connections.
            </p>

          </section>

          {/* ======================================
              PROFILE COMPLETION
          ====================================== */}

          {!loading && (
            <>
              {/* ==================================
                  NO PROFILE
              ================================== */}

              {!profile ? (
                <section className="profile-completion-card">

                  <div className="completion-header">

                    <div>

                      <span>
                        PROFILE SETUP
                      </span>

                      <h2>
                        Create Your Academy Profile
                      </h2>

                    </div>

                    <strong>
                      0%
                    </strong>

                  </div>

                  <div className="completion-bar">

                    <div
                      className="completion-progress progress-low"
                      style={{
                        width: "0%"
                      }}
                    ></div>

                  </div>

                  <p>
                    Create your academy profile
                    so athletes and coaches can
                    discover your academy.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/academy/create-profile"
                      )
                    }
                  >
                    Create Profile
                  </button>

                </section>

              ) : profileCompletion < 100 ? (

                /* ==================================
                   INCOMPLETE PROFILE
                ================================== */

                <section className="profile-completion-card">

                  <div className="completion-header">

                    <div>

                      <span>
                        PROFILE COMPLETION
                      </span>

                      <h2>
                        Complete Your Profile
                      </h2>

                    </div>

                    <strong>
                      {profileCompletion}%
                    </strong>

                  </div>

                  <div className="completion-bar">

                    <div
                      className={`completion-progress ${getProgressClass()}`}
                      style={{
                        width: `${profileCompletion}%`
                      }}
                    ></div>

                  </div>

                  <p>
                    Complete your academy profile
                    to help athletes and coaches
                    learn more about your academy.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/academy/edit-profile"
                      )
                    }
                  >
                    Complete Profile
                  </button>

                </section>

              ) : null}
            </>
          )}

          {/* ======================================
              ACADEMY OVERVIEW
          ====================================== */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Academy Overview
              </h2>

            </div>

            <div className="profile-fields">

              {/* Connected Athletes */}

              <div>

                <FiUsers size={20} />

                <span>
                  Connected Athletes
                </span>

                <p>
                  {athletes.length} connected athlete
                  {athletes.length !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

              {/* Connected Coaches */}

              <div>

                <FiUser size={20} />

                <span>
                  Connected Coaches
                </span>

                <p>
                  {coaches.length} connected coach
                  {coaches.length !== 1
                    ? "es"
                    : ""}
                </p>

              </div>

              {/* Requests */}

              <div>

                <FiUserPlus size={20} />

                <span>
                  Pending Requests
                </span>

                <p>
                  {requests.length} pending request
                  {requests.length !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

              {/* Messages */}

              <div>

                <FiMessageCircle size={20} />

                <span>
                  Messages
                </span>

                <p>
                  Chat with your connected
                  athletes and coaches.
                </p>

              </div>

            </div>

          </section>

          {/* ======================================
              WHAT YOU CAN MANAGE
          ====================================== */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                What You Can Manage
              </h2>

            </div>

            <div className="profile-fields">

              {/* Discover */}

              <div
                onClick={() =>
                  navigate(
                    "/academy/discover"
                  )
                }
              >

                <FiCompass size={20} />

                <span>
                  Discover Athletes
                </span>

                <p>
                  Find athletes matching your
                  academy's sport.
                </p>

              </div>

              {/* Athletes */}

              <div
                onClick={() =>
                  navigate(
                    "/academy/athletes"
                  )
                }
              >

                <FiUsers size={20} />

                <span>
                  Connected Athletes
                </span>

                <p>
                  View and manage your
                  connected athletes.
                </p>

              </div>

              {/* Requests */}

              <div
                onClick={() =>
                  navigate(
                    "/academy/requests"
                  )
                }
              >

                <FiUserPlus size={20} />

                <span>
                  Connection Requests
                </span>

                <p>
                  Review incoming athlete
                  and coach requests.
                </p>

              </div>

              {/* Messages */}

              <div
                onClick={() =>
                  navigate(
                    "/academy/messages"
                  )
                }
              >

                <FiMessageCircle size={20} />

                <span>
                  Messages
                </span>

                <p>
                  Chat with your connected
                  athletes and coaches.
                </p>

              </div>

            </div>

          </section>

          {/* ======================================
              PROFILE INFORMATION
          ====================================== */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Profile Information
              </h2>

            </div>

            <div className="profile-fields">

              {/* Sport */}

              <div>

                <FiCompass size={20} />

                <span>
                  Sport
                </span>

                <p>
                  {profile?.sport ||
                    "Not added"}
                </p>

              </div>

              {/* Specialization */}

              <div>

                <FiBriefcase size={20} />

                <span>
                  Specialization
                </span>

                <p>
                  {profile?.specialization ||
                    "Not added"}
                </p>

              </div>

              {/* Location */}

              <div>

                <FiUser size={20} />

                <span>
                  Location
                </span>

                <p>
                  {[
                    profile?.city,
                    profile?.state
                  ]
                    .filter(Boolean)
                    .join(", ") ||
                    profile?.address ||
                    "Not added"}
                </p>

              </div>

              {/* Established */}

              <div>

                <FiBriefcase size={20} />

                <span>
                  Established
                </span>

                <p>
                  {profile?.establishedYear ||
                    "Not added"}
                </p>

              </div>

            </div>

          </section>

          {/* ======================================
              ABOUT ACADEMY
          ====================================== */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                About Academy
              </h2>

            </div>

            <div className="profile-fields">

              {/* Bio */}

              <div>

                <FiUser size={20} />

                <span>
                  Academy Bio
                </span>

                <p>
                  {profile?.bio ||
                    "Not added"}
                </p>

              </div>

              {/* Training Programs */}

              <div>

                <FiBriefcase size={20} />

                <span>
                  Training Programs
                </span>

                <p>
                  {profile?.trainingPrograms?.length
                    ? profile.trainingPrograms.join(", ")
                    : "Not added"}
                </p>

              </div>

              {/* Facilities */}

              <div>

                <FiUsers size={20} />

                <span>
                  Facilities
                </span>

                <p>
                  {profile?.facilities?.length
                    ? profile.facilities.join(", ")
                    : "Not added"}
                </p>

              </div>

              {/* Achievements */}

              <div>

                <FiBriefcase size={20} />

                <span>
                  Achievements
                </span>

                <p>
                  {profile?.achievements?.length
                    ? profile.achievements.join(", ")
                    : "Not added"}
                </p>

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
};

export default AcademyDashboard;