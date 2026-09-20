import { useEffect, useState } from "react";
import axios from "axios";

import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiArrowRight,
  FiClock,
  FiCheck,
  FiLoader
} from "react-icons/fi";

import AthleteSidebar from "../../components/AthleteSidebar";

const API = "http://localhost:5000/api";

const Opportunities = () => {
  // ======================================================
  // STATES
  // ======================================================

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const [opportunities, setOpportunities] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState({});

  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  const [error, setError] = useState("");

  // ======================================================
  // GET TOKEN
  // ======================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ======================================================
  // FETCH OPPORTUNITIES
  // ======================================================

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login to view opportunities.");
        return;
      }

      const response = await axios.get(`${API}/opportunities`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const events = response.data?.opportunities || [];

      setOpportunities(events);
    } catch (err) {
      console.error("Fetch Opportunities Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load opportunities."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // FETCH MY APPLICATIONS
  // ======================================================

  const fetchMyApplications = async () => {
    try {
      const token = getToken();

      if (!token) {
        return;
      }

      const response = await axios.get(
        `${API}/opportunities/applications/mine`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const applications =
        response.data?.applications || [];

      const statusMap = {};

      applications.forEach((application) => {
        const opportunityId =
          application.opportunity?._id ||
          application.opportunity;

        if (opportunityId) {
          statusMap[opportunityId] =
            application.status;
        }
      });

      setApplicationStatus(statusMap);
    } catch (err) {
      console.error(
        "Fetch My Applications Error:",
        err
      );
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    fetchOpportunities();
    fetchMyApplications();
  }, []);

  // ======================================================
  // APPLY TO OPPORTUNITY
  // ======================================================

  const handleApply = async (eventId) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      setApplyingId(eventId);

      const response = await axios.post(
        `${API}/opportunities/${eventId}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const application =
        response.data?.application;

      setApplicationStatus((prev) => ({
        ...prev,
        [eventId]:
          application?.status || "pending"
      }));

      alert(
        response.data?.message ||
          "Application submitted successfully."
      );
    } catch (err) {
      console.error("Apply Error:", err);

      // Backend says already applied
      if (err.response?.status === 409) {
        setApplicationStatus((prev) => ({
          ...prev,
          [eventId]: "pending"
        }));
      }

      alert(
        err.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setApplyingId(null);
    }
  };

  // ======================================================
  // FILTER OPPORTUNITIES
  // ======================================================

  const filteredOpportunities =
    opportunities.filter((item) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        item.title
          ?.toLowerCase()
          .includes(searchText) ||
        item.sport
          ?.toLowerCase()
          .includes(searchText) ||
        item.location
          ?.toLowerCase()
          .includes(searchText) ||
        item.academy?.name
          ?.toLowerCase()
          .includes(searchText);

      const matchesType =
        type === "All" ||
        item.type === type;

      return (
        matchesSearch &&
        matchesType
      );
    });

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  // ======================================================
  // APPLICATION BUTTON
  // ======================================================

  const renderApplicationButton = (event) => {
    const status =
      applicationStatus[event._id];

    const isApplying =
      applyingId === event._id;

    // --------------------------------------------------
    // ACCEPTED
    // --------------------------------------------------

    if (status === "accepted") {
      return (
        <button
          className="athlyx-op-btn athlyx-op-btn-applied"
          disabled
        >
          <FiCheck size={16} />
          Accepted
        </button>
      );
    }

    // --------------------------------------------------
    // REJECTED
    // --------------------------------------------------

    if (status === "rejected") {
      return (
        <button
          className="athlyx-op-btn athlyx-op-btn-rejected"
          disabled
        >
          Application Rejected
        </button>
      );
    }

    // --------------------------------------------------
    // PENDING
    // --------------------------------------------------

    if (status === "pending") {
      return (
        <button
          className="athlyx-op-btn athlyx-op-btn-applied"
          disabled
        >
          <FiCheck size={16} />
          Applied
        </button>
      );
    }

    // --------------------------------------------------
    // APPLY
    // --------------------------------------------------

    return (
      <button
        className="athlyx-op-btn"
        onClick={() =>
          handleApply(event._id)
        }
        disabled={isApplying}
      >
        {isApplying ? (
          <>
            <FiLoader
              size={16}
              className="athlyx-op-loading-icon"
            />
            Applying...
          </>
        ) : (
          <>
            Apply
            <FiArrowRight size={16} />
          </>
        )}
      </button>
    );
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="athlyx-op-page">

      {/* EXISTING SIDEBAR - NOT MODIFIED */}
      <AthleteSidebar />

      <main className="athlyx-op-main">

        <div className="athlyx-op-content">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="athlyx-op-header">

            <div>

              <span className="athlyx-op-eyebrow">
                ATHLETE OPPORTUNITIES
              </span>

              <h1>
                Find Your Next Opportunity
              </h1>

              <p>
                Discover tournaments, trials,
                camps and programs created by
                academies.
              </p>

            </div>

          </header>

          {/* ==================================================
              FILTERS
          ================================================== */}

          <section className="athlyx-op-filters">

            {/* SEARCH */}

            <div className="athlyx-op-search">

              <FiSearch size={18} />

              <input
                type="text"
                placeholder="Search opportunities..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* TYPE FILTER */}

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="athlyx-op-type-filter"
            >
              <option value="All">
                All Types
              </option>

              <option value="Tournament">
                Tournament
              </option>

              <option value="Trials">
                Trials
              </option>

              <option value="Competition">
                Competition
              </option>

              <option value="Camp">
                Camp
              </option>

              <option value="Program">
                Program
              </option>

              <option value="Talent Hunt">
                Talent Hunt
              </option>

              <option value="Other">
                Other
              </option>
            </select>

          </section>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="athlyx-op-error">

              <span>
                {error}
              </span>

              <button
                onClick={() => {
                  fetchOpportunities();
                  fetchMyApplications();
                }}
              >
                Try Again
              </button>

            </div>
          )}

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="athlyx-op-loading">

              <FiLoader
                size={24}
                className="athlyx-op-loading-icon"
              />

              <p>
                Loading opportunities...
              </p>

            </div>

          ) : filteredOpportunities.length === 0 ? (

            /* ==================================================
               EMPTY
            ================================================== */

            <div className="athlyx-op-empty">

              <FiBriefcase size={32} />

              <h3>
                No opportunities found
              </h3>

              <p>
                {search || type !== "All"
                  ? "Try changing your search or filters."
                  : "There are no active opportunities available right now."}
              </p>

            </div>

          ) : (

            /* ==================================================
               OPPORTUNITY GRID
            ================================================== */

            <section className="athlyx-op-grid">

              {filteredOpportunities.map(
                (event) => (

                  <article
                    className="athlyx-op-card"
                    key={event._id}
                  >

                    {/* ------------------------------------------
                        CARD TOP
                    ------------------------------------------ */}

                    <div className="athlyx-op-card-top">

                      <span className="athlyx-op-type">
                        {event.type}
                      </span>

                      <span className="athlyx-op-sport">
                        {event.sport}
                      </span>

                    </div>

                    {/* ------------------------------------------
                        TITLE
                    ------------------------------------------ */}

                    <h2 className="athlyx-op-title">
                      {event.title}
                    </h2>

                    {/* ------------------------------------------
                        ACADEMY
                    ------------------------------------------ */}

                    <div className="athlyx-op-organization">

                      <FiBriefcase size={16} />

                      <span>
                        {event.academy?.name ||
                          "Academy"}
                      </span>

                    </div>

                    {/* ------------------------------------------
                        LOCATION + DATE
                    ------------------------------------------ */}

                    <div className="athlyx-op-meta">

                      <div>

                        <FiMapPin size={16} />

                        <span>
                          {event.location ||
                            "Location not available"}
                        </span>

                      </div>

                      <div>

                        <FiCalendar size={16} />

                        <span>
                          {formatDate(event.date)}
                        </span>

                      </div>

                    </div>

                    {/* ------------------------------------------
                        REGISTRATION DEADLINE
                    ------------------------------------------ */}

                    <div className="athlyx-op-deadline">

                      <FiClock size={15} />

                      <span>
                        Registration closes{" "}

                        <strong>
                          {formatDate(
                            event.registrationDeadline
                          )}
                        </strong>
                      </span>

                    </div>

                    {/* ------------------------------------------
                        DESCRIPTION
                    ------------------------------------------ */}

                    <p className="athlyx-op-description">
                      {event.description ||
                        "No description available."}
                    </p>

                    {/* ------------------------------------------
                        ELIGIBILITY
                    ------------------------------------------ */}

                    {event.eligibility && (
                      <div className="athlyx-op-eligibility">

                        <strong>
                          Eligibility:
                        </strong>

                        <span>
                          {event.eligibility}
                        </span>

                      </div>
                    )}

                    {/* ------------------------------------------
                        ACTION
                    ------------------------------------------ */}

                    <div className="athlyx-op-action">

                      {renderApplicationButton(
                        event
                      )}

                    </div>

                  </article>

                )
              )}

            </section>

          )}

        </div>

      </main>

    </div>
  );
};

export default Opportunities;