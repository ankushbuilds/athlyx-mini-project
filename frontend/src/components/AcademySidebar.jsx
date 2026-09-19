
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
  FiGrid,
  FiUser,
  FiUsers,
  FiCompass,
  FiUserPlus,
  FiMessageCircle,
  FiSettings
} from "react-icons/fi";

const API = "http://localhost:5000/api";

const UNREAD_COUNT_KEY = "academyUnreadMessageCount";

const AcademySidebar = () => {
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
  // PENDING REQUEST COUNT
  // ======================================================

  const [requestCount, setRequestCount] = useState(0);

  // ======================================================
  // ACTIVE SIDEBAR ITEM
  // ======================================================

  const isActive = (path) => location.pathname === path;

  // ======================================================
  // FETCH COUNTS
  // ======================================================

  useEffect(() => {
    let isMounted = true;

    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`
        };

        // ================================================
        // FETCH UNREAD MESSAGES
        // ================================================

        const messageResponse = await axios.get(
          `${API}/chat/unread-count`,
          {
            headers,
            timeout: 10000
          }
        );

        const messageCount =
          Number(
            messageResponse.data?.unreadCount
          ) || 0;

        // ================================================
        // FETCH PENDING ACADEMY REQUESTS
        // ================================================

        const requestsResponse = await axios.get(
          `${API}/connections/academy/requests`,
          {
            headers,
            timeout: 10000
          }
        );

        const pendingRequestCount =
          Number(
            requestsResponse.data?.count
          ) || 0;

        // ================================================
        // UPDATE STATE
        // ================================================

        if (isMounted) {
          setUnreadCount(messageCount);

          setRequestCount(
            pendingRequestCount
          );

          localStorage.setItem(
            UNREAD_COUNT_KEY,
            String(messageCount)
          );
        }

      } catch (error) {
        console.error(
          "Failed to fetch academy sidebar counts:",
          error
        );
      }
    };

    // Initial fetch
    fetchCounts();

    // Check every 5 seconds
    const interval = setInterval(
      fetchCounts,
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
          isActive("/academy/dashboard")
            ? "active"
            : ""
        }`}
        data-tooltip="Dashboard"
        onClick={() =>
          navigate("/academy/dashboard")
        }
      >
        <FiGrid size={22} />
      </div>

      {/* ==================================================
          MY PROFILE
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/academy/my-profile")
            ? "active"
            : ""
        }`}
        data-tooltip="My Profile"
        onClick={() =>
          navigate("/academy/my-profile")
        }
      >
        <FiUser size={22} />
      </div>

      {/* ==================================================
          MY ATHLETES
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/academy/athletes")
            ? "active"
            : ""
        }`}
        data-tooltip="My Athletes"
        onClick={() =>
          navigate("/academy/athletes")
        }
      >
        <FiUsers size={22} />
      </div>

      {/* ==================================================
          DISCOVER
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/academy/discover")
            ? "active"
            : ""
        }`}
        data-tooltip="Discover Athletes"
        onClick={() =>
          navigate("/academy/discover")
        }
      >
        <FiCompass size={22} />
      </div>

      {/* ==================================================
          REQUESTS
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/academy/requests")
            ? "active"
            : ""
        }`}
        data-tooltip="Requests"
        onClick={() =>
          navigate("/academy/requests")
        }
      >
        <div className="sidebar-message-icon">

          <FiUserPlus size={22} />

          {/* ==============================================
              PENDING REQUEST BADGE
          ============================================== */}

          {requestCount > 0 && (
            <span className="sidebar-message-badge">
              {requestCount > 99
                ? "99+"
                : requestCount}
            </span>
          )}

        </div>
      </div>

      {/* ==================================================
          MESSAGES
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/academy/messages")
            ? "active"
            : ""
        }`}
        data-tooltip="Messages"
        onClick={() =>
          navigate("/academy/messages")
        }
      >
        <div className="sidebar-message-icon">

          <FiMessageCircle size={22} />

          {/* ==============================================
              UNREAD MESSAGE BADGE
          ============================================== */}

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
          isActive("/academy/settings")
            ? "active"
            : ""
        }`}
        data-tooltip="Settings"
        onClick={() =>
          navigate("/academy/settings")
        }
      >
        <FiSettings size={22} />
      </div>

    </aside>
  );
};

export default AcademySidebar;
