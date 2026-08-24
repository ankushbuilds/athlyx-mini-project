import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiCompass,
  FiBriefcase,
  FiLogOut
} from "react-icons/fi";
import AthleteSidebar from "../components/AthleteSidebar";

const AthleteDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    fetchAthleteProfile();
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
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/auth", { replace: true });
      } else if (error.response?.status === 404) {
        setAthlete(null);
      } else {
        console.error(
          "Failed to fetch athlete profile:",
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
    if (!athlete) {
      return 0;
    }

    const fields = [
      athlete.dateOfBirth,
      athlete.gender,
      athlete.phone,
      athlete.address?.city,
      athlete.address?.state,
      athlete.address?.country,
      athlete.sport,
      athlete.position,
      athlete.experience,
      athlete.skills,
      athlete.bio,
      athlete.height,
      athlete.weight,
      athlete.achievements,
      athlete.socialLinks?.instagram,
      athlete.socialLinks?.facebook,
      athlete.socialLinks?.youtube
    ];

    const completedFields = fields.filter(isFilled).length;

    return Math.round(
      (completedFields / fields.length) * 100
    );
  };

  const profileCompletion = calculateProfileCompletion();

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

      <div className="dashboard-layout">
        <AthleteSidebar />

        <main className="dashboard-content">
          <section className="welcome-section">
            <h1>
              Welcome, {user?.name || "Athlete"}
            </h1>

            <p>
              Manage your athlete profile and showcase
              your talent.
            </p>
          </section>

          {!loading && (
            <>
              {!athlete ? (
                <section className="profile-completion-card">
                  <div className="completion-header">
                    <div>
                      <span>PROFILE SETUP</span>

                      <h2>
                        Create Your Athlete Profile
                      </h2>
                    </div>

                    <strong>0%</strong>
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
                    Create your athlete profile so
                    coaches and scouts can discover you.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/athlete/profile")
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
                        width: `${profileCompletion}%`
                      }}
                    ></div>
                  </div>

                  <p>
                    Complete your profile to help
                    coaches and scouts discover you.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/athlete/profile")
                    }
                  >
                    Complete Profile
                  </button>
                </section>
              ) : null}
            </>
          )}

          <section className="dashboard-section">
            <div className="section-header">
              <h2>What You Can Add</h2>
            </div>

            <div className="profile-fields">
              <div>
                <FiUser size={20} />

                <span>
                  Personal Details
                </span>

                <p>
                  Date of birth, gender and phone
                </p>
              </div>

              <div>
                <FiCompass size={20} />

                <span>
                  Sports Details
                </span>

                <p>
                  Sport, position and experience
                </p>
              </div>

              <div>
                <FiBriefcase size={20} />

                <span>
                  Achievements
                </span>

                <p>
                  Achievements, skills and experience
                </p>
              </div>

              <div>
                <FiUser size={20} />

                <span>
                  About You
                </span>

                <p>
                  Bio, height and weight
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AthleteDashboard;