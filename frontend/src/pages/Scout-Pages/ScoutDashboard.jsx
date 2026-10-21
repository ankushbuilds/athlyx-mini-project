
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiUser,
  FiCompass,
  FiBriefcase,
  FiLogOut
} from "react-icons/fi";

import ScoutSidebar from "../../components/ScoutSidebar";

const API = "http://localhost:5000/api";

const ScoutDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [scout, setScout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    fetchScoutProfile();
  }, []);

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

  const fetchScoutProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      const response = await axios.get(
        `${API}/scouts/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setScout(response.data.scout);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/auth", { replace: true });
      } else if (error.response?.status === 404) {
        setScout(null);
      } else {
        console.error(
          "Failed to fetch scout profile:",
          error
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isFilled = (value) => {
    if (value === undefined || value === null) {
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

  const calculateProfileCompletion = () => {
    if (!scout) {
      return 0;
    }

    const fields = [
      scout.organization,
      scout.sport,
      scout.specialization,
      scout.experience,
      scout.phone,
      scout.address,
      scout.achievements,
      scout.skills,
      scout.bio,
      scout.socialLinks?.instagram,
      scout.socialLinks?.linkedin,
      scout.socialLinks?.website
    ];

    const completedFields =
      fields.filter(isFilled).length;

    return Math.round(
      (completedFields / fields.length) * 100
    );
  };

  const profileCompletion =
    calculateProfileCompletion();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/auth", {
      replace: true
    });
  };

  return (
    <div className="athlete-dashboard">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">

        <div className="logo">

          <img
            src="/logo.png"
            alt="Athlyx"
          />

          <span>Athlyx</span>

        </div>

        <div className="header-right">

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <FiLogOut size={18} />

            <span>Logout</span>
          </button>

        </div>

      </header>


      {/* ================= DASHBOARD ================= */}

      <div className="dashboard-layout">

        <ScoutSidebar />

        <main className="dashboard-content">

          {/* ================= WELCOME ================= */}

          <section className="welcome-section">

            <h1>
              Welcome,{" "}
              {user?.name || "Scout"}
            </h1>

            <p>
              Manage your scout profile and
              discover talented athletes.
            </p>

          </section>


          {/* ================= PROFILE COMPLETION ================= */}

          {!loading && (
            <>
              {!scout ? (

                <section className="profile-completion-card">

                  <div className="completion-header">

                    <div>

                      <span>
                        PROFILE SETUP
                      </span>

                      <h2>
                        Create Your Scout Profile
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
                    />

                  </div>


                  <p>
                    Create your scout profile so
                    you can discover and connect
                    with talented athletes.
                  </p>


                  <button
                    onClick={() =>
                      navigate("/scout/my-profile")
                    }
                  >
                    Create Profile
                  </button>

                </section>

              ) : profileCompletion < 100 ? (

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
                        width:
                          `${profileCompletion}%`
                      }}
                    />

                  </div>


                  <p>
                    Complete your scout profile
                    to build your professional
                    scouting identity.
                  </p>


                  <button
                    onClick={() =>
                      navigate("/scout/my-profile")
                    }
                  >
                    Complete Profile
                  </button>

                </section>

              ) : null}
            </>
          )}


          {/* ================= WHAT SCOUT CAN DO ================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                What You Can Do
              </h2>

            </div>


            <div className="profile-fields">

              {/* Discover Athletes */}

              <div>

                <FiCompass size={20} />

                <span>
                  Discover Athletes
                </span>

                <p>
                  Find talented athletes
                  based on sport and skills
                </p>

              </div>


              {/* Athlete Profiles */}

              <div>

                <FiUser size={20} />

                <span>
                  Athlete Profiles
                </span>

                <p>
                  View athlete profiles,
                  achievements and experience
                </p>

              </div>


              {/* Scouting */}

              <div>

                <FiBriefcase size={20} />

                <span>
                  Scouting
                </span>

                <p>
                  Connect with athletes
                  and build your network
                </p>

              </div>


              {/* Your Profile */}

              <div>

                <FiUser size={20} />

                <span>
                  Scout Profile
                </span>

                <p>
                  Add your organization,
                  specialization and experience
                </p>

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
};

export default ScoutDashboard;
