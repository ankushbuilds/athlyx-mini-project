import { useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiCompass,
  FiBriefcase,
  FiSettings,
  FiLogOut
} from "react-icons/fi";

const AthleteDashboard = () => {
  const navigate = useNavigate();

  const getUserData = () => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  };

  const user = getUserData();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth", { replace: true });
  };

  return (
    <div className="athlete-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <img src="/logo.png" alt="Athlyx" />
        </div>

        <div className="header-right">
          <span>{user?.name || "Athlete"}</span>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar-icon-only">
          <div
            className="sidebar-item active"
            data-tooltip="Dashboard"
            onClick={() => navigate("/athlete/dashboard")}
          >
            <FiGrid size={22} />
          </div>

          <div
            className="sidebar-item"
            data-tooltip="My Profile"
            onClick={() => navigate("/athlete/profile")}
          >
            <FiUser size={22} />
          </div>

          <div
            className="sidebar-item"
            data-tooltip="Discover"
            onClick={() => navigate("/athlete/discover")}
          >
            <FiCompass size={22} />
          </div>

          <div
            className="sidebar-item"
            data-tooltip="Opportunities"
            onClick={() => navigate("/athlete/opportunities")}
          >
            <FiBriefcase size={22} />
          </div>

          <div
            className="sidebar-item"
            data-tooltip="Settings"
            onClick={() => navigate("/athlete/settings")}
          >
            <FiSettings size={22} />
          </div>
        </aside>

        <main className="dashboard-content">
          <div className="welcome-section">
            <h1>Welcome, {user?.name || "Athlete"}</h1>
            <p>Manage your athletic journey with Athlyx.</p>
          </div>

          <div className="athlete-overview">
            <div className="overview-card">
              <span>Sport</span>
              <h2>{user?.sport || "Not Added"}</h2>
            </div>

            <div className="overview-card">
              <span>Age</span>
              <h2>{user?.age || "Not Added"}</h2>
            </div>

            <div className="overview-card">
              <span>Height</span>
              <h2>{user?.height ? `${user.height} cm` : "Not Added"}</h2>
            </div>

            <div className="overview-card">
              <span>Profile Status</span>
              <h2>{user ? "Active" : "Incomplete"}</h2>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>My Athletic Profile</h2>
              <button onClick={() => navigate("/athlete/profile")}>
                Edit Profile
              </button>
            </div>

            <div className="profile-summary">
              <div>
                <span>Name</span>
                <p>{user?.name || "Not Added"}</p>
              </div>

              <div>
                <span>Email</span>
                <p>{user?.email || "Not Added"}</p>
              </div>

              <div>
                <span>Sport</span>
                <p>{user?.sport || "Not Added"}</p>
              </div>

              <div>
                <span>Location</span>
                <p>{user?.location || "Not Added"}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>

            <div className="quick-actions">
              <button onClick={() => navigate("/athlete/profile")}>
                <FiUser size={20} />
                My Profile
              </button>

              <button onClick={() => navigate("/athlete/discover")}>
                <FiCompass size={20} />
                Discover Talent
              </button>

              <button onClick={() => navigate("/athlete/opportunities")}>
                <FiBriefcase size={20} />
                Opportunities
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AthleteDashboard;