import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiUsers,
  FiCompass,
  FiBriefcase,
  FiUserPlus,
  FiLogOut
} from "react-icons/fi";
import CoachSidebar from "../../components/CoachSidebar";

const CoachDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    fetchCoachProfile();
  }, []);

  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser.role !== "coach") {
          navigate("/auth", { replace: true });
          return;
        }

        setUser(parsedUser);
      }
    } catch (error) {
      console.error(
        "Failed to parse user data:",
        error
      );
    }
  };

  const fetchCoachProfile = async () => {
    try {
      setLoading(true);

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
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/auth", {
          replace: true
        });

        return;
      }

      if (error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/auth", {
          replace: true
        });

        return;
      }

      console.error(
        "Failed to fetch coach profile:",
        error
      );

      setCoach(null);
    } finally {
      setLoading(false);
    }
  };

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

  const calculateProfileCompletion = () => {
    if (!coach) {
      return 0;
    }

    const profile =
      coach.coachProfile || coach;

    const address =
      profile.address || {};

    const fields = [
      profile.phone,
      address.city,
      address.state,
      address.country,
      profile.sport,
      profile.specialization,
      profile.experience,
      profile.organization,
      profile.achievements,
      profile.skills,
      profile.bio
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
        <CoachSidebar />

        <main className="dashboard-content">
          <section className="welcome-section">
            <h1>
              Welcome,{" "}
              {user?.name || "Coach"}
            </h1>

            <p>
              Manage your athletes, discover
              talent and create opportunities.
            </p>
          </section>

          {!loading &&
            coach &&
            profileCompletion < 100 && (
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
                  Complete your profile so
                  athletes can learn more
                  about you.
                </p>

                <button
                  onClick={() =>
                    navigate(
                      "/coach/profile?mode=edit"
                    )
                  }
                >
                  Complete Profile
                </button>
              </section>
            )}

          <section className="dashboard-section">
            <div className="section-header">
              <h2>What You Can Do</h2>
            </div>

            <div className="profile-fields">
              <div
                onClick={() =>
                  navigate(
                    "/coach/my-profile"
                  )
                }
              >
                <FiUser size={20} />

                <span>
                  Coach Profile
                </span>

                <p>
                  Add your coaching details
                  and experience
                </p>
              </div>

              <div
                onClick={() =>
                  navigate(
                    "/coach/athletes"
                  )
                }
              >
                <FiUsers size={20} />

                <span>
                  My Athletes
                </span>

                <p>
                  Manage athletes connected
                  with you
                </p>
              </div>

              <div
                onClick={() =>
                  navigate(
                    "/coach/discover"
                  )
                }
              >
                <FiCompass size={20} />

                <span>
                  Discover Athletes
                </span>

                <p>
                  Find athletes based on
                  sport and skills
                </p>
              </div>

              <div
                onClick={() =>
                  navigate(
                    "/coach/opportunities"
                  )
                }
              >
                <FiBriefcase size={20} />

                <span>
                  Opportunities
                </span>

                <p>
                  Create and manage sports
                  opportunities
                </p>
              </div>

              <div
                onClick={() =>
                  navigate(
                    "/coach/requests"
                  )
                }
              >
                <FiUserPlus size={20} />

                <span>
                  Athlete Requests
                </span>

                <p>
                  Review and manage athlete
                  requests
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CoachDashboard;