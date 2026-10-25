import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  FiGrid,
  FiUser,
  FiSearch,
  FiStar,
  FiUsers,
  FiMessageCircle,
  FiSettings
} from "react-icons/fi";

const API = "http://localhost:5000/api";

const UNREAD_COUNT_KEY = "scoutUnreadMessageCount";

const ScoutSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");

  // ======================================================
  // UNREAD MESSAGE COUNT
  // ======================================================

  const [unreadCount, setUnreadCount] = useState(() => {
    const savedCount = localStorage.getItem(UNREAD_COUNT_KEY);

    const parsedCount = Number(savedCount);

    return Number.isFinite(parsedCount)
      ? parsedCount
      : 0;
  });

  // ======================================================
  // ACTIVE SIDEBAR ITEM
  // ======================================================

  const isActive = (path) =>
    location.pathname === path;

  // ======================================================
  // FETCH UNREAD MESSAGE COUNT
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
        // SCOUT SIDEBAR SHOULD ONLY WORK FOR SCOUT
        // ==================================================

        if (user?.role !== "scout") {
          console.warn(
            "ScoutSidebar skipped because current user role is:",
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

      } catch (error) {
        console.error(
          "Failed to fetch scout sidebar counts:",
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
  // SIDEBAR
  // ======================================================

  return (
    <aside className="sidebar-icon-only">

      {/* ==================================================
          DASHBOARD
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/scout/dashboard")
            ? "active"
            : ""
        }`}
        data-tooltip={t("sidebar.dashboard")}
        onClick={() =>
          navigate("/scout/dashboard")
        }
      >
        <FiGrid size={22} />
      </div>


      {/* ==================================================
          MY PROFILE
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/scout/my-profile")
            ? "active"
            : ""
        }`}
        data-tooltip={t("sidebar.myProfile")}
        onClick={() =>
          navigate("/scout/my-profile")
        }
      >
        <FiUser size={22} />
      </div>


      {/* ==================================================
          DISCOVER ATHLETES
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/scout/discover")
            ? "active"
            : ""
        }`}
        data-tooltip={t("sidebar.discoverAthletes")}
        onClick={() =>
          navigate("/scout/discover")
        }
      >
        <FiSearch size={22} />
      </div>


      {/* ==================================================
          SHORTLISTED ATHLETES
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/scout/shortlisted")
            ? "active"
            : ""
        }`}
        data-tooltip={t("sidebar.shortlisted")}
        onClick={() =>
          navigate("/scout/shortlisted")
        }
      >
        <FiStar size={22} />
      </div>


     


      {/* ==================================================
          MESSAGES
      ================================================== */}

      <div
        className={`sidebar-item ${
          isActive("/scout/messages")
            ? "active"
            : ""
        }`}
        data-tooltip={t("sidebar.messages")}
        onClick={() =>
          navigate("/scout/messages")
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
          isActive("/scout/settings")
            ? "active"
            : ""
        }`}
        data-tooltip={t("sidebar.settings")}
        onClick={() =>
          navigate("/scout/settings")
        }
      >
        <FiSettings size={22} />
      </div>

    </aside>
  );
};

export default ScoutSidebar;