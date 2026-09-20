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
  // COACH REQUEST COUNT
  // ======================================================

  const [requestCount, setRequestCount] = useState(0);

  // ======================================================
  // ACADEMY REQUEST COUNT
  // ======================================================

  const [academyRequestCount, setAcademyRequestCount] =
    useState(0);

  // ======================================================
  // ACTIVE SIDEBAR ITEM
  // ======================================================

  const isActive = (path) =>
    location.pathname === path;

  // ======================================================
  // FETCH UNREAD MESSAGES + REQUEST COUNTS
  // ======================================================

  useEffect(() => {
    let isMounted = true;

    const fetchSidebarCounts = async () => {
      try {
        // ==================================================
        // GET CURRENT USER
        // ==================================================

        const storedUser =
          localStorage.getItem("user");

        let user = null;

        try {
          user = storedUser
            ? JSON.parse(storedUser)
            : null;
        } catch (error) {
          console.error(
            "Invalid user data in localStorage"
          );

          return;
        }

        // ==================================================
        // IMPORTANT:
        // ATHLETE SIDEBAR SHOULD ONLY WORK FOR ATHLETE
        // ==================================================

        if (user?.role !== "athlete") {
          console.warn(
            "AthleteSidebar skipped because current user role is:",
            user?.role
          );

          return;
        }

        // ==================================================
        // TOKEN
        // ==================================================

        const token =
          localStorage.getItem("token");

        if (!token) {
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`
        };

        // ==================================================
        // FETCH UNREAD MESSAGE COUNT
        // ==================================================

        try {
          const messageResponse =
            await axios.get(
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

          if (isMounted) {
            setUnreadCount(messageCount);

            localStorage.setItem(
              UNREAD_COUNT_KEY,
              String(messageCount)
            );
          }
        } catch (messageError) {
          console.error(
            "Failed to fetch unread message count:",
            messageError
          );
        }

        // ==================================================
        // FETCH COACH REQUEST COUNT
        // ==================================================

        try {
          const requestResponse =
            await axios.get(
              `${API}/connections/athlete/requests`,
              {
                headers,
                timeout: 10000
              }
            );

          const coachRequestCount =
            Number(
              requestResponse.data?.count
            ) ||
            requestResponse.data?.requests?.length ||
            0;

          if (isMounted) {
            setRequestCount(
              coachRequestCount
            );
          }
        } catch (requestError) {
          if (
            requestError.response?.status === 401
          ) {
            console.warn(
              "AthleteSidebar authentication expired."
            );
          } else if (
            requestError.response?.status === 403
          ) {
            console.warn(
              "AthleteSidebar: current account is not allowed to access athlete requests."
            );

            if (isMounted) {
              setRequestCount(0);
            }
          } else {
            console.error(
              "Failed to fetch coach request count:",
              requestError
            );
          }
        }

        // ==================================================
        // FETCH ACADEMY REQUEST COUNT
        // ==================================================

        try {
          const academyRequestResponse =
            await axios.get(
              `${API}/connections/athlete/academy-requests`,
              {
                headers,
                timeout: 10000
              }
            );

          const academyCount =
            Number(
              academyRequestResponse.data?.count
            ) ||
            academyRequestResponse.data?.requests?.length ||
            0;

          if (isMounted) {
            setAcademyRequestCount(
              academyCount
            );
          }
        } catch (academyRequestError) {
          if (
            academyRequestError.response?.status === 401
          ) {
            console.warn(
              "AthleteSidebar authentication expired while fetching academy requests."
            );
          } else if (
            academyRequestError.response?.status === 403
          ) {
            console.warn(
              "AthleteSidebar: current account is not allowed to access academy requests."
            );

            if (isMounted) {
              setAcademyRequestCount(0);
            }
          } else {
            console.error(
              "Failed to fetch academy request count:",
              academyRequestError
            );
          }
        }

      } catch (error) {
        console.error(
          "Failed to fetch sidebar counts:",
          error
        );
      }
    };

    // ======================================================
    // INITIAL FETCH
    // ======================================================

    fetchSidebarCounts();

    // ======================================================
    // REFRESH EVERY 5 SECONDS
    // ======================================================

    const interval = setInterval(
      fetchSidebarCounts,
      5000
    );

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // ======================================================
  // TOTAL CONNECTION REQUEST COUNT
  // ======================================================

  const totalRequestCount =
    requestCount + academyRequestCount;

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
        <div className="sidebar-message-icon">

          <FiUsers size={22} />

          {/* ==============================================
              COACH + ACADEMY REQUEST BADGE
          ============================================== */}

          {totalRequestCount > 0 && (
            <span className="sidebar-message-badge">
              {totalRequestCount > 99
                ? "99+"
                : totalRequestCount}
            </span>
          )}

        </div>
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