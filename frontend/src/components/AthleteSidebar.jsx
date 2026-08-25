import { useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiCompass,
  FiBriefcase,
  FiSettings,
  FiAward,
  FiUsers
} from "react-icons/fi";

const AthleteSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-icon-only">
      <div
        className={`sidebar-item ${
          isActive("/athlete/dashboard") ? "active" : ""
        }`}
        data-tooltip="Dashboard"
        onClick={() => navigate("/athlete/dashboard")}
      >
        <FiGrid size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/athlete/my-profile") ? "active" : ""
        }`}
        data-tooltip="My Profile"
        onClick={() => navigate("/athlete/my-profile")}
      >
        <FiUser size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/athlete/discover") ? "active" : ""
        }`}
        data-tooltip="Discover"
        onClick={() => navigate("/athlete/discover")}
      >
        <FiCompass size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/athlete/opportunities") ? "active" : ""
        }`}
        data-tooltip="Opportunities"
        onClick={() => navigate("/athlete/opportunities")}
      >
        <FiBriefcase size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/athlete/showcase") ? "active" : ""
        }`}
        data-tooltip="Showcase"
        onClick={() => navigate("/athlete/showcase")}
      >
        <FiAward size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/athlete/connections") ? "active" : ""
        }`}
        data-tooltip="Connections"
        onClick={() => navigate("/athlete/connections")}
      >
        <FiUsers size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/athlete/settings") ? "active" : ""
        }`}
        data-tooltip="Settings"
        onClick={() => navigate("/athlete/settings")}
      >
        <FiSettings size={22} />
      </div>
    </aside>
  );
};

export default AthleteSidebar;