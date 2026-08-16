import { useNavigate } from "react-router-dom";
// FontAwesome/Feather Icons for React
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
      {/* Top Header */}
      <header className="dashboard-header">
       <div className="logo">Athlyx
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

      {/* Main Layout */}
      <div className="dashboard-layout">
        {/* Collapsed Icon Sidebar with Tooltips */}
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

        {/* Main Content Area */}
        <main className="dashboard-content">
          <div className="welcome-section">
            <h1>Welcome, {user?.name || "Athlete"}</h1>
            <p>Manage your athletic journey with Athlyx.</p>
          </div>

          {/* Cards Grid */}
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>My Profile</h3>
              <p>
                Complete your athlete profile to showcase your talent to recruiters and coaches.
              </p>
              <button onClick={() => navigate("/athlete/profile")}>
                View Profile
              </button>
            </div>

            <div className="dashboard-card">
              <h3>Discover</h3>
              <p>
                Find opportunities and connect directly with the broader sports community.
              </p>
              <button onClick={() => navigate("/athlete/discover")}>
                Explore
              </button>
            </div>

            <div className="dashboard-card">
              <h3>Opportunities</h3>
              <p>
                Explore upcoming trials, events, and sponsorship opportunities for athletes.
              </p>
              <button onClick={() => navigate("/athlete/opportunities")}>
                View Opportunities
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AthleteDashboard;