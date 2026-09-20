import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiSearch,
  FiMapPin,
  FiUsers,
  FiArrowRight
} from "react-icons/fi";
import AthleteSidebar from "../../components/AthleteSidebar";

const Discover = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [coaches, setCoaches] = useState([]);
  const [academies, setAcademies] = useState([]);

  const [athleteSport, setAthleteSport] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FORMAT SPORT NAME
  // ==========================================

  const formatSport = (sport) => {
    if (!sport) return "";

    return sport
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // ==========================================
  // FETCH COACHES + ACADEMIES
  // ==========================================

  useEffect(() => {
    const fetchDiscoverData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const [coachResponse, academyResponse] =
          await Promise.all([
            axios.get(
              "http://localhost:5000/api/users/coaches",
              config
            ),

            axios.get(
              "http://localhost:5000/api/academies/all",
              config
            )
          ]);

        // ==========================================
        // COACHES
        // ==========================================

        if (coachResponse.data.success) {
          setCoaches(coachResponse.data.coaches || []);
          setAthleteSport(coachResponse.data.sport || "");
        } else {
          setCoaches([]);
          setAthleteSport("");
        }

        // ==========================================
        // ACADEMIES
        // ==========================================

        if (academyResponse.data.success) {
          setAcademies(
            academyResponse.data.academies || []
          );
        } else {
          setAcademies([]);
        }
      } catch (err) {
        console.error(
          "Error fetching discover data:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load coaches and academies"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDiscoverData();
  }, []);

  // ==========================================
  // FILTER COACHES
  // ==========================================

  const filteredCoaches = coaches.filter((coach) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return true;
    }

    return (
      coach.name
        ?.toLowerCase()
        .includes(searchText) ||
      coach.sport
        ?.toLowerCase()
        .includes(searchText) ||
      coach.specialization
        ?.toLowerCase()
        .includes(searchText) ||
      coach.organization
        ?.toLowerCase()
        .includes(searchText) ||
      coach.address?.city
        ?.toLowerCase()
        .includes(searchText) ||
      coach.address?.state
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // ==========================================
  // FILTER ACADEMIES
  // ==========================================

  const filteredAcademies = academies.filter(
    (academy) => {
      const searchText = search.trim().toLowerCase();

      if (!searchText) {
        return true;
      }

      return (
        academy.academyName
          ?.toLowerCase()
          .includes(searchText) ||
        academy.sport
          ?.toLowerCase()
          .includes(searchText) ||
        academy.specialization
          ?.toLowerCase()
          .includes(searchText) ||
        academy.city
          ?.toLowerCase()
          .includes(searchText) ||
        academy.state
          ?.toLowerCase()
          .includes(searchText) ||
        academy.address
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  const formattedSport = formatSport(athleteSport);

  // ==========================================
  // VIEW COACH PROFILE
  // ==========================================

  const handleViewCoachProfile = (coachId) => {
    navigate(`/profile/coach/${coachId}`);
  };

  // ==========================================
  // VIEW ACADEMY PROFILE
  // ==========================================

  const handleViewAcademyProfile = (academyId) => {
    navigate(`/profile/academy/${academyId}`);
  };

  return (
    <div className="dashboard-layout">
      <AthleteSidebar />

      <main className="discover-page">
        <div className="discover-content">

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="discover-header">
            <div>
              <span className="page-eyebrow">
                CONNECT • EXPLORE • GROW
              </span>

              <h1>Discover</h1>

              <p>
                Find coaches and academies that match
                your sport and goals.
              </p>
            </div>
          </div>

          {/* ==========================================
              SEARCH
          ========================================== */}

          <div className="discover-toolbar">
            <div className="discover-search">
              <FiSearch />

              <input
                type="text"
                placeholder="Search coaches, academies, specialization or location..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>
          </div>

          {/* ==========================================
              LOADING
          ========================================== */}

          {loading && (
            <div className="discover-empty">
              <FiUsers />

              <h3>
                Loading coaches and academies...
              </h3>

              <p>
                Please wait while we find opportunities
                for you.
              </p>
            </div>
          )}

          {/* ==========================================
              ERROR
          ========================================== */}

          {!loading && error && (
            <div className="discover-empty">
              <FiUsers />

              <h3>
                Unable to load discover data
              </h3>

              <p>{error}</p>
            </div>
          )}

          {/* ==========================================
              CONTENT
          ========================================== */}

          {!loading && !error && (
            <>
              {/* ==========================================
                  COACHES SECTION
              ========================================== */}

              <div className="discover-section-heading">
                <div>
                  <h2>
                    {formattedSport
                      ? `${formattedSport} Coaches`
                      : "Recommended Coaches"}
                  </h2>

                  <p>
                    Coaches relevant to your sport
                    and development.
                  </p>
                </div>

                <span className="discover-result-count">
                  {filteredCoaches.length}{" "}
                  {filteredCoaches.length === 1
                    ? "coach"
                    : "coaches"}
                </span>
              </div>

              {filteredCoaches.length > 0 ? (
                <div className="discover-grid">

                  {filteredCoaches.map((coach) => (
                    <article
                      className="discover-card"
                      key={coach._id}
                    >

                      {/* CARD TOP */}

                      <div className="discover-card-top">

                        <div className="discover-avatar">
                          {coach.profilePic ? (
                            <img
                              src={coach.profilePic}
                              alt={coach.name}
                            />
                          ) : (
                            coach.name
                              ?.charAt(0)
                              .toUpperCase()
                          )}
                        </div>

                        <span className="discover-sport">
                          {formatSport(
                            coach.sport
                          ) || "Coach"}
                        </span>

                      </div>

                      {/* CARD BODY */}

                      <div className="discover-card-body">

                        <h3>
                          {coach.name}
                        </h3>

                        <p className="discover-role">
                          {coach.specialization ||
                            "Coach"}
                        </p>

                        {coach.address?.city && (
                          <div className="discover-location">
                            <FiMapPin />

                            <span>
                              {coach.address.city}

                              {coach.address.state
                                ? `, ${coach.address.state}`
                                : ""}
                            </span>
                          </div>
                        )}

                      </div>

                      {/* VIEW PROFILE */}

                      <button
                        type="button"
                        className="discover-card-btn"
                        onClick={() =>
                          handleViewCoachProfile(
                            coach._id
                          )
                        }
                      >
                        View Profile

                        <FiArrowRight />
                      </button>

                    </article>
                  ))}

                </div>
              ) : (
                <div className="discover-empty">
                  <FiUsers />

                  <h3>
                    {search
                      ? "No coaches found"
                      : formattedSport
                      ? `No ${formattedSport} coaches found`
                      : "No coaches available"}
                  </h3>

                  <p>
                    {search
                      ? "Try changing your search."
                      : formattedSport
                      ? `There are currently no ${formattedSport} coaches available on Athlyx.`
                      : "Please complete your athlete profile to discover relevant coaches."}
                  </p>
                </div>
              )}

              {/* ==========================================
                  ACADEMIES SECTION
              ========================================== */}

              <div className="discover-section-heading">
                <div>
                  <h2>
                    {formattedSport
                      ? `${formattedSport} Academies`
                      : "Recommended Academies"}
                  </h2>

                  <p>
                    Explore academies offering training
                    and development opportunities.
                  </p>
                </div>

                <span className="discover-result-count">
                  {filteredAcademies.length}{" "}
                  {filteredAcademies.length === 1
                    ? "academy"
                    : "academies"}
                </span>
              </div>

              {filteredAcademies.length > 0 ? (
                <div className="discover-grid">

                  {filteredAcademies.map((academy) => (
                    <article
                      className="discover-card"
                      key={academy._id}
                    >

                      {/* CARD TOP */}

                      <div className="discover-card-top">

                        <div className="discover-avatar">
                          {academy.profilePic ? (
                            <img
                              src={academy.profilePic}
                              alt={academy.academyName}
                            />
                          ) : (
                            academy.academyName
                              ?.charAt(0)
                              .toUpperCase()
                          )}
                        </div>

                        <span className="discover-sport">
                          {formatSport(
                            academy.sport
                          ) || "Academy"}
                        </span>

                      </div>

                      {/* CARD BODY */}

                      <div className="discover-card-body">

                        <h3>
                          {academy.academyName}
                        </h3>

                        <p className="discover-role">
                          {academy.specialization ||
                            "Sports Academy"}
                        </p>

                        {academy.city && (
                          <div className="discover-location">
                            <FiMapPin />

                            <span>
                              {academy.city}

                              {academy.state
                                ? `, ${academy.state}`
                                : ""}
                            </span>
                          </div>
                        )}

                      </div>

                      {/* VIEW PROFILE */}

                      <button
                        type="button"
                        className="discover-card-btn"
                        onClick={() =>
                          handleViewAcademyProfile(
                            academy._id
                          )
                        }
                      >
                        View Profile

                        <FiArrowRight />
                      </button>

                    </article>
                  ))}

                </div>
              ) : (
                <div className="discover-empty">
                  <FiUsers />

                  <h3>
                    {search
                      ? "No academies found"
                      : formattedSport
                      ? `No ${formattedSport} academies found`
                      : "No academies available"}
                  </h3>

                  <p>
                    {search
                      ? "Try changing your search."
                      : formattedSport
                      ? `There are currently no ${formattedSport} academies available on Athlyx.`
                      : "No academies are currently available on Athlyx."}
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default Discover;