import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiBookmark,
  FiUser,
  FiMapPin,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";

import ScoutSidebar from "../../components/ScoutSidebar";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ShortList = () => {
  const navigate = useNavigate();

  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [search, setSearch] = useState("");

  // ==========================================
  // LOAD SHORTLIST FROM BACKEND
  // ==========================================

  const fetchShortlist = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAthletes([]);
        setError("Please log in to view your shortlist.");
        return;
      }

      const response = await axios.get(`${API}/shortlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const shortlist = response.data?.shortlist;

      // Each shortlist entry contains the populated athlete.
      const savedAthletes = Array.isArray(shortlist)
        ? shortlist
            .map((item) => item?.athlete)
            .filter(
              (athlete) =>
                athlete && typeof athlete === "object" && athlete._id
            )
        : [];

      setAthletes(savedAthletes);
    } catch (err) {
      console.error(
        "Failed to load shortlist:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your shortlist. Please try refreshing."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShortlist();

    const handleFocus = () => fetchShortlist();

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchShortlist]);

  // ==========================================
  // REMOVE ATHLETE FROM BACKEND SHORTLIST
  // ==========================================

  const removeAthlete = async (athleteId) => {
    const confirmed = window.confirm(
      "Remove this athlete from your shortlist?"
    );

    if (!confirmed) return;

    setRemovingId(athleteId);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/shortlist/${athleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAthletes((current) =>
        current.filter(
          (athlete) => String(athlete._id) !== String(athleteId)
        )
      );
    } catch (err) {
      console.error(
        "Failed to remove athlete:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to remove athlete. Please try again."
      );
    } finally {
      setRemovingId(null);
    }
  };

  // ==========================================
  // ATHLETE HELPERS
  // ==========================================

  const getAthleteName = (athlete) =>
    athlete?.user?.name ||
    athlete?.name ||
    "Athlete";

  const getProfilePic = (athlete) =>
    athlete?.user?.profilePic ||
    athlete?.profilePic ||
    "";

  const getSport = (athlete) =>
    athlete?.sport || "Sport not specified";

  const getLocation = (athlete) => {
    if (typeof athlete?.address === "string") {
      return athlete.address;
    }

    const city = athlete?.address?.city || athlete?.city || "";
    const state = athlete?.address?.state || athlete?.state || "";
    const country = athlete?.address?.country || "";

    return [city, state, country]
      .filter(Boolean)
      .join(", ");
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredAthletes = athletes.filter((athlete) => {
    const searchableText = [
      getAthleteName(athlete),
      athlete?.sport,
      athlete?.position,
      getLocation(athlete),
      athlete?.bio,
      Array.isArray(athlete?.skills)
        ? athlete.skills.join(" ")
        : athlete?.skills,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.trim().toLowerCase());
  });

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="scout-layout">
      <ScoutSidebar />

      <main className="shortlist-page">
        <div className="shortlist-header">
          <div>
            <span className="shortlist-eyebrow">
              SCOUT WORKSPACE
            </span>

            <h1>
              My <span>Shortlist</span>
            </h1>

            <p>
              Keep track of athletes worth watching.
            </p>
          </div>

          <button
            className="shortlist-refresh"
            onClick={fetchShortlist}
            type="button"
            disabled={loading}
          >
            <FiRefreshCw
              className={loading ? "shortlist-spinning" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="shortlist-error" role="alert">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* SUMMARY */}

        <div className="shortlist-summary">
          <div className="shortlist-summary-icon">
            <FiBookmark />
          </div>

          <div>
            <span>Saved athletes</span>
            <h2>{athletes.length}</h2>
          </div>
        </div>

        {/* SEARCH */}

        <div className="shortlist-toolbar">
          <FiSearch />

          <input
            type="text"
            placeholder="Search by name, sport, position..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {/* LOADING / EMPTY / RESULTS */}

        {loading ? (
          <div className="shortlist-status">
            Loading your shortlist...
          </div>
        ) : filteredAthletes.length === 0 ? (
          <div className="shortlist-empty">
            <FiBookmark size={36} />

            <h3>
              {athletes.length === 0
                ? "Your shortlist is empty"
                : "No athletes found"}
            </h3>

            <p>
              {athletes.length === 0
                ? "Explore athletes and save promising talent to find them here."
                : "Try another name, sport, or position."}
            </p>

            {athletes.length === 0 ? (
              <button
                type="button"
                className="shortlist-primary-btn"
                onClick={() => navigate("/scout/discover")}
              >
                Discover Athletes
              </button>
            ) : (
              <button
                type="button"
                className="shortlist-primary-btn"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="shortlist-grid">
            {filteredAthletes.map((athlete) => {
              const profilePic = getProfilePic(athlete);
              const location = getLocation(athlete);

              return (
                <article
                  className="shortlist-card"
                  key={athlete._id}
                >
                  <div className="shortlist-card-top">
                    {profilePic ? (
                      <img
                        className="shortlist-avatar"
                        src={profilePic}
                        alt={getAthleteName(athlete)}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="shortlist-avatar shortlist-avatar-placeholder">
                        <FiUser size={24} />
                      </div>
                    )}

                    <div className="shortlist-athlete-info">
                      <h3>{getAthleteName(athlete)}</h3>

                      <span className="shortlist-sport">
                        {getSport(athlete)}
                      </span>
                    </div>

                    <span className="shortlist-bookmark">
                      <FiBookmark />
                    </span>
                  </div>

                  {/* DETAILS */}

                  <div className="shortlist-details">
                    {athlete.position && (
                      <p>
                        <FiUser />
                        {athlete.position}
                      </p>
                    )}

                    {location && (
                      <p>
                        <FiMapPin />
                        {location}
                      </p>
                    )}

                    {athlete.experience != null && (
                      <p>
                        <FiUser />
                        {athlete.experience} years experience
                      </p>
                    )}
                  </div>

                  {athlete.bio && (
                    <p className="shortlist-bio">
                      {athlete.bio}
                    </p>
                  )}

                  {/* SKILLS */}

                  {Array.isArray(athlete.skills) &&
                    athlete.skills.length > 0 && (
                      <div className="athlete-skills">
                        {athlete.skills.slice(0, 3).map((skill, index) => (
                          <span key={`${skill}-${index}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                  {/* ACTIONS */}

                  <div className="shortlist-card-footer">
                    <button
                      type="button"
                      className="shortlist-view-btn"
                      onClick={() =>
                        navigate(`/scout/athlete/${athlete._id}`)
                      }
                    >
                      <FiEye />
                      View Profile
                    </button>

                    <button
                      type="button"
                      className="shortlist-remove-btn"
                      disabled={
                        String(removingId) === String(athlete._id)
                      }
                      onClick={() => removeAthlete(athlete._id)}
                      title="Remove from shortlist"
                    >
                      <FiTrash2 />

                      {String(removingId) === String(athlete._id)
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </div>

                  <div className="shortlist-added-date">
                    Saved to your shortlist
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ShortList;