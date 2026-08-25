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

const CoachDiscover = () => {
  const navigate = useNavigate();

  const [athletes, setAthletes] = useState([]);
  const [filteredAthletes, setFilteredAthletes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAthletes();
  }, []);

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
        "http://localhost:5000/api/athletes/get-all",
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

  const getAthleteName = (athlete) => {
    return (
      athlete?.user?.name ||
      athlete?.name ||
      "Athlete"
    );
  };

  const getProfilePic = (athlete) => {
    return (
      athlete?.user?.profilePic ||
      athlete?.profilePic ||
      ""
    );
  };

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

  const getSkills = (athlete) => {
    return Array.isArray(athlete?.skills)
      ? athlete.skills
      : [];
  };

  return (
    <div className="coach-athletes-page">
      <CoachSidebar />

      <main className="coach-athletes-content">
        <div className="coach-athletes-container">

          <div className="coach-athletes-header">
            <div>
              <span className="coach-athletes-eyebrow">
                ATHLETE DISCOVERY
              </span>

              <h1>Discover Athletes</h1>

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

          {error && (
            <div className="coach-athletes-error">
              {error}
            </div>
          )}

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

          {!loading && !error && (
            <>
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

                      return (
                        <div
                          key={athlete._id}
                          className="coach-athlete-card"
                          onClick={() =>
                            navigate(`/profile/athlete/${athlete._id}`)
                          }
                        >
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

                            <div className="athlete-card-status">
                              <span></span>
                              Available
                            </div>
                          </div>

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

                              {skills.length >
                                3 && (
                                  <span>
                                    +
                                    {skills.length -
                                      3}
                                  </span>
                                )}
                            </div>
                          )}

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