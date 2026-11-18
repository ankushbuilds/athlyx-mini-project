
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiUser,
  FiMapPin,
  FiAward,
  FiSearch,
  FiX
} from "react-icons/fi";

import ScoutSidebar from "../../components/ScoutSidebar";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ScoutDiscover = () => {
  const navigate = useNavigate();

  const [athletes, setAthletes] = useState([]);
  const [scoutSport, setScoutSport] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");

  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("");

  // Shortlist entries now come from MongoDB.
  const [shortlistedAthletes, setShortlistedAthletes] = useState([]);
  const [shortlistLoading, setShortlistLoading] = useState({});

  const normalizedScoutSport = String(scoutSport)
    .trim()
    .toLowerCase();

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    timeout: 10000
  });

  // ==========================================
  // LOAD SHORTLIST FROM BACKEND
  // ==========================================

  const fetchShortlist = useCallback(async () => {
    const response = await axios.get(
      `${API}/shortlist`,
      getAuthConfig()
    );

    const entries = Array.isArray(response.data?.shortlist)
      ? response.data.shortlist
      : [];

    setShortlistedAthletes(entries);

    return entries;
  }, []);

  // ==========================================
  // LOAD SCOUT PROFILE AND ATHLETES
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        setLoading(true);
        setError("");
        setProfileError("");

        let scout;

        try {
          const profileResponse = await axios.get(
            `${API}/scouts/profile`,
            config
          );

          scout = profileResponse.data?.scout;

          if (!scout) {
            throw new Error(
              "Scout profile was not returned by the server."
            );
          }
        } catch (err) {
          if (
            err.response?.status === 401 ||
            err.response?.status === 403
          ) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/auth", { replace: true });
            return;
          }

          if (err.response?.status === 404) {
            if (!cancelled) {
              setScoutSport("");
              setProfileError(
                "Scout profile not found. Please complete your scout profile first."
              );
            }
            return;
          }

          throw err;
        }

        if (cancelled) return;

        const sport = String(scout.sport || "")
          .trim()
          .toLowerCase();

        setScoutSport(sport);

        // Synchronize scout information with local user data.
        try {
          const storedUser = JSON.parse(
            localStorage.getItem("user") || "{}"
          );

          localStorage.setItem(
            "user",
            JSON.stringify({
              ...storedUser,
              sport,
              specialization: scout.specialization || "",
              organization: scout.organization || "",
              experience: scout.experience ?? 0,
              scoutProfile: scout
            })
          );
        } catch (storageError) {
          console.error(
            "Could not synchronize scout profile:",
            storageError
          );
        }

        if (!sport) {
          setProfileError(
            "Your sport is not configured in your scout profile. Please update your profile."
          );
          return;
        }

        const athletesResponse = await axios.get(
          `${API}/athletes/get-all`,
          config
        );

        if (cancelled) return;

        const allAthletes = Array.isArray(
          athletesResponse.data?.athletes
        )
          ? athletesResponse.data.athletes
          : [];

        setAthletes(allAthletes);

        // Load shortlist independently so a shortlist error
        // does not hide the athlete discovery page.
        try {
          const shortlistResponse = await axios.get(
            `${API}/shortlist`,
            config
          );

          if (cancelled) return;

          setShortlistedAthletes(
            Array.isArray(shortlistResponse.data?.shortlist)
              ? shortlistResponse.data.shortlist
              : []
          );
        } catch (shortlistError) {
          console.error(
            "Failed to load shortlist:",
            shortlistError.response?.data || shortlistError.message
          );

          if (!cancelled) {
            setError(
              shortlistError.response?.data?.message ||
              "Could not load your shortlist. Please refresh the page."
            );
          }
        }
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Failed to load scout discovery data:",
          err
        );

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/auth", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
          "Failed to load athletes. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ==========================================
  // ATHLETE NAME
  // ==========================================

  const getAthleteName = (athlete) => {
    return (
      athlete?.user?.name ||
      athlete?.name ||
      "Athlete"
    );
  };

  // ==========================================
  // PROFILE PICTURE
  // ==========================================

  const getProfilePic = (athlete) => {
    return (
      athlete?.user?.profilePic ||
      athlete?.profilePic ||
      ""
    );
  };

  // ==========================================
  // LOCATION
  // ==========================================

  const getLocation = (athlete) => {
    if (typeof athlete?.address === "string") {
      return athlete.address;
    }

    const city = athlete?.address?.city || "";
    const state = athlete?.address?.state || "";
    const country = athlete?.address?.country || "";

    const parts = [city, state, country].filter(Boolean);

    return parts.length
      ? parts.join(", ")
      : "Location not available";
  };

  // ==========================================
  // SKILLS
  // ==========================================

  const getSkills = (athlete) => {
    if (Array.isArray(athlete?.skills)) {
      return athlete.skills;
    }

    if (
      typeof athlete?.skills === "string" &&
      athlete.skills.trim()
    ) {
      return athlete.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return [];
  };

  // ==========================================
  // CHECK SHORTLIST STATUS
  // ==========================================

  const isShortlisted = (athleteId) => {
    return shortlistedAthletes.some((item) => {
      const savedAthleteId =
        item?.athlete?._id ||
        item?.athlete ||
        item?.athleteId;

      return String(savedAthleteId) === String(athleteId);
    });
  };

  // ==========================================
  // ATHLETES IN THIS SCOUT'S SPORT ONLY
  // ==========================================

  const sportAthletes = useMemo(() => {
    if (!normalizedScoutSport) {
      return [];
    }

    return athletes.filter((athlete) => {
      const athleteSport = String(athlete?.sport || "")
        .trim()
        .toLowerCase();

      return athleteSport === normalizedScoutSport;
    });
  }, [athletes, normalizedScoutSport]);

  // ==========================================
  // AVAILABLE POSITIONS
  // ==========================================

  const positions = useMemo(() => {
    return [
      ...new Set(
        sportAthletes
          .map((athlete) =>
            typeof athlete?.position === "string"
              ? athlete.position.trim()
              : ""
          )
          .filter(Boolean)
      )
    ];
  }, [sportAthletes]);

  // ==========================================
  // FILTER ATHLETES
  // ==========================================

  const filteredAthletes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return sportAthletes.filter((athlete) => {
      const name = getAthleteName(athlete).toLowerCase();

      const athleteSport = String(athlete?.sport || "")
        .trim()
        .toLowerCase();

      const athletePosition = String(athlete?.position || "")
        .trim()
        .toLowerCase();

      const location = getLocation(athlete).toLowerCase();

      const skills = getSkills(athlete)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        athleteSport.includes(searchValue) ||
        athletePosition.includes(searchValue) ||
        location.includes(searchValue) ||
        skills.includes(searchValue);

      const matchesPosition =
        !position ||
        athletePosition === position.trim().toLowerCase();

      return matchesSearch && matchesPosition;
    });
  }, [sportAthletes, search, position]);

  // ==========================================
  // ADD / REMOVE SHORTLIST USING MONGODB
  // ==========================================

  const toggleShortlist = async (event, athlete) => {
    event.stopPropagation();

    const athleteId = String(athlete._id);

    if (shortlistLoading[athleteId]) return;

    const alreadyShortlisted = isShortlisted(athleteId);

    setShortlistLoading((previous) => ({
      ...previous,
      [athleteId]: true
    }));

    try {
      setError("");

      if (alreadyShortlisted) {
        // Remove this athlete from the scout's database shortlist.
        await axios.delete(
          `${API}/shortlist/${athleteId}`,
          getAuthConfig()
        );
      } else {
        // Add this Athlete profile ID to the database shortlist.
        await axios.post(
          `${API}/shortlist/${athleteId}`,
          {},
          getAuthConfig()
        );
      }

      // Fetch the authoritative shortlist from MongoDB.
      await fetchShortlist();
    } catch (err) {
      console.error(
        "Failed to update shortlist:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        "Unable to update shortlist. Please try again."
      );
    } finally {
      setShortlistLoading((previous) => ({
        ...previous,
        [athleteId]: false
      }));
    }
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setPosition("");
  };

  const hasFilters = Boolean(search || position);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="coach-athletes-page">
      <ScoutSidebar />

      <main className="coach-athletes-content">
        <div className="coach-athletes-container">

          {/* HEADER */}

          <div className="coach-athletes-header">
            <div>
              <span className="coach-athletes-eyebrow">
                ATHLETE DISCOVERY
              </span>

              <h1>Discover Athletes</h1>

              <p>
                Explore athletes in your registered sport
                and discover new talent.
              </p>

              {normalizedScoutSport && (
                <p>
                  Your sport:{" "}
                  <strong>
                    {scoutSport.charAt(0).toUpperCase() +
                      scoutSport.slice(1)}
                  </strong>
                </p>
              )}
            </div>

            {!loading && !error && !profileError && (
              <div className="coach-athletes-count">
                <span>{filteredAthletes.length}</span>

                <small>
                  {filteredAthletes.length === 1
                    ? "Athlete"
                    : "Athletes"}
                </small>
              </div>
            )}
          </div>

          {/* ERROR */}

          {error && (
            <div className="coach-athletes-error">
              {error}

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="back-btn"
              >
                Retry
              </button>
            </div>
          )}

          {/* LOADING */}

          {loading && (
            <div className="coach-athletes-loading">
              <div className="loading-spinner"></div>

              <h2>Discovering Athletes</h2>

              <p>
                Loading your profile and matching athletes.
              </p>
            </div>
          )}

          {/* CONTENT */}

          {!loading && !error && (
            <>
              {profileError ? (
                <div className="coach-athletes-error">
                  {profileError}

                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate("/scout/profile")}
                  >
                    Complete Scout Profile
                  </button>
                </div>
              ) : !normalizedScoutSport ? (
                <div className="coach-athletes-error">
                  Your sport is not configured in your
                  scout profile. Please update your profile.
                </div>
              ) : (
                <>
                  {/* TOOLBAR */}

                  <div className="coach-athletes-toolbar">
                    <div className="coach-athletes-sport">
                      <span>ATHLETES IN YOUR SPORT</span>
                      <strong>{sportAthletes.length}</strong>
                    </div>

                    <div className="coach-athletes-search">
                      <FiSearch size={18} />

                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search athletes..."
                      />

                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          className="clear-search"
                          aria-label="Clear search"
                        >
                          <FiX size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* FILTERS */}

                  <div className="dashboard-section">
                    <div className="form-grid">

                      <div className="form-group">
                        <label>Sport</label>

                        <input
                          type="text"
                          value={
                            scoutSport.charAt(0).toUpperCase() +
                            scoutSport.slice(1)
                          }
                          readOnly
                        />
                      </div>

                      <div className="form-group">
                        <label>Position</label>

                        <select
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                        >
                          <option value="">All Positions</option>

                          {positions.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Results</label>

                        <div>
                          {filteredAthletes.length} athletes found
                        </div>
                      </div>
                    </div>

                    {hasFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="back-btn"
                      >
                        <FiX size={16} />
                        Clear Filters
                      </button>
                    )}
                  </div>

                  {/* EMPTY STATE */}

                  {filteredAthletes.length === 0 && (
                    <div className="coach-athletes-empty">
                      <div className="empty-icon">
                        <FiUser size={30} />
                      </div>

                      <h2>No Athletes Found</h2>

                      <p>
                        {hasFilters
                          ? "Try changing your search or position filter."
                          : `No ${scoutSport} athletes are available yet.`}
                      </p>

                      {hasFilters && (
                        <button
                          type="button"
                          onClick={clearFilters}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  )}

                  {/* ATHLETE GRID */}

                  {filteredAthletes.length > 0 && (
                    <div className="coach-athletes-grid">
                      {filteredAthletes.map((athlete) => {
                        const profilePic = getProfilePic(athlete);
                        const skills = getSkills(athlete);
                        const shortlisted = isShortlisted(athlete._id);
                        const updating = Boolean(
                          shortlistLoading[String(athlete._id)]
                        );

                        return (
                          <div
                            key={athlete._id}
                            className="coach-athlete-card"
                            onClick={() =>
                              navigate(`/scout/athlete/${athlete._id}`)
                            }
                          >
                            <div className="athlete-card-top">
                              <div className="athlete-avatar">
                                {profilePic ? (
                                  <img
                                    src={profilePic}
                                    alt={getAthleteName(athlete)}
                                  />
                                ) : (
                                  <FiUser size={25} />
                                )}
                              </div>
                            </div>

                            <div className="athlete-card-info">
                              <h3>{getAthleteName(athlete)}</h3>

                              <p className="athlete-position">
                                {athlete.position || "Athlete"}
                              </p>
                            </div>

                            <div className="athlete-card-details">
                              <div className="athlete-detail">
                                <FiAward size={16} />

                                <span>
                                  {athlete.sport ||
                                    "Sport not available"}
                                </span>
                              </div>

                              <div className="athlete-detail">
                                <FiMapPin size={16} />

                                <span>{getLocation(athlete)}</span>
                              </div>
                            </div>

                            {skills.length > 0 && (
                              <div className="athlete-skills">
                                {skills.slice(0, 3).map(
                                  (skill, index) => (
                                    <span key={`${skill}-${index}`}>
                                      {skill}
                                    </span>
                                  )
                                )}

                                {skills.length > 3 && (
                                  <span>+{skills.length - 3}</span>
                                )}
                              </div>
                            )}

                            <div className="athlete-card-footer">
                              <span>View Profile</span>
                              <span className="arrow">→</span>
                            </div>

                            {/* SHORTLIST BUTTON */}

                            <button
                              type="button"
                              className={`shortlist-btn ${
                                shortlisted ? "shortlisted" : ""
                              }`}
                              disabled={updating}
                              aria-pressed={shortlisted}
                              onClick={(event) =>
                                toggleShortlist(event, athlete)
                              }
                            >
                              {updating
                                ? "Updating..."
                                : shortlisted
                                  ? "✓ Shortlisted"
                                  : "+ Shortlist"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScoutDiscover;
