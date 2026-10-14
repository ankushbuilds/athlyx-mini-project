
import { useEffect, useMemo, useState } from "react";
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

const API = "http://localhost:5000/api";

const ScoutDiscover = () => {
  const navigate = useNavigate();

  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("");
  const [position, setPosition] = useState("");

  // ==========================================
  // LOAD ALL ATHLETES
  // ==========================================

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth", {
        replace: true
      });

      return;
    }

    try {
      setLoading(true);
      setError("");

      // IMPORTANT:
      // Scout gets ALL athletes.
      // No sport matching here.

      const response = await axios.get(
        `${API}/athletes/get-all`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const allAthletes = Array.isArray(
        response.data?.athletes
      )
        ? response.data.athletes
        : [];

      setAthletes(allAthletes);
    } catch (error) {
      console.error(
        "Failed to load athletes:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/auth", {
          replace: true
        });

        return;
      }

      setError(
        error.response?.data?.message ||
        "Failed to load athletes."
      );
    } finally {
      setLoading(false);
    }
  };

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
  // PROFILE PIC
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
    if (
      typeof athlete?.address === "string"
    ) {
      return athlete.address;
    }

    const city =
      athlete?.address?.city || "";

    const state =
      athlete?.address?.state || "";

    const country =
      athlete?.address?.country || "";

    const parts = [
      city,
      state,
      country
    ].filter(Boolean);

    return parts.length > 0
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
  // AVAILABLE SPORTS
  // ==========================================

  const sports = useMemo(() => {
    return [
      ...new Set(
        athletes
          .map((athlete) => athlete?.sport)
          .filter(Boolean)
      )
    ];
  }, [athletes]);

  // ==========================================
  // AVAILABLE POSITIONS
  // ==========================================

  const positions = useMemo(() => {
    return [
      ...new Set(
        athletes
          .map((athlete) => athlete?.position)
          .filter(Boolean)
      )
    ];
  }, [athletes]);

  // ==========================================
  // FILTER ATHLETES
  // ==========================================

  const filteredAthletes = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return athletes.filter((athlete) => {
      const name =
        getAthleteName(athlete)
          .toLowerCase();

      const athleteSport =
        athlete?.sport
          ?.toLowerCase() || "";

      const athletePosition =
        athlete?.position
          ?.toLowerCase() || "";

      const location =
        getLocation(athlete)
          .toLowerCase();

      const skills =
        getSkills(athlete)
          .join(" ")
          .toLowerCase();

      // Search
      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        athleteSport.includes(searchValue) ||
        athletePosition.includes(searchValue) ||
        location.includes(searchValue) ||
        skills.includes(searchValue);

      // Sport filter
      const matchesSport =
        !sport ||
        athleteSport ===
          sport.toLowerCase();

      // Position filter
      const matchesPosition =
        !position ||
        athletePosition ===
          position.toLowerCase();

      return (
        matchesSearch &&
        matchesSport &&
        matchesPosition
      );
    });
  }, [
    athletes,
    search,
    sport,
    position
  ]);

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setSport("");
    setPosition("");
  };

  const hasFilters =
    search ||
    sport ||
    position;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="coach-athletes-page">

      <ScoutSidebar />

      <main className="coach-athletes-content">

        <div className="coach-athletes-container">

          {/* ======================================
              HEADER
          ====================================== */}

          <div className="coach-athletes-header">

            <div>

              <span className="coach-athletes-eyebrow">
                ATHLETE DISCOVERY
              </span>

              <h1>
                Discover Athletes
              </h1>

              <p>
                Explore athletes across
                different sports and
                discover new talent.
              </p>

            </div>

            {!loading &&
              !error && (
                <div className="coach-athletes-count">

                  <span>
                    {
                      filteredAthletes.length
                    }
                  </span>

                  <small>
                    {
                      filteredAthletes.length === 1
                        ? "Athlete"
                        : "Athletes"
                    }
                  </small>

                </div>
              )}

          </div>


          {/* ======================================
              ERROR
          ====================================== */}

          {error && (
            <div className="coach-athletes-error">
              {error}
            </div>
          )}


          {/* ======================================
              LOADING
          ====================================== */}

          {loading && (
            <div className="coach-athletes-loading">

              <div className="loading-spinner"></div>

              <h2>
                Discovering Athletes
              </h2>

              <p>
                Loading athletes from
                Athlyx.
              </p>

            </div>
          )}


          {/* ======================================
              CONTENT
          ====================================== */}

          {!loading &&
            !error && (
              <>

                {/* ======================================
                    TOOLBAR
                ====================================== */}

                <div className="coach-athletes-toolbar">

                  <div className="coach-athletes-sport">

                    <span>
                      ATHLETES AVAILABLE
                    </span>

                    <strong>
                      {athletes.length}
                    </strong>

                  </div>


                  <div className="coach-athletes-search">

                    <FiSearch size={18} />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                      placeholder="Search athletes..."
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearch("")
                        }
                        className="clear-search"
                      >
                        ×
                      </button>
                    )}

                  </div>

                </div>


                {/* ======================================
                    FILTERS
                ====================================== */}

                <div className="dashboard-section">

                  <div className="form-grid">

                    {/* SPORT */}

                    <div className="form-group">

                      <label>
                        Sport
                      </label>

                      <select
                        value={sport}
                        onChange={(e) =>
                          setSport(
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          All Sports
                        </option>

                        {sports.map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          )
                        )}

                      </select>

                    </div>


                    {/* POSITION */}

                    <div className="form-group">

                      <label>
                        Position
                      </label>

                      <select
                        value={position}
                        onChange={(e) =>
                          setPosition(
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          All Positions
                        </option>

                        {positions.map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          )
                        )}

                      </select>

                    </div>


                    {/* CLEAR */}

                    <div className="form-group">

                      <label>
                        Results
                      </label>

                      <div>
                        {filteredAthletes.length}{" "}
                        athletes found
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


                {/* ======================================
                    EMPTY
                ====================================== */}

                {filteredAthletes.length ===
                  0 && (
                  <div className="coach-athletes-empty">

                    <div className="empty-icon">
                      <FiUser size={30} />
                    </div>

                    <h2>
                      No Athletes Found
                    </h2>

                    <p>
                      {hasFilters
                        ? "Try changing your search or filters."
                        : "No athletes are available yet."}
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


                {/* ======================================
                    ATHLETE GRID
                ====================================== */}

                {filteredAthletes.length >
                  0 && (
                  <div className="coach-athletes-grid">

                    {filteredAthletes.map(
                      (athlete) => {

                        const profilePic =
                          getProfilePic(
                            athlete
                          );

                        const skills =
                          getSkills(
                            athlete
                          );

                        return (
                          <div
                            key={
                              athlete._id
                            }
                            className="coach-athlete-card"
                            onClick={() =>
                              navigate(
                                `/scout/athlete/${athlete._id}`
                              )
                            }
                          >

                            {/* ==================================
                                CARD TOP
                            ================================== */}

                            <div className="athlete-card-top">

                              <div className="athlete-avatar">

                                {profilePic ? (
                                  <img
                                    src={
                                      profilePic
                                    }
                                    alt={getAthleteName(
                                      athlete
                                    )}
                                  />
                                ) : (
                                  <FiUser
                                    size={25}
                                  />
                                )}

                              </div>

                            </div>


                            {/* ==================================
                                ATHLETE INFO
                            ================================== */}

                            <div className="athlete-card-info">

                              <h3>
                                {getAthleteName(
                                  athlete
                                )}
                              </h3>

                              <p className="athlete-position">
                                {
                                  athlete.position ||
                                  "Athlete"
                                }
                              </p>

                            </div>


                            {/* ==================================
                                DETAILS
                            ================================== */}

                            <div className="athlete-card-details">

                              <div className="athlete-detail">

                                <FiAward
                                  size={16}
                                />

                                <span>
                                  {
                                    athlete.sport ||
                                    "Sport not available"
                                  }
                                </span>

                              </div>


                              <div className="athlete-detail">

                                <FiMapPin
                                  size={16}
                                />

                                <span>
                                  {getLocation(
                                    athlete
                                  )}
                                </span>

                              </div>

                            </div>


                            {/* ==================================
                                SKILLS
                            ================================== */}

                            {skills.length >
                              0 && (
                              <div className="athlete-skills">

                                {skills
                                  .slice(
                                    0,
                                    3
                                  )
                                  .map(
                                    (
                                      skill,
                                      index
                                    ) => (
                                      <span
                                        key={`${skill}-${index}`}
                                      >
                                        {skill}
                                      </span>
                                    )
                                  )}

                                {skills.length >
                                  3 && (
                                  <span>
                                    +
                                    {
                                      skills.length -
                                      3
                                    }
                                  </span>
                                )}

                              </div>
                            )}


                            {/* ==================================
                                FOOTER
                            ================================== */}

                            <div className="athlete-card-footer">

                              <span>
                                View Profile
                              </span>

                              <span className="arrow">
                                →
                              </span>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

              </>
            )}

        </div>

      </main>

    </div>
  );
};

export default ScoutDiscover;
