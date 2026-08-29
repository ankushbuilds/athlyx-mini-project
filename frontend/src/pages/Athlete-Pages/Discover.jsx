
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
  // FETCH MATCHING COACHES
  // ==========================================

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/users/coaches",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setCoaches(response.data.coaches || []);
          setAthleteSport(response.data.sport || "");
        } else {
          setCoaches([]);
          setAthleteSport("");
        }
      } catch (err) {
        console.error("Error fetching coaches:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load coaches"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  // ==========================================
  // FILTER COACHES BY SEARCH
  // ==========================================

  const filteredCoaches = coaches.filter((coach) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return true;
    }

    return (
      coach.name?.toLowerCase().includes(searchText) ||
      coach.sport?.toLowerCase().includes(searchText) ||
      coach.specialization?.toLowerCase().includes(searchText) ||
      coach.organization?.toLowerCase().includes(searchText) ||
      coach.address?.city?.toLowerCase().includes(searchText) ||
      coach.address?.state?.toLowerCase().includes(searchText)
    );
  });

  const formattedSport = formatSport(athleteSport);

  // ==========================================
  // VIEW COACH PROFILE
  // ==========================================

  const handleViewProfile = (coachId) => {
    navigate(`/profile/coach/${coachId}`);
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
                Find coaches who match your sport and goals.
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
                placeholder="Search coaches, specialization or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>

          {/* ==========================================
              SECTION HEADING
          ========================================== */}

          <div className="discover-section-heading">

            <div>
              <h2>
                {formattedSport
                  ? `${formattedSport} Coaches`
                  : "Recommended Coaches"}
              </h2>

              <p>
                Coaches relevant to your sport and development.
              </p>
            </div>

            <span className="discover-result-count">
              {filteredCoaches.length}{" "}
              {filteredCoaches.length === 1
                ? "coach"
                : "coaches"}
            </span>

          </div>

          {/* ==========================================
              LOADING
          ========================================== */}

          {loading && (
            <div className="discover-empty">
              <FiUsers />

              <h3>Loading coaches...</h3>

              <p>
                Please wait while we find coaches for you.
              </p>
            </div>
          )}

          {/* ==========================================
              ERROR
          ========================================== */}

          {!loading && error && (
            <div className="discover-empty">
              <FiUsers />

              <h3>Unable to load coaches</h3>

              <p>{error}</p>
            </div>
          )}

          {/* ==========================================
              COACH CARDS
          ========================================== */}

          {!loading &&
            !error &&
            filteredCoaches.length > 0 && (
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
                        {formatSport(coach.sport) || "Coach"}
                      </span>

                    </div>

                    {/* CARD BODY */}

                    <div className="discover-card-body">

                      <h3>
                        {coach.name}
                      </h3>

                      <p className="discover-role">
                        {coach.specialization || "Coach"}
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
                        handleViewProfile(coach._id)
                      }
                    >
                      View Profile

                      <FiArrowRight />
                    </button>

                  </article>
                ))}

              </div>
            )}

          {/* ==========================================
              NO RESULTS
          ========================================== */}

          {!loading &&
            !error &&
            filteredCoaches.length === 0 && (

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

        </div>
      </main>
    </div>
  );
};

export default Discover;

