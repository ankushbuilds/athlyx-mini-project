import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiMapPin,
  FiAward,
  FiSearch
} from "react-icons/fi";
import CoachSidebar from "../../components/CoachSidebar";

const API = "http://localhost:5000/api";

const CoachDiscover = () => {
  const navigate = useNavigate();

  const [athletes, setAthletes] = useState([]);
  const [filteredAthletes, setFilteredAthletes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // CONNECTION STATUS
  // ==========================================

  const [connectionStatuses, setConnectionStatuses] = useState({});

  // ==========================================
  // LOAD ATHLETES
  // ==========================================

  useEffect(() => {
    loadAthletes();
  }, []);

  // ==========================================
  // FILTER ATHLETES
  // ==========================================

  useEffect(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      setFilteredAthletes(athletes);
      return;
    }

    const filtered = athletes.filter((athlete) => {
      const name =
        athlete?.user?.name ||
        athlete?.name ||
        "";

      const sport =
        athlete?.sport ||
        "";

      const position =
        athlete?.position ||
        "";

      const city =
        athlete?.address?.city ||
        "";

      const state =
        athlete?.address?.state ||
        "";

      const skills = Array.isArray(athlete?.skills)
        ? athlete.skills.join(" ")
        : "";

      const searchableText = `
        ${name}
        ${sport}
        ${position}
        ${city}
        ${state}
        ${skills}
      `.toLowerCase();

      return searchableText.includes(searchValue);
    });

    setFilteredAthletes(filtered);
  }, [search, athletes]);

  // ==========================================
  // LOAD ATHLETES
  // ==========================================

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
      setFilteredAthletes(allAthletes);

      // ==========================================
      // FETCH CONNECTION STATUS FOR EACH ATHLETE
      // ==========================================

      const statusResults = await Promise.all(
        allAthletes.map(async (athlete) => {
          try {
            const statusResponse = await axios.get(
              `${API}/connections/status/${athlete._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            return {
              athleteId: athlete._id,
              status:
                statusResponse.data?.status || "none"
            };
          } catch (statusError) {
            console.error(
              `Failed to get connection status for athlete ${athlete._id}:`,
              statusError
            );

            return {
              athleteId: athlete._id,
              status: "none"
            };
          }
        })
      );

      const statusMap = {};

      statusResults.forEach(
        ({ athleteId, status }) => {
          statusMap[athleteId] = status;
        }
      );

      setConnectionStatuses(statusMap);
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
    const city =
      athlete?.address?.city || "";

    const state =
      athlete?.address?.state || "";

    if (city && state) {
      return `${city}, ${state}`;
    }

    return (
      city ||
      state ||
      "Location not available"
    );
  };

  // ==========================================
  // SKILLS
  // ==========================================

  const getSkills = (athlete) => {
    return Array.isArray(athlete?.skills)
      ? athlete.skills
      : [];
  };

  // ==========================================
  // CONNECTION STATUS TEXT
  // ==========================================

  const getConnectionStatus = (athlete) => {
    const status =
      connectionStatuses[athlete._id];

    if (status === "accepted") {
      return "Connected";
    }

    if (status === "pending") {
      return "Pending";
    }

    return "Available";
  };

  // ==========================================
  // CONNECTION STATUS CLASS
  // ==========================================

  const getConnectionStatusClass = (athlete) => {
    const status =
      connectionStatuses[athlete._id];

    if (status === "accepted") {
      return "connected";
    }

    if (status === "pending") {
      return "pending";
    }

    return "available";
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="coach-athletes-page">

      <CoachSidebar />

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
                Explore athletes and discover
                talent across different sports.
              </p>

            </div>

            {!loading && !error && (
              <div className="coach-athletes-count">

                <span>
                  {filteredAthletes.length}
                </span>

                <small>
                  {filteredAthletes.length === 1
                    ? "Athlete"
                    : "Athletes"}
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
                Please wait while we load
                available athletes.
              </p>

            </div>
          )}

          {/* ======================================
              CONTENT
          ====================================== */}

          {!loading && !error && (
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
                    All Sports
                  </strong>

                </div>

                <div className="coach-athletes-search">

                  <FiSearch size={18} />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
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
                  EMPTY
              ====================================== */}

              {filteredAthletes.length === 0 && (
                <div className="coach-athletes-empty">

                  <div className="empty-icon">
                    <FiUser size={30} />
                  </div>

                  <h2>
                    No Athletes Found
                  </h2>

                  <p>
                    Try searching with a
                    different name, sport,
                    position, location or skill.
                  </p>

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                    >
                      Clear Search
                    </button>
                  )}

                </div>
              )}

              {/* ======================================
                  ATHLETE GRID
              ====================================== */}

              {filteredAthletes.length > 0 && (
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

                      const connectionStatus =
                        getConnectionStatus(
                          athlete
                        );

                      const connectionClass =
                        getConnectionStatusClass(
                          athlete
                        );

                      return (
                        <div
                          key={athlete._id}
                          className="coach-athlete-card"
                          onClick={() =>
                            navigate(
                              `/profile/athlete/${athlete._id}`
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
                                  src={profilePic}
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

                            {/* CONNECTION STATUS */}

                            <div
                              className={`athlete-card-status ${connectionClass}`}
                            >

                              <span></span>

                              {connectionStatus}

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
                              {athlete.position ||
                                "Athlete"}
                            </p>

                          </div>

                          {/* ==================================
                              DETAILS
                          ================================== */}

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

                          {skills.length > 0 && (
                            <div className="athlete-skills">

                              {skills
                                .slice(0, 3)
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

                              {skills.length > 3 && (
                                <span>
                                  +
                                  {skills.length -
                                    3}
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

export default CoachDiscover;