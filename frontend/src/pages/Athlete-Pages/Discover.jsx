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
  const [category, setCategory] = useState("All");

  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH COACHES
  // ==========================================

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/users/coaches"
        );

        if (response.data.success) {
          setCoaches(response.data.coaches || []);
        } else {
          setCoaches([]);
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
  // FILTER COACHES
  // ==========================================

  const filteredPeople = coaches.filter((coach) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      coach.name?.toLowerCase().includes(searchText) ||
      coach.sport?.toLowerCase().includes(searchText) ||
      coach.specialization?.toLowerCase().includes(searchText) ||
      coach.organization?.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      coach.sport === category;

    return matchesSearch && matchesCategory;
  });

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

          <div className="discover-header">
            <div>
              <span className="page-eyebrow">
                CONNECT • EXPLORE • GROW
              </span>

              <h1>Discover</h1>

              <p>
                Find coaches, athletes and academies that match your goals.
              </p>
            </div>
          </div>

          <div className="discover-toolbar">

            <div className="discover-search">
              <FiSearch />

              <input
                type="text"
                placeholder="Search people, sports or roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="discover-filter"
            >
              <option value="All">All Sports</option>
              <option value="Cricket">Cricket</option>
              <option value="Football">Football</option>
              <option value="Athletics">Athletics</option>
              <option value="Basketball">Basketball</option>
              <option value="Hockey">Hockey</option>
            </select>

          </div>

          <div className="discover-section-heading">
            <div>
              <h2>Recommended for you</h2>

              <p>
                People and professionals you may want to connect with.
              </p>
            </div>

            <span className="discover-result-count">
              {filteredPeople.length} results
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
            filteredPeople.length > 0 && (
              <div className="discover-grid">

                {filteredPeople.map((coach) => (
                  <article
                    className="discover-card"
                    key={coach._id}
                  >

                    <div className="discover-card-top">

                      <div className="discover-avatar">
                        {coach.profilePic ? (
                          <img
                            src={coach.profilePic}
                            alt={coach.name}
                          />
                        ) : (
                          coach.name?.charAt(0).toUpperCase()
                        )}
                      </div>

                      <span className="discover-sport">
                        {coach.sport || "Coach"}
                      </span>

                    </div>

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

                    <button
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
            filteredPeople.length === 0 && (
              <div className="discover-empty">
                <FiUsers />

                <h3>No results found</h3>

                <p>
                  Try changing your search or filter.
                </p>
              </div>
            )}

        </div>
      </main>
    </div>
  );
};

export default Discover;