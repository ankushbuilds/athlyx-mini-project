
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  FiUser,
  FiMapPin,
  FiPhone,
  FiBriefcase,
  FiAward,
  FiTool,
  FiCalendar,
  FiArrowLeft,
  FiInstagram,
  FiFacebook,
  FiYoutube
} from "react-icons/fi";

import ScoutSidebar from "../../components/ScoutSidebar";

const API = "http://localhost:5000/api";

const ScoutAthleteProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAthlete();
  }, [id]);

  const fetchAthlete = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      const response = await axios.get(
        `${API}/athletes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAthlete(
        response.data.athlete
      );

    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/auth", {
          replace: true
        });

        return;
      }

      console.error(
        "Failed to fetch athlete profile:",
        error
      );

    } finally {
      setLoading(false);
    }
  };

  const getName = () => {
    return (
      athlete?.user?.name ||
      athlete?.name ||
      "Athlete"
    );
  };

  const getProfilePic = () => {
    return (
      athlete?.user?.profilePic ||
      "/default-profile.png"
    );
  };

  const getLocation = () => {
    if (!athlete?.address) {
      return "Location not specified";
    }

    if (
      typeof athlete.address === "string"
    ) {
      return athlete.address;
    }

    const parts = [
      athlete.address.city,
      athlete.address.state,
      athlete.address.country
    ].filter(Boolean);

    return parts.length
      ? parts.join(", ")
      : "Location not specified";
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );
    } catch {
      return date;
    }
  };

  if (loading) {
    return (
      <div className="athlete-dashboard">

        <header className="dashboard-header">

          <div className="logo">

            <img
              src="/logo.png"
              alt="Athlyx"
            />

            <span>Athlyx</span>

          </div>

        </header>

        <div className="dashboard-layout">

          <ScoutSidebar />

          <main className="dashboard-content">

            <div className="loading-container">
              Loading athlete profile...
            </div>

          </main>

        </div>

      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="athlete-dashboard">

        <header className="dashboard-header">

          <div className="logo">

            <img
              src="/logo.png"
              alt="Athlyx"
            />

            <span>Athlyx</span>

          </div>

        </header>

        <div className="dashboard-layout">

          <ScoutSidebar />

          <main className="dashboard-content">

            <section className="profile-completion-card">

              <div className="completion-header">

                <div>

                  <span>
                    ATHLETE PROFILE
                  </span>

                  <h2>
                    Athlete Not Found
                  </h2>

                </div>

              </div>

              <p>
                This athlete profile could not
                be found.
              </p>

              

            </section>

          </main>

        </div>

      </div>
    );
  }

  return (
    <div className="athlete-dashboard">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">

        <div className="logo">

          <img
            src="/logo.png"
            alt="Athlyx"
          />

          <span>Athlyx</span>

        </div>

      </header>


      {/* ================= LAYOUT ================= */}

      <div className="dashboard-layout">

        <ScoutSidebar />

        <main className="dashboard-content">




          {/* ================= PROFILE HEADER ================= */}

          <section className="welcome-section">

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px"
              }}
            >

              <img
                src={getProfilePic()}
                alt={getName()}
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  objectFit: "cover"
                }}
              />

              <div>

                <h1>
                  {getName()}
                </h1>

                <p>
                  {athlete.sport ||
                    "Sport not specified"}

                  {athlete.position
                    ? ` • ${athlete.position}`
                    : ""}
                </p>

              </div>

            </div>

          </section>


          {/* ================= BASIC INFORMATION ================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Athlete Information
              </h2>

            </div>


            <div className="profile-fields">

              <div>

                <FiCompassIcon />

                <span>
                  Sport
                </span>

                <p>
                  {athlete.sport ||
                    "Not specified"}
                </p>

              </div>


              <div>

                <FiUser size={20} />

                <span>
                  Position
                </span>

                <p>
                  {athlete.position ||
                    "Not specified"}
                </p>

              </div>


              <div>

                <FiBriefcase size={20} />

                <span>
                  Experience
                </span>

                <p>
                  {athlete.experience
                    ? `${athlete.experience} years`
                    : "Not specified"}
                </p>

              </div>


              <div>

                <FiCalendar size={20} />

                <span>
                  Date of Birth
                </span>

                <p>
                  {formatDate(
                    athlete.dateOfBirth
                  )}
                </p>

              </div>

            </div>

          </section>


          {/* ================= LOCATION & CONTACT ================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Contact & Location
              </h2>

            </div>


            <div className="profile-fields">

              <div>

                <FiMapPin size={20} />

                <span>
                  Location
                </span>

                <p>
                  {getLocation()}
                </p>

              </div>


              <div>

                <FiPhone size={20} />

                <span>
                  Phone
                </span>

                <p>
                  {athlete.phone ||
                    "Not provided"}
                </p>

              </div>


              <div>

                <FiUser size={20} />

                <span>
                  Gender
                </span>

                <p>
                  {athlete.gender ||
                    "Not specified"}
                </p>

              </div>

            </div>

          </section>


          {/* ================= PHYSICAL DETAILS ================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Physical Details
              </h2>

            </div>


            <div className="profile-fields">

              <div>

                <FiUser size={20} />

                <span>
                  Height
                </span>

                <p>
                  {athlete.height
                    ? `${athlete.height} cm`
                    : "Not specified"}
                </p>

              </div>


              <div>

                <FiUser size={20} />

                <span>
                  Weight
                </span>

                <p>
                  {athlete.weight
                    ? `${athlete.weight} kg`
                    : "Not specified"}
                </p>

              </div>

            </div>

          </section>


          {/* ================= SKILLS ================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Skills
              </h2>

            </div>


            <div className="profile-fields">

              <div>

                <FiTool size={20} />

                <span>
                  Skills
                </span>

                <p>
                  {athlete.skills ||
                    "No skills added"}
                </p>

              </div>

            </div>

          </section>


          {/* ================= ACHIEVEMENTS ================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Achievements
              </h2>

            </div>


            <div className="profile-fields">

              <div>

                <FiAward size={20} />

                <span>
                  Achievements
                </span>

              {athlete.achievements?.length > 0 ? (
  athlete.achievements.map((achievement, index) => (
    <div key={achievement._id || index}>
      <h4>{achievement.title}</h4>

      {achievement.description && (
        <p>{achievement.description}</p>
      )}

      {achievement.year && (
        <span>{achievement.year}</span>
      )}
    </div>
  ))
) : (
  <p>No achievements added.</p>
)}

              </div>

            </div>

          </section>


          {/* ================= BIO ================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                About Athlete
              </h2>

            </div>


            <div className="profile-fields">

              <div>

                <FiFileTextIcon />

                <span>
                  Bio
                </span>

                <p>
                  {athlete.bio ||
                    "No bio added"}
                </p>

              </div>

            </div>

          </section>


          {/* ================= SOCIAL LINKS ================= */}

          {athlete.socialLinks && (

            <section className="dashboard-section">

              <div className="section-header">

                <h2>
                  Social Links
                </h2>

              </div>


              <div className="profile-fields">

                {athlete.socialLinks.instagram && (

                  <div>

                    <FiInstagram size={20} />

                    <span>
                      Instagram
                    </span>

                    <p>
                      {athlete.socialLinks.instagram}
                    </p>

                  </div>

                )}


                {athlete.socialLinks.facebook && (

                  <div>

                    <FiFacebook size={20} />

                    <span>
                      Facebook
                    </span>

                    <p>
                      {athlete.socialLinks.facebook}
                    </p>

                  </div>

                )}


                {athlete.socialLinks.youtube && (

                  <div>

                    <FiYoutube size={20} />

                    <span>
                      YouTube
                    </span>

                    <p>
                      {athlete.socialLinks.youtube}
                    </p>

                  </div>

                )}

              </div>

            </section>

          )}


          {/* ================= ACTION ================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                Scouting
              </h2>

            </div>


            <div className="profile-completion-card">

              <div className="completion-header">

                <div>

                  <span>
                    ATHLETE
                  </span>

                  <h2>
                    Interested in this athlete?
                  </h2>

                </div>

              </div>

              <p>
                Send a connection request to
                connect with this athlete.
              </p>

              <button
                onClick={() => {
                  alert(
                    "Connection feature will be connected next."
                  );
                }}
              >
                Connect with Athlete
              </button>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
};


/*
  Small helpers keep the same visual structure
  without introducing new CSS classes.
*/

const FiCompassIcon = () => (
  <FiUser size={20} />
);

const FiFileTextIcon = () => (
  <FiBriefcase size={20} />
);

export default ScoutAthleteProfile;
