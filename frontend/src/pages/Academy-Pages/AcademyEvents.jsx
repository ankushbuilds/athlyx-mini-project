
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation
} from "react-router-dom";
import axios from "axios";

import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiPlus,
  FiArrowRight,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiClock,
  FiUsers,
  FiCheck,
  FiUser,
  FiMail,
  FiActivity
} from "react-icons/fi";

import AcademySidebar from "../../components/AcademySidebar";

const API = "http://localhost:5000/api";

const AcademyEvents = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // ======================================================
  // ROUTE MODES
  // ======================================================

  const isEditMode =
    Boolean(id) && location.pathname.endsWith("/edit");

  const isViewMode =
    Boolean(id) && !isEditMode;

  const isListMode = !id;

  // ======================================================
  // LIST STATE
  // ======================================================

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [events, setEvents] = useState([]);

  // ======================================================
  // SINGLE EVENT STATE
  // ======================================================

  const [event, setEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "Tournament",
    sport: "",
    date: "",
    registrationDeadline: "",
    location: "",
    description: "",
    eligibility: "",
    status: "active"
  });

  // ======================================================
  // COMMON STATE
  // ======================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // APPLICANTS STATE
  // ======================================================

  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] =
    useState(false);
  const [applicantsError, setApplicantsError] =
    useState("");
  const [updatingApplication, setUpdatingApplication] =
    useState(null);

  // ======================================================
  // TOKEN
  // ======================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ======================================================
  // FORMAT DATE FOR INPUT
  // ======================================================

  const formatDateForInput = (date) => {
    if (!date) {
      return "";
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    return d.toISOString().slice(0, 10);
  };

  // ======================================================
  // FORMAT DATE FOR DISPLAY
  // ======================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const formatted = new Date(date);

    if (Number.isNaN(formatted.getTime())) {
      return "Date not available";
    }

    return formatted.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // ======================================================
  // FETCH ACADEMY EVENTS
  // ======================================================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        `${API}/opportunities/academy`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEvents(
        Array.isArray(response.data?.opportunities)
          ? response.data.opportunities
          : []
      );
    } catch (err) {
      console.error(
        "Failed to fetch academy events:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // FETCH SINGLE EVENT
  // ======================================================

  const fetchSingleEvent = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        `${API}/opportunities/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const fetchedEvent =
        response.data?.opportunity ||
        response.data?.event ||
        response.data;

      setEvent(fetchedEvent);

      setFormData({
        title: fetchedEvent?.title || "",
        type:
          fetchedEvent?.type ||
          "Tournament",
        sport: fetchedEvent?.sport || "",
        date: formatDateForInput(
          fetchedEvent?.date
        ),
        registrationDeadline:
          formatDateForInput(
            fetchedEvent?.registrationDeadline
          ),
        location:
          fetchedEvent?.location || "",
        description:
          fetchedEvent?.description || "",
        eligibility:
          fetchedEvent?.eligibility || "",
        status:
          fetchedEvent?.status ||
          "active"
      });
    } catch (err) {
      console.error(
        "Failed to fetch event:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load event."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD / ROUTE CHANGE
  // ======================================================

  useEffect(() => {
    if (isListMode) {
      fetchEvents();
    } else {
      fetchSingleEvent();
    }
  }, [id, location.pathname]);

  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ======================================================
  // OPEN APPLICANTS
  // ======================================================

  const handleViewApplicants = async (eventItem) => {
    try {
      setSelectedEvent(eventItem);
      setShowApplicants(true);
      setApplicants([]);
      setApplicantsError("");
      setApplicantsLoading(true);

      const token = getToken();

      if (!token) {
        setApplicantsError(
          "Please login again."
        );
        return;
      }

      const response = await axios.get(
        `${API}/opportunities/${eventItem._id}/applicants`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setApplicants(
        Array.isArray(
          response.data?.applications
        )
          ? response.data.applications
          : []
      );
    } catch (err) {
      console.error(
        "Failed to fetch applicants:",
        err
      );

      setApplicantsError(
        err.response?.data?.message ||
        "Failed to load applicants."
      );
    } finally {
      setApplicantsLoading(false);
    }
  };

  // ======================================================
  // CLOSE APPLICANTS
  // ======================================================

  const closeApplicants = () => {
    setShowApplicants(false);
    setSelectedEvent(null);
    setApplicants([]);
    setApplicantsError("");
  };

  // ======================================================
  // UPDATE APPLICATION STATUS
  // ======================================================

  const handleApplicationStatus = async (
    applicationId,
    status
  ) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Please login again.");
        return;
      }

      setUpdatingApplication(
        applicationId
      );

      const response = await axios.patch(
        `${API}/opportunities/applications/${applicationId}/status`,
        {
          status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json"
          }
        }
      );

      const updatedApplication =
        response.data?.application;

      // --------------------------------------------------
      // UPDATE LOCAL APPLICANT
      // --------------------------------------------------

      setApplicants((prev) =>
        prev.map((item) =>
          item._id === applicationId
            ? {
                ...item,
                status:
                  updatedApplication?.status ||
                  status
              }
            : item
        )
      );

    } catch (err) {
      console.error(
        "Failed to update application:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Failed to update application."
      );
    } finally {
      setUpdatingApplication(null);
    }
  };

  // ======================================================
  // DELETE EVENT
  // ======================================================

  const handleDelete = async (
    eventId = id
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this event?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert("Please login again.");
        return;
      }

      await axios.delete(
        `${API}/opportunities/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (isListMode) {
        setEvents((prev) =>
          prev.filter(
            (item) =>
              item._id !== eventId
          )
        );

        return;
      }

      navigate("/academy/events");
    } catch (err) {
      console.error(
        "Failed to delete event:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Failed to delete event."
      );
    }
  };

  // ======================================================
  // UPDATE EVENT
  // ======================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.title.trim() ||
      !formData.sport.trim() ||
      !formData.date ||
      !formData.registrationDeadline ||
      !formData.location.trim() ||
      !formData.description.trim()
    ) {
      setError(
        "Please fill all required fields."
      );

      return;
    }

    const eventDate = new Date(
      formData.date
    );

    const registrationDate =
      new Date(
        formData.registrationDeadline
      );

    if (
      Number.isNaN(
        eventDate.getTime()
      ) ||
      Number.isNaN(
        registrationDate.getTime()
      )
    ) {
      setError(
        "Please enter valid dates."
      );
      return;
    }

    if (
      registrationDate >
      eventDate
    ) {
      setError(
        "Registration deadline cannot be after the event date."
      );

      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      if (!token) {
        setError(
          "Please login again."
        );
        return;
      }

      const payload = {
        title:
          formData.title.trim(),
        type: formData.type,
        sport:
          formData.sport.trim(),
        date: formData.date,
        registrationDeadline:
          formData.registrationDeadline,
        location:
          formData.location.trim(),
        description:
          formData.description.trim(),
        eligibility:
          formData.eligibility.trim(),
        status:
          formData.status
      };

      await axios.put(
        `${API}/opportunities/${id}`,
        payload,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json"
          }
        }
      );

      navigate(
        "/academy/events"
      );
    } catch (err) {
      console.error(
        "Failed to update event:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to update event."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // FILTER EVENTS
  // ======================================================

  const filteredEvents =
    events.filter((item) => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      const matchesSearch =
        item.title
          ?.toLowerCase()
          .includes(searchText) ||
        item.sport
          ?.toLowerCase()
          .includes(searchText) ||
        item.location
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
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="dashboard-layout">

        <AcademySidebar />

        <main className="opportunities-page">

          <div className="opportunities-content">

            <div className="opportunities-empty">

              <FiBriefcase />

              <h3>
                Loading...
              </h3>

              <p>
                Please wait while we
                load the event.
              </p>

            </div>

          </div>

        </main>

      </div>
    );
  }

  // ======================================================
  // ERROR FOR VIEW / EDIT
  // ======================================================

  if (
    !isListMode &&
    error &&
    !event
  ) {
    return (
      <div className="dashboard-layout">

        <AcademySidebar />

        <main className="opportunities-page">

          <div className="opportunities-content">

            <div className="opportunities-header">

              <div>

                <span className="page-eyebrow">
                  ACADEMY EVENTS
                </span>

                <h1>
                  Event
                </h1>

                <p>
                  Unable to load this
                  event.
                </p>

              </div>

              <button
                className="opportunity-card-btn"
                type="button"
                onClick={() =>
                  navigate(
                    "/academy/events"
                  )
                }
              >
                Back to Events
              </button>

            </div>

            <div className="opportunities-empty">

              <FiBriefcase />

              <h3>
                Unable to load event
              </h3>

              <p>
                {error}
              </p>

            </div>

          </div>

        </main>

      </div>
    );
  }

  // ======================================================
  // VIEW EVENT
  // ======================================================

  if (isViewMode) {
    return (
      <div className="dashboard-layout">

        <AcademySidebar />

        <main className="opportunities-page">

          <div className="opportunities-content">

            <div className="opportunities-header">

              <div>

                <span className="page-eyebrow">
                  EVENT DETAILS
                </span>

                <h1>
                  {event?.title}
                </h1>

                <p>
                  View complete information
                  about this academy event.
                </p>

              </div>

              <div className="event-view-actions">

                <button
                  className="opportunity-card-btn"
                  type="button"
                  onClick={() =>
                    navigate(
                      `/academy/events/${id}/edit`
                    )
                  }
                >
                  <FiEdit2 />
                  Edit
                </button>

                <button
                  className="opportunity-icon-btn event-delete-btn"
                  title="Delete Event"
                  type="button"
                  onClick={() =>
                    handleDelete(id)
                  }
                >
                  <FiTrash2 />
                </button>

              </div>

            </div>

            {error && (
              <div className="event-form-error">
                {error}
              </div>
            )}

            {/* EVENT CARD */}

            <article className="opportunity-card">

              <div className="opportunity-card-main">

                <div className="opportunity-icon">
                  <FiCalendar />
                </div>

                <div className="opportunity-info">

                  <div className="opportunity-title-row">

                    <h3>
                      {event?.title}
                    </h3>

                    <span className="opportunity-type">
                      {event?.type}
                    </span>

                  </div>

                  <p className="opportunity-organization">
                    {event?.sport}
                  </p>

                  <p className="opportunity-description">
                    {event?.description}
                  </p>

                  <div className="opportunity-meta">

                    <span>
                      <FiMapPin />
                      {event?.location}
                    </span>

                    <span>
                      <FiCalendar />
                      {formatDate(
                        event?.date
                      )}
                    </span>

                    <span>
                      <FiClock />
                      Registration closes:{" "}
                      {formatDate(
                        event?.registrationDeadline
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </article>

            {/* EVENT INFORMATION */}

            <div className="event-form-card">

              <div className="event-form-section">

                <div className="event-form-section-header">

                  <div className="event-form-section-icon">
                    <FiBriefcase />
                  </div>

                  <div>

                    <h2>
                      Event Information
                    </h2>

                    <p>
                      Additional details
                      about this event.
                    </p>

                  </div>

                </div>

                <div className="event-form-grid">

                  <div className="event-form-group">

                    <label>
                      Event Type
                    </label>

                    <input
                      value={
                        event?.type ||
                        ""
                      }
                      readOnly
                    />

                  </div>

                  <div className="event-form-group">

                    <label>
                      Sport
                    </label>

                    <input
                      value={
                        event?.sport ||
                        ""
                      }
                      readOnly
                    />

                  </div>

                  <div className="event-form-group">

                    <label>
                      Event Date
                    </label>

                    <input
                      value={formatDate(
                        event?.date
                      )}
                      readOnly
                    />

                  </div>

                  <div className="event-form-group">

                    <label>
                      Registration Deadline
                    </label>

                    <input
                      value={formatDate(
                        event?.registrationDeadline
                      )}
                      readOnly
                    />

                  </div>

                  <div className="event-form-group">

                    <label>
                      Location
                    </label>

                    <input
                      value={
                        event?.location ||
                        ""
                      }
                      readOnly
                    />

                  </div>

                  <div className="event-form-group">

                    <label>
                      Status
                    </label>

                    <input
                      value={
                        event?.status ||
                        ""
                      }
                      readOnly
                    />

                  </div>

                </div>

              </div>

              {event?.eligibility && (
                <div className="event-form-section">

                  <div className="event-form-section-header">

                    <div className="event-form-section-icon">
                      <FiBriefcase />
                    </div>

                    <div>

                      <h2>
                        Eligibility
                      </h2>

                      <p>
                        Requirements for
                        participants.
                      </p>

                    </div>

                  </div>

                  <div className="event-form-group">

                    <textarea
                      value={
                        event.eligibility
                      }
                      readOnly
                    />

                  </div>

                </div>
              )}

            </div>

            <div className="event-view-back">

              <button
                className="event-cancel-btn"
                type="button"
                onClick={() =>
                  navigate(
                    "/academy/events"
                  )
                }
              >
                Back to Events
              </button>

            </div>

          </div>

        </main>

      </div>
    );
  }

  // ======================================================
  // EDIT EVENT
  // ======================================================

  if (isEditMode) {
    return (
      <div className="dashboard-layout">

        <AcademySidebar />

        <main className="opportunities-page">

          <div className="opportunities-content">

            <div className="opportunities-header">

              <div className="event-header-left">

                <button
                  className="event-back-btn"
                  type="button"
                  onClick={() =>
                    navigate(
                      `/academy/events/${id}`
                    )
                  }
                >
                  ← Back to Event
                </button>

                <span className="page-eyebrow">
                  EDIT • MANAGE • UPDATE
                </span>

                <h1>
                  Edit Event
                </h1>

                <p>
                  Update the details of
                  your academy event.
                </p>

              </div>

            </div>

            <form
              className="event-form-card"
              onSubmit={handleUpdate}
            >

              {/* BASIC INFORMATION */}

              <div className="event-form-section">

                <div className="event-form-section-header">

                  <div className="event-form-section-icon">
                    <FiBriefcase />
                  </div>

                  <div>

                    <h2>
                      Basic Information
                    </h2>

                    <p>
                      Update the basic
                      details of your event.
                    </p>

                  </div>

                </div>

                <div className="event-form-grid">

                  <div className="event-form-group">

                    <label>
                      Event Title{" "}
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={
                        formData.title
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Inter Academy Football Trials"
                    />

                  </div>

                  <div className="event-form-group">

                    <label>
                      Event Type{" "}
                      <span>*</span>
                    </label>

                    <select
                      name="type"
                      value={
                        formData.type
                      }
                      onChange={
                        handleChange
                      }
                    >

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

                  </div>

                  <div className="event-form-group">

                    <label>
                      Sport{" "}
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="sport"
                      value={
                        formData.sport
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Football"
                    />

                  </div>

                  <div className="event-form-group">

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={
                        formData.status
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="draft">
                        Draft
                      </option>

                      <option value="active">
                        Active
                      </option>

                      <option value="closed">
                        Closed
                      </option>

                    </select>

                  </div>

                </div>

              </div>

              {/* DATE & LOCATION */}

              <div className="event-form-section">

                <div className="event-form-section-header">

                  <div className="event-form-section-icon">
                    <FiCalendar />
                  </div>

                  <div>

                    <h2>
                      Date & Location
                    </h2>

                    <p>
                      Set when and where
                      the event will take place.
                    </p>

                  </div>

                </div>

                <div className="event-form-grid">

                  <div className="event-form-group">

                    <label>
                      Event Date{" "}
                      <span>*</span>
                    </label>

                    <div className="event-input-with-icon">

                      <FiCalendar />

                      <input
                        type="date"
                        name="date"
                        value={
                          formData.date
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                  </div>

                  <div className="event-form-group">

                    <label>
                      Registration Deadline{" "}
                      <span>*</span>
                    </label>

                    <div className="event-input-with-icon">

                      <FiCalendar />

                      <input
                        type="date"
                        name="registrationDeadline"
                        value={
                          formData.registrationDeadline
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                  </div>

                  <div
                    className="event-form-group"
                    style={{
                      gridColumn:
                        "1 / -1"
                    }}
                  >

                    <label>
                      Location{" "}
                      <span>*</span>
                    </label>

                    <div className="event-input-with-icon">

                      <FiMapPin />

                      <input
                        type="text"
                        name="location"
                        value={
                          formData.location
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. Sports Complex, Aligarh"
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="event-form-section">

                <div className="event-form-section-header">

                  <div className="event-form-section-icon">
                    <FiBriefcase />
                  </div>

                  <div>

                    <h2>
                      Event Details
                    </h2>

                    <p>
                      Provide information
                      athletes should know.
                    </p>

                  </div>

                </div>

                <div className="event-form-group">

                  <label>
                    Description{" "}
                    <span>*</span>
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Describe your event..."
                  />

                </div>

                <div
                  className="event-form-group"
                  style={{
                    marginTop: "22px"
                  }}
                >

                  <label>
                    Eligibility
                  </label>

                  <textarea
                    name="eligibility"
                    value={
                      formData.eligibility
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Mention age group, skill level, gender, etc."
                  />

                </div>

              </div>

              {error && (
                <div className="event-form-error">
                  {error}
                </div>
              )}

              <div className="event-form-actions">

                <button
                  type="button"
                  className="event-cancel-btn"
                  onClick={() =>
                    navigate(
                      `/academy/events/${id}`
                    )
                  }
                  disabled={saving}
                >
                  <FiX />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="event-submit-btn"
                  disabled={saving}
                >
                  <FiSave />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </main>

      </div>
    );
  }

  // ======================================================
  // LIST MODE
  // ======================================================

  return (
    <div className="dashboard-layout">

      <AcademySidebar />

      <main className="opportunities-page">

        <div className="opportunities-content">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="opportunities-header">

            <div>

              <span className="page-eyebrow">
                CREATE • MANAGE • GROW
              </span>

              <h1>
                Events
              </h1>

              <p>
                Create and manage tournaments,
                trials, competitions and other
                academy events.
              </p>

            </div>

            <button
              className="opportunity-card-btn"
              type="button"
              onClick={() =>
                navigate(
                  "/academy/events/create"
                )
              }
            >
              <FiPlus />
              Create Event
            </button>

          </div>

          {/* ==================================================
              TOOLBAR
          ================================================== */}

          <div className="opportunities-toolbar">

            <div className="opportunities-search">

              <FiSearch />

              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value
                )
              }
              className="opportunities-filter"
            >

              <option value="All">
                All Events
              </option>

              <option value="Tournament">
                Tournaments
              </option>

              <option value="Trials">
                Trials
              </option>

              <option value="Competition">
                Competitions
              </option>

              <option value="Camp">
                Camps
              </option>

              <option value="Program">
                Programs
              </option>

              <option value="Talent Hunt">
                Talent Hunts
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* ==================================================
              SECTION HEADING
          ================================================== */}

          <div className="opportunities-section-heading">

            <div>

              <h2>
                Your Events
              </h2>

              <p>
                Manage events created
                by your academy.
              </p>

            </div>

            <span className="opportunities-result-count">
              {filteredEvents.length} events
            </span>

          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="opportunities-empty">

              <FiBriefcase />

              <h3>
                Unable to load events
              </h3>

              <p>
                {error}
              </p>

              <button
                className="opportunity-card-btn"
                type="button"
                onClick={fetchEvents}
              >
                Try Again
              </button>

            </div>
          )}

          {/* ==================================================
              EVENTS
          ================================================== */}

          {!error &&
            filteredEvents.length > 0 && (

              <div className="opportunities-list">

                {filteredEvents.map(
                  (item) => (

                    <article
                      className="opportunity-card"
                      key={item._id}
                    >

                      {/* MAIN CONTENT */}

                      <div className="opportunity-card-main">

                        <div className="opportunity-icon">
                          <FiCalendar />
                        </div>

                        <div className="opportunity-info">

                          <div className="opportunity-title-row">

                            <h3>
                              {item.title}
                            </h3>

                            <span className="opportunity-type">
                              {item.type}
                            </span>

                          </div>

                          <p className="opportunity-organization">
                            {item.sport}
                          </p>

                          <p className="opportunity-description">
                            {item.description}
                          </p>

                          <div className="opportunity-meta">

                            <span>
                              <FiMapPin />
                              {item.location}
                            </span>

                            <span>
                              <FiCalendar />
                              {formatDate(
                                item.date
                              )}
                            </span>

                            <span>
                              <FiClock />
                              Registration closes:{" "}
                              {formatDate(
                                item.registrationDeadline
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* ==================================================
                          ACTIONS
                      ================================================== */}

                      <div className="opportunity-event-actions">

                        {/* APPLICANTS */}

                        <button
                          className="opportunity-card-btn"
                          type="button"
                          onClick={() =>
                            handleViewApplicants(
                              item
                            )
                          }
                        >
                          <FiUsers />
                          Applicants
                        </button>

                        {/* VIEW */}

                        <button
                          className="opportunity-card-btn"
                          type="button"
                          onClick={() =>
                            navigate(
                              `/academy/events/${item._id}`
                            )
                          }
                        >
                          View
                          <FiArrowRight />
                        </button>

                        {/* EDIT */}

                        <button
                          className="opportunity-icon-btn"
                          title="Edit Event"
                          type="button"
                          onClick={() =>
                            navigate(
                              `/academy/events/${item._id}/edit`
                            )
                          }
                        >
                          <FiEdit2 />
                        </button>

                        {/* DELETE */}

                        <button
                          className="opportunity-icon-btn event-delete-btn"
                          title="Delete Event"
                          type="button"
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>
            )}

          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {!error &&
            filteredEvents.length === 0 && (

              <div className="opportunities-empty">

                <FiBriefcase />

                <h3>
                  {events.length === 0
                    ? "No events created yet"
                    : "No events found"}
                </h3>

                <p>
                  {events.length === 0
                    ? "Create your first academy event to get started."
                    : "Try changing your search or event type."}
                </p>

                {events.length === 0 && (

                  <button
                    className="opportunity-card-btn"
                    type="button"
                    onClick={() =>
                      navigate(
                        "/academy/events/create"
                      )
                    }
                  >
                    <FiPlus />
                    Create Event
                  </button>

                )}

              </div>

            )}

        </div>

      </main>


      {/* ======================================================
          APPLICANTS MODAL / PANEL
      ====================================================== */}

      {showApplicants && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background:
              "rgba(0, 0, 0, 0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px"
          }}
          onClick={closeApplicants}
        >

          <div
            className="event-form-card"
            style={{
              width: "100%",
              maxWidth: "850px",
              maxHeight: "85vh",
              overflowY: "auto"
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ==================================================
                APPLICANTS HEADER
            ================================================== */}

            <div className="event-form-section">

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  gap: "16px"
                }}
              >

                <div className="event-form-section-header"
                  style={{
                    marginBottom: 0
                  }}
                >

                  <div className="event-form-section-icon">
                    <FiUsers />
                  </div>

                  <div>

                    <h2>
                      Event Applicants
                    </h2>

                    <p>
                      {selectedEvent?.title ||
                        "Event"}
                    </p>

                  </div>

                </div>

                <button
                  className="opportunity-icon-btn"
                  type="button"
                  title="Close"
                  onClick={
                    closeApplicants
                  }
                >
                  <FiX />
                </button>

              </div>

            </div>


            {/* ==================================================
                LOADING
            ================================================== */}

            {applicantsLoading && (

              <div className="opportunities-empty">

                <FiUsers />

                <h3>
                  Loading applicants...
                </h3>

                <p>
                  Please wait while we
                  fetch applications.
                </p>

              </div>

            )}


            {/* ==================================================
                ERROR
            ================================================== */}

            {!applicantsLoading &&
              applicantsError && (

                <div className="event-form-error">
                  {applicantsError}
                </div>

              )}


            {/* ==================================================
                EMPTY
            ================================================== */}

            {!applicantsLoading &&
              !applicantsError &&
              applicants.length === 0 && (

                <div className="opportunities-empty">

                  <FiUsers />

                  <h3>
                    No applicants yet
                  </h3>

                  <p>
                    Athletes who apply to
                    this event will appear
                    here.
                  </p>

                </div>

              )}


            {/* ==================================================
                APPLICANTS LIST
            ================================================== */}

            {!applicantsLoading &&
              !applicantsError &&
              applicants.length > 0 && (

                <div
                  style={{
                    padding: "24px 32px"
                  }}
                >

                  <div
                    style={{
                      marginBottom:
                        "18px",
                      color: "#858585",
                      fontSize: "13px"
                    }}
                  >
                    {applicants.length}{" "}
                    {applicants.length === 1
                      ? "application"
                      : "applications"}
                  </div>


                  {applicants.map(
                    (application) => {

                      const athlete =
                        application.athlete;

                      const status =
                        application.status;

                      const isUpdating =
                        updatingApplication ===
                        application._id;

                      return (

                        <div
                          className="opportunity-card"
                          key={
                            application._id
                          }
                          style={{
                            marginBottom:
                              "14px"
                          }}
                        >

                          {/* ==================================================
                              ATHLETE INFO
                          ================================================== */}

                          <div className="opportunity-card-main">

                            <div
                              className="opportunity-icon"
                            >
                              {athlete?.profilePic ? (

                                <img
                                  src={
                                    athlete.profilePic
                                  }
                                  alt={
                                    athlete.name ||
                                    "Athlete"
                                  }
                                  style={{
                                    width:
                                      "100%",
                                    height:
                                      "100%",
                                    borderRadius:
                                      "inherit",
                                    objectFit:
                                      "cover"
                                  }}
                                />

                              ) : (

                                <FiUser />

                              )}

                            </div>


                            <div className="opportunity-info">

                              <div className="opportunity-title-row">

                                <h3>
                                  {athlete?.name ||
                                    "Athlete"}
                                </h3>

                                <span
                                  className="opportunity-type"
                                >
                                  {status ===
                                  "accepted"
                                    ? "Accepted"
                                    : status ===
                                      "rejected"
                                    ? "Rejected"
                                    : "Pending"}
                                </span>

                              </div>


                              {/* EMAIL */}

                              <p className="opportunity-organization">

                                <FiMail
                                  style={{
                                    marginRight:
                                      "6px"
                                  }}
                                />

                                {athlete?.email ||
                                  "Email not available"}

                              </p>


                              {/* SPORT / POSITION */}

                              <div className="opportunity-meta">

                                {athlete?.sport && (

                                  <span>
                                    <FiActivity />
                                    {athlete.sport}
                                  </span>

                                )}

                                {athlete?.position && (

                                  <span>
                                    <FiBriefcase />
                                    {athlete.position}
                                  </span>

                                )}

                                <span>
                                  <FiCalendar />
                                  Applied{" "}
                                  {formatDate(
                                    application.createdAt
                                  )}
                                </span>

                              </div>


                              {/* EXPERIENCE */}

                              {athlete?.experience && (

                                <p
                                  className="opportunity-description"
                                  style={{
                                    marginTop:
                                      "10px"
                                  }}
                                >
                                  <strong>
                                    Experience:
                                  </strong>{" "}
                                  {
                                    athlete.experience
                                  }
                                </p>

                              )}

                            </div>

                          </div>


                          {/* ==================================================
                              ACTIONS
                          ================================================== */}

                          {status ===
                            "pending" && (

                            <div
                              className="opportunity-event-actions"
                              style={{
                                marginTop:
                                  "16px",
                                paddingTop:
                                  "16px",
                                borderTop:
                                  "1px solid #292929"
                              }}
                            >

                              <button
                                className="opportunity-card-btn"
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  handleApplicationStatus(
                                    application._id,
                                    "accepted"
                                  )
                                }
                              >
                                <FiCheck />

                                {isUpdating
                                  ? "Updating..."
                                  : "Accept"}
                              </button>


                              <button
                                className="opportunity-card-btn"
                                type="button"
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  handleApplicationStatus(
                                    application._id,
                                    "rejected"
                                  )
                                }
                              >
                                <FiX />
                                Reject
                              </button>

                            </div>

                          )}

                        </div>

                      );
                    }
                  )}

                </div>

              )}

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="event-form-actions">

              <button
                type="button"
                className="event-cancel-btn"
                onClick={
                  closeApplicants
                }
              >
                <FiX />
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AcademyEvents;
