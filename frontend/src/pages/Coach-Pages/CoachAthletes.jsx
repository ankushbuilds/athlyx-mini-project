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

const CoachAthletes = () => {
  const navigate = useNavigate();

  const [athletes, setAthletes] = useState([]);
  const [filteredAthletes, setFilteredAthletes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMyAthletes();
  }, []);

  useEffect(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      setFilteredAthletes(athletes);
      return;
    }

    const filtered = athletes.filter((athlete) => {
      const name =
        athlete?.name ||
        athlete?.user?.name ||
        "";

      const sport =
        athlete?.sport ||
        athlete?.profile?.sport ||
        "";

      const position =
        athlete?.position ||
        athlete?.profile?.position ||
        "";

      const city =
        athlete?.address?.city ||
        athlete?.profile?.address?.city ||
        "";

      const state =
        athlete?.address?.state ||
        athlete?.profile?.address?.state ||
        "";

      const skills = Array.isArray(athlete?.skills)
        ? athlete.skills.join(" ")
        : Array.isArray(athlete?.profile?.skills)
        ? athlete.profile.skills.join(" ")
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

  const loadMyAthletes = async () => {
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
        `${API}/connections/coach/athletes`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const myAthletes = Array.isArray(
        response.data?.athletes
      )
        ? response.data.athletes
        : [];

      setAthletes(myAthletes);
      setFilteredAthletes(myAthletes);
    } catch (error) {
      console.error(
        "Failed to load my athletes:",
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
          "Failed to load your athletes."
      );
    } finally {
      setLoading(false);
    }
  };

  const getAthleteName = (athlete) => {
    return (
      athlete?.name ||
      athlete?.user?.name ||
      "Athlete"
    );
  };

  const getProfilePic = (athlete) => {
    return (
      athlete?.profilePic ||
      athlete?.user?.profilePic ||
      ""
    );
  };

  const getSport = (athlete) => {
    return (
      athlete?.sport ||
      athlete?.profile?.sport ||
      "Sport not available"
    );
  };

  const getPosition = (athlete) => {
    return (
      athlete?.position ||
      athlete?.profile?.position ||
      "Athlete"
    );
  };

  const getLocation = (athlete) => {
    const city =
      athlete?.address?.city ||
      athlete?.profile?.address?.city ||
      "";

    const state =
      athlete?.address?.state ||
      athlete?.profile?.address?.state ||
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

  const getSkills = (athlete) => {
    if (Array.isArray(athlete?.skills)) {
      return athlete.skills;
    }

    if (Array.isArray(athlete?.profile?.skills)) {
      return athlete.profile.skills;
    }

    return [];
  };

  const handleAthleteClick = (athlete) => {
    const athleteId =
      athlete?._id ||
      athlete?.user?._id;

    if (!athleteId) {
      return;
    }

    navigate(`/coach/athletes/${athleteId}`);
  };

  return (
    <div className="coach-athletes-page">
      <CoachSidebar />

      <main className="coach-athletes-content">
        <div className="coach-athletes-container">

          <div className="coach-athletes-header">
            <div>
              <span className="coach-athletes-eyebrow">
                ATHLETE MANAGEMENT
              </span>

              <h1>My Athletes</h1>

              <p>
                Manage athletes you are connected
                with.
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
                Loading My Athletes
              </h2>

              <p>
                Please wait while we load
                your connected athletes.
              </p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="coach-athletes-toolbar">
                <div className="coach-athletes-sport">
                  <span>
                    MY ATHLETES
                  </span>

                  <strong>
                    Connected Athletes
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
                    {search
                      ? "No Athletes Found"
                      : "No Connected Athletes"}
                  </h2>

                  <p>
                    {search
                      ? "Try searching with a different name, position, location or skill."
                      : "You do not have any connected athletes yet."}
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
                            handleAthleteClick(
                              athlete
                            )
                          }
                        >

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

                            <div className="athlete-card-status">
                              <span></span>
                              Connected
                            </div>
                          </div>

                          <div className="athlete-card-info">
                            <h3>
                              {getAthleteName(
                                athlete
                              )}
                            </h3>

                            <p className="athlete-position">
                              {getPosition(
                                athlete
                              )}
                            </p>
                          </div>

                          <div className="athlete-card-details">

                            <div className="athlete-detail">
                              <FiAward
                                size={16}
                              />

                              <span>
                                {getSport(
                                  athlete
                                )}
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

export default CoachAthletes;