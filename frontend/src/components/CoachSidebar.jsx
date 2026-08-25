import { useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiUsers,
  FiCompass,
  FiBriefcase,
  FiUserPlus,
  FiSettings
} from "react-icons/fi";

const CoachSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-icon-only">
      <div
        className={`sidebar-item ${
          isActive("/coach/dashboard") ? "active" : ""
        }`}
        data-tooltip="Dashboard"
        onClick={() => navigate("/coach/dashboard")}
      >
        <FiGrid size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/coach/my-profile") ? "active" : ""
        }`}
        data-tooltip="My Profile"
        onClick={() => navigate("/coach/my-profile")}
      >
        <FiUser size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/coach/athletes") ? "active" : ""
        }`}
        data-tooltip="My Athletes"
        onClick={() => navigate("/coach/athletes")}
      >
        <FiUsers size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/coach/discover") ? "active" : ""
        }`}
        data-tooltip="Discover Athletes"
        onClick={() => navigate("/coach/discover")}
      >
        <FiCompass size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/coach/opportunities") ? "active" : ""
        }`}
        data-tooltip="Opportunities"
        onClick={() => navigate("/coach/opportunities")}
      >
        <FiBriefcase size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/coach/requests") ? "active" : ""
        }`}
        data-tooltip="Requests"
        onClick={() => navigate("/coach/requests")}
      >
        <FiUserPlus size={22} />
      </div>

      <div
        className={`sidebar-item ${
          isActive("/coach/settings") ? "active" : ""
        }`}
        data-tooltip="Settings"
        onClick={() => navigate("/coach/settings")}
      >
        <FiSettings size={22} />
      </div>
    </aside>
  );
};

export default CoachSidebar;