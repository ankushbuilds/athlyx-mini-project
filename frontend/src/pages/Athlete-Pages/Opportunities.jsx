
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
  FiLoader,
  FiUpload,
  FiX,
  FiFileText
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

  const [athleteProfile, setAthleteProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);

  const [error, setError] = useState("");

  // ======================================================
  // APPLY MODAL STATES
  // ======================================================

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState(null);

  const [resumeFile, setResumeFile] = useState(null);

  // ======================================================
  // GET TOKEN
  // ======================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ======================================================
  // FETCH ATHLETE PROFILE
  // ======================================================

  const fetchAthleteProfile = async () => {
    try {
      const token = getToken();

      if (!token) {
        return null;
      }

      const response = await axios.get(
        `${API}/athletes/get-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const profile =
        response.data?.athlete ||
        response.data?.profile ||
        response.data;

      setAthleteProfile(profile);

      return profile;
    } catch (err) {
      console.error(
        "Fetch Athlete Profile Error:",
        err
      );

      throw new Error(
        err.response?.data?.message ||
          "Failed to load athlete profile."
      );
    }
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
        setError(
          "Please login to view opportunities."
        );
        return;
      }

      const response = await axios.get(
        `${API}/opportunities`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const events =
        response.data?.opportunities || [];

      setOpportunities(events);
    } catch (err) {
      console.error(
        "Fetch Opportunities Error:",
        err
      );

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
    fetchAthleteProfile();
  }, []);

  // ======================================================
  // OPEN APPLY MODAL
  // ======================================================

  const handleApply = (event) => {
    const status =
      applicationStatus[event._id];

    if (
      status === "pending" ||
      status === "accepted"
    ) {
      return;
    }

    setSelectedOpportunity(event);
    setResumeFile(null);
    setShowApplyModal(true);
  };

  // ======================================================
  // HANDLE RESUME FILE
  // ======================================================

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    // ----------------------------------------------------
    // PDF CHECK
    // ----------------------------------------------------

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please upload a PDF resume.");

      e.target.value = "";
      setResumeFile(null);

      return;
    }

    // ----------------------------------------------------
    // SIZE CHECK - 5 MB
    // ----------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Resume must be smaller than 5 MB."
      );

      e.target.value = "";
      setResumeFile(null);

      return;
    }

    setResumeFile(file);
  };

  // ======================================================
  // CLOSE APPLY MODAL
  // ======================================================

  const closeApplyModal = () => {
    if (applyingId) {
      return;
    }

    setShowApplyModal(false);
    setSelectedOpportunity(null);
    setResumeFile(null);
  };

  // ======================================================
  // SUBMIT APPLICATION
  // ======================================================

  const handleSubmitApplication = async () => {
    try {
      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      if (!selectedOpportunity) {
        return;
      }

      if (!resumeFile) {
        alert("Please upload your resume.");
        return;
      }

      // --------------------------------------------------
      // PDF CHECK
      // --------------------------------------------------

      if (
        resumeFile.type !== "application/pdf" &&
        !resumeFile.name
          .toLowerCase()
          .endsWith(".pdf")
      ) {
        alert(
          "Only PDF resume files are allowed."
        );
        return;
      }

      // --------------------------------------------------
      // SIZE CHECK
      // --------------------------------------------------

      if (
        resumeFile.size >
        5 * 1024 * 1024
      ) {
        alert(
          "Resume must be smaller than 5 MB."
        );
        return;
      }

      setApplyingId(
        selectedOpportunity._id
      );

      // --------------------------------------------------
      // CREATE FORM DATA
      // --------------------------------------------------

      const formData = new FormData();

      formData.append(
        "resume",
        resumeFile,
        resumeFile.name
      );

      // --------------------------------------------------
      // SUBMIT APPLICATION
      // --------------------------------------------------

      const response = await axios.post(
        `${API}/opportunities/${selectedOpportunity._id}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // --------------------------------------------------
      // UPDATE STATUS
      // --------------------------------------------------

      const application =
        response.data?.application;

      setApplicationStatus((prev) => ({
        ...prev,
        [selectedOpportunity._id]:
          application?.status ||
          "pending"
      }));

      // --------------------------------------------------
      // CLOSE MODAL
      // --------------------------------------------------

      setShowApplyModal(false);
      setSelectedOpportunity(null);
      setResumeFile(null);

      alert(
        response.data?.message ||
          "Application submitted successfully."
      );

    } catch (err) {
      console.error(
        "Submit Application Error:",
        err
      );

      // --------------------------------------------------
      // ALREADY APPLIED
      // --------------------------------------------------

      if (err.response?.status === 409) {
        setApplicationStatus((prev) => ({
          ...prev,
          [selectedOpportunity?._id]:
            "pending"
        }));

        setShowApplyModal(false);
        setSelectedOpportunity(null);
        setResumeFile(null);
      }

      alert(
        err.response?.data?.message ||
          err.message ||
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
          handleApply(event)
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
                  fetchAthleteProfile();
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
                          {formatDate(
                            event.date
                          )}
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

      {/* ======================================================
          APPLY MODAL
      ====================================================== */}

      {showApplyModal &&
        selectedOpportunity && (

          <div className="athlyx-op-modal-overlay">

            <div className="athlyx-op-modal">

              {/* ==================================================
                  MODAL HEADER
              ================================================== */}

              <div className="athlyx-op-modal-header">

                <div>

                  <span className="athlyx-op-eyebrow">
                    APPLY FOR OPPORTUNITY
                  </span>

                  <h2>
                    {selectedOpportunity.title}
                  </h2>

                </div>

                <button
                  type="button"
                  className="athlyx-op-modal-close"
                  onClick={closeApplyModal}
                  disabled={!!applyingId}
                >
                  <FiX size={20} />
                </button>

              </div>

              {/* ==================================================
                  MODAL BODY
              ================================================== */}

              <div className="athlyx-op-modal-body">

                <p className="athlyx-op-modal-text">
                  Upload your resume to apply
                  for this opportunity.
                </p>

                <div className="athlyx-op-modal-opportunity">

                  <strong>
                    {selectedOpportunity.title}
                  </strong>

                  <span>
                    {selectedOpportunity
                      .academy?.name ||
                      "Academy"}
                  </span>

                </div>

                {/* ==================================================
                    RESUME UPLOAD
                ================================================== */}

                <label className="athlyx-op-resume-upload">

                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleResumeChange}
                    disabled={!!applyingId}
                  />

                  <FiUpload size={22} />

                  <strong>
                    {resumeFile
                      ? "Resume selected"
                      : "Upload your resume"}
                  </strong>

                  <span>
                    PDF only • Maximum 5 MB
                  </span>

                </label>

                {/* ==================================================
                    SELECTED FILE
                ================================================== */}

                {resumeFile && (

                  <div className="athlyx-op-selected-file">

                    <div className="athlyx-op-selected-file-info">

                      <FiFileText size={20} />

                      <div>

                        <strong>
                          {resumeFile.name}
                        </strong>

                        <span>
                          {(
                            resumeFile.size /
                            (1024 * 1024)
                          ).toFixed(2)}{" "}
                          MB
                        </span>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setResumeFile(null)
                      }
                      disabled={!!applyingId}
                    >
                      <FiX size={16} />
                    </button>

                  </div>

                )}

              </div>

              {/* ==================================================
                  MODAL FOOTER
              ================================================== */}

              <div className="athlyx-op-modal-footer">

                <button
                  type="button"
                  className="athlyx-op-modal-cancel"
                  onClick={closeApplyModal}
                  disabled={!!applyingId}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="athlyx-op-btn"
                  onClick={
                    handleSubmitApplication
                  }
                  disabled={
                    !resumeFile ||
                    !!applyingId
                  }
                >

                  {applyingId ? (

                    <>
                      <FiLoader
                        size={16}
                        className="athlyx-op-loading-icon"
                      />

                      Submitting...
                    </>

                  ) : (

                    <>
                      Submit Application
                      <FiArrowRight size={16} />
                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
};

export default Opportunities;
