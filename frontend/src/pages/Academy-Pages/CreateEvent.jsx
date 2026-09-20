import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiType,
  FiActivity,
  FiFileText,
  FiCheckCircle
} from "react-icons/fi";

import AcademySidebar from "../../components/AcademySidebar";

const API = "http://localhost:5000/api";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    type: "Tournament",
    sport: "",
    date: "",
    registrationDeadline: "",
    location: "",
    description: "",
    eligibility: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
    setSuccess("");
  };

  // ======================================================
  // CREATE EVENT
  // ======================================================

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setError("");
    setSuccess("");

    // Required fields
    if (
      !formData.title.trim() ||
      !formData.type ||
      !formData.sport.trim() ||
      !formData.date ||
      !formData.registrationDeadline ||
      !formData.location.trim() ||
      !formData.description.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    // Validate dates
    const eventDate = new Date(formData.date);
    const registrationDate = new Date(
      formData.registrationDeadline
    );

    if (
      Number.isNaN(eventDate.getTime()) ||
      Number.isNaN(registrationDate.getTime())
    ) {
      setError("Please enter valid dates.");
      return;
    }

    // Registration deadline cannot be after event
    if (registrationDate > eventDate) {
      setError(
        "Registration deadline cannot be after the event date."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/opportunities`,
        {
          title: formData.title.trim(),
          type: formData.type,
          sport: formData.sport.trim(),
          date: formData.date,
          registrationDeadline:
            formData.registrationDeadline,
          location: formData.location.trim(),
          description: formData.description.trim(),
          eligibility: formData.eligibility.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "Event created:",
        response.data
      );

      setSuccess("Event created successfully.");

      setTimeout(() => {
        navigate("/academy/events");
      }, 800);

    } catch (err) {
      console.error(
        "Failed to create event:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to create event."
      );
    }
  };

  // ======================================================
  // CANCEL
  // ======================================================

  const handleCancel = () => {
    navigate("/academy/events");
  };

  // ======================================================
  // RENDER
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

            <div className="event-header-left">

              <button
                type="button"
                className="event-back-btn"
                onClick={handleCancel}
              >
                <FiArrowLeft />
                <span>Back to Events</span>
              </button>

              <span className="page-eyebrow">
                CREATE • MANAGE • GROW
              </span>

              <h1>Create Event</h1>

              <p>
                Create a tournament, trial, competition,
                camp or other academy event.
              </p>

            </div>

          </div>


          {/* ==================================================
              FORM CARD
          ================================================== */}

          <form
            className="event-form-card"
            onSubmit={handleSubmit}
          >

            {/* ==================================================
                EVENT INFORMATION
            ================================================== */}

            <section className="event-form-section">

              <div className="event-form-section-header">

                <div className="event-form-section-icon">
                  <FiCalendar />
                </div>

                <div>
                  <h2>Event Information</h2>

                  <p>
                    Add the basic information about your event.
                  </p>
                </div>

              </div>


              <div className="event-form-grid">

                {/* TITLE */}

                <div className="event-form-group">

                  <label>
                    Event Title <span>*</span>
                  </label>

                  <div className="event-input-with-icon">

                    <FiCalendar />

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Inter Academy Football Tournament"
                    />

                  </div>

                </div>


                {/* TYPE */}

                <div className="event-form-group">

                  <label>
                    Event Type <span>*</span>
                  </label>

                  <div className="event-input-with-icon">

                    <FiType />

                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
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

                </div>


                {/* SPORT */}

                <div className="event-form-group">

                  <label>
                    Sport <span>*</span>
                  </label>

                  <div className="event-input-with-icon">

                    <FiActivity />

                    <input
                      type="text"
                      name="sport"
                      value={formData.sport}
                      onChange={handleChange}
                      placeholder="e.g. Football"
                    />

                  </div>

                </div>

              </div>

            </section>


            {/* ==================================================
                DATE & LOCATION
            ================================================== */}

            <section className="event-form-section">

              <div className="event-form-section-header">

                <div className="event-form-section-icon">
                  <FiMapPin />
                </div>

                <div>

                  <h2>Date & Location</h2>

                  <p>
                    Set when and where the event will take place.
                  </p>

                </div>

              </div>


              <div className="event-form-grid">

                {/* EVENT DATE */}

                <div className="event-form-group">

                  <label>
                    Event Date <span>*</span>
                  </label>

                  <div className="event-input-with-icon">

                    <FiCalendar />

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* REGISTRATION DEADLINE */}

                <div className="event-form-group">

                  <label>
                    Registration Deadline <span>*</span>
                  </label>

                  <div className="event-input-with-icon">

                    <FiCalendar />

                    <input
                      type="date"
                      name="registrationDeadline"
                      value={
                        formData.registrationDeadline
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>


                {/* LOCATION */}

                <div className="event-form-group">

                  <label>
                    Location <span>*</span>
                  </label>

                  <div className="event-input-with-icon">

                    <FiMapPin />

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Aligarh Sports Stadium"
                    />

                  </div>

                </div>

              </div>

            </section>


            {/* ==================================================
                EVENT DETAILS
            ================================================== */}

            <section className="event-form-section">

              <div className="event-form-section-header">

                <div className="event-form-section-icon">
                  <FiFileText />
                </div>

                <div>

                  <h2>Event Details</h2>

                  <p>
                    Provide details athletes should know
                    before registering.
                  </p>

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="event-form-group">

                <label>
                  Description <span>*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event..."
                  rows="6"
                />

              </div>


              {/* ELIGIBILITY */}

              <div className="event-form-group">

                <label>
                  Eligibility
                </label>

                <textarea
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleChange}
                  placeholder="e.g. Athletes aged 16–21 years..."
                  rows="4"
                />

                <small>
                  Mention age group, experience, gender,
                  skill level or other requirements.
                </small>

              </div>

            </section>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="event-form-error">
                {error}
              </div>
            )}


            {/* ==================================================
                SUCCESS
            ================================================== */}

            {success && (
              <div className="event-form-success">

                <FiCheckCircle />

                <span>{success}</span>

              </div>
            )}


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="event-form-actions">

              <button
                type="button"
                className="event-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="event-submit-btn"
              >
                <FiCheckCircle />
                Create Event
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
};

export default CreateEvent;