import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
  FiGrid,
  FiUser,
  FiCompass,
  FiBriefcase,
  FiSettings,
  FiAward,
  FiUsers,
  FiMessageCircle,
  FiTarget
} from "react-icons/fi";

const API = "http://localhost:5000/api";

const UNREAD_COUNT_KEY = "athleteUnreadMessageCount";

const AthleteSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ======================================================
  // UNREAD MESSAGE COUNT
  // ======================================================

  const [unreadCount, setUnreadCount] = useState(() => {
    const savedCount = localStorage.getItem(
      UNREAD_COUNT_KEY
    );

    const parsedCount = Number(savedCount);

    return Number.isFinite(parsedCount)
      ? parsedCount
      : 0;
  });

  // ======================================================
  // ACTIVE SIDEBAR ITEM
  // ======================================================

  const isActive = (path) => location.pathname === path;

  // ======================================================
  // FETCH UNREAD MESSAGE COUNT
  // ======================================================

  useEffect(() => {
    let isMounted = true;

    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await axios.get(
          `${API}/chat/unread-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const count =
          Number(response.data?.unreadCount) || 0;

        if (isMounted) {
          setUnreadCount(count);

          localStorage.setItem(
            UNREAD_COUNT_KEY,
            String(count)
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch unread message count:",
          error
        );
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Check for new messages every 5 seconds
    const interval = setInterval(
      fetchUnreadCount,
      5000
    );

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // ======================================================
  // SIDEBAR
  // ======================================================

  return (
    <aside className="sidebar-icon-only">

      {/* ==================================================
          DASHBOARD
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/athlete/dashboard")
            ? "active"
            : ""
        }`}
        data-tooltip="Dashboard"
        onClick={() =>
          navigate("/athlete/dashboard")
        }
      >
        <FiGrid size={22} />
      </div>


      {/* ==================================================
          MY PROFILE
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/athlete/my-profile")
            ? "active"
            : ""
        }`}
        data-tooltip="My Profile"
        onClick={() =>
          navigate("/athlete/my-profile")
        }
      >
        <FiUser size={22} />
      </div>


      {/* ==================================================
          DISCOVER
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/athlete/discover")
            ? "active"
            : ""
        }`}
        data-tooltip="Discover"
        onClick={() =>
          navigate("/athlete/discover")
        }
      >
        <FiCompass size={22} />
      </div>


      {/* ==================================================
          OPPORTUNITIES
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/athlete/opportunities")
            ? "active"
            : ""
        }`}
        data-tooltip="Opportunities"
        onClick={() =>
          navigate("/athlete/opportunities")
        }
      >
        <FiBriefcase size={22} />
      </div>


      {/* ==================================================
          SHOWCASE
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/athlete/showcase")
            ? "active"
            : ""
        }`}
        data-tooltip="Showcase"
        onClick={() =>
          navigate("/athlete/showcase")
        }
      >
        <FiAward size={22} />
      </div>


      {/* ==================================================
          CHALLENGES
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/athlete/challenges")
            ? "active"
            : ""
        }`}
        data-tooltip="Challenges"
        onClick={() =>
          navigate("/athlete/challenges")
        }
      >
        <FiTarget size={22} />
      </div>


      {/* ==================================================
          CONNECTIONS
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/athlete/connections")
            ? "active"
            : ""
        }`}
        data-tooltip="Connections"
        onClick={() =>
          navigate("/athlete/connections")
        }
      >
        <FiUsers size={22} />
      </div>


      {/* ==================================================
          MESSAGES
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/athlete/messages")
            ? "active"
            : ""
        }`}
        data-tooltip="Messages"
        onClick={() =>
          navigate("/athlete/messages")
        }
      >
        <div className="sidebar-message-icon">

          <FiMessageCircle size={22} />

          {/* ==================================================
              UNREAD BADGE
          ================================================== */}

          {unreadCount > 0 && (
            <span className="sidebar-message-badge">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}

        </div>
      </div>


      {/* ==================================================
          SETTINGS
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/athlete/settings")
            ? "active"
            : ""
        }`}
        data-tooltip="Settings"
        onClick={() =>
          navigate("/athlete/settings")
        }
      >
        <FiSettings size={22} />
      </div>

    </aside>
  );
};

export default AthleteSidebar;