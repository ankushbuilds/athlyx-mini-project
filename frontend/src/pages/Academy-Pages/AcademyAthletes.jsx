import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiMapPin,
  FiAward,
  FiSearch,
  FiMessageCircle
} from "react-icons/fi";
import AcademySidebar from "../../components/AcademySidebar";

const API = "http://localhost:5000/api";

const AcademyAthletes = () => {
  const navigate = useNavigate();

  const [athletes, setAthletes] = useState([]);
  const [filteredAthletes, setFilteredAthletes] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD CONNECTED ATHLETES
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
  // LOAD CONNECTED ATHLETES
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
        `${API}/connections/academy/athletes`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const connectedAthletes =
        Array.isArray(response.data?.athletes)
          ? response.data.athletes
          : Array.isArray(response.data)
            ? response.data
            : [];

      setAthletes(connectedAthletes);
      setFilteredAthletes(connectedAthletes);

    } catch (error) {
      console.error(
        "Failed to load academy athletes:",
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
          "Failed to load connected athletes."
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
      athlete?.address?.city ||
      "";

    const state =
      athlete?.address?.state ||
      "";

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
  // VIEW PROFILE
  // ==========================================

  const handleViewProfile = (athlete) => {
    const athleteId =
      athlete?._id ||
      athlete?.athlete?._id;

    if (!athleteId) return;

    navigate(
      `/profile/athlete/${athleteId}`
    );
  };

  // ==========================================
  // OPEN MESSAGE
  // ==========================================

  const handleMessage = (e, athlete) => {
    e.stopPropagation();

    const userId =
      athlete?.user?._id ||
      athlete?.user ||
      athlete?._id;

    if (!userId) return;

    navigate(
      `/academy/messages?user=${userId}`
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="coach-athletes-page">

      <AcademySidebar />

      <main className="coach-athletes-content">

        <div className="coach-athletes-container">

          {/* ======================================
              HEADER
          ====================================== */}

          <div className="coach-athletes-header">

            <div>

              <span className="coach-athletes-eyebrow">
                MY ATHLETES
              </span>

              <h1>
                My Athletes
              </h1>

              <p>
                Manage and connect with athletes
                associated with your academy.
              </p>

            </div>

            {!loading &&
              !error && (
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
                Loading Athletes
              </h2>

              <p>
                Fetching your connected athletes.
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
                      CONNECTED ATHLETES
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
                      {search
                        ? "No Athletes Found"
                        : "No Connected Athletes"}
                    </h2>

                    <p>
                      {search
                        ? "Try searching with a different name, position, location or skill."
                        : "Athletes you connect with will appear here."}
                    </p>

                    {search ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSearch("")
                        }
                      >
                        Clear Search
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/academy/discover")
                        }
                      >
                        Discover Athletes
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
                          getProfilePic(athlete);

                        const skills =
                          getSkills(athlete);

                        return (
                          <div
                            key={
                              athlete._id ||
                              athlete?.user?._id
                            }
                            className="coach-athlete-card"
                            onClick={() =>
                              handleViewProfile(
                                athlete
                              )
                            }
                          >

                            {/* CARD TOP */}

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
                                  <FiUser size={25} />
                                )}

                              </div>

                              <div className="athlete-card-status connected">

                                <span></span>

                                Connected

                              </div>

                            </div>

                            {/* ATHLETE INFO */}

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

                            {/* DETAILS */}

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

                            {/* SKILLS */}

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
                                    {skills.length - 3}
                                  </span>
                                )}

                              </div>
                            )}

                            {/* FOOTER */}

                            <div className="athlete-card-footer">

                              <span>
                                View Profile
                              </span>

                              <button
                                type="button"
                                onClick={(e) =>
                                  handleMessage(
                                    e,
                                    athlete
                                  )
                                }
                                title="Message athlete"
                              >
                                <FiMessageCircle
                                  size={17}
                                />
                              </button>

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

export default AcademyAthletes;