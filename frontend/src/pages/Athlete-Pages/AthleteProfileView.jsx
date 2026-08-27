import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FiEdit,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiDownload,
  FiX,
  FiUserPlus
} from "react-icons/fi";

import {
  PDFDownloadLink,
  PDFViewer
} from "@react-pdf/renderer";

import AthleteSidebar from "../../components/AthleteSidebar";
import CoachSidebar from "../../components/CoachSidebar";
import AthleteResume from "../../components/AthleteResume";

const API = "http://localhost:5000/api";

const AthleteProfileView = () => {
  const navigate = useNavigate();
  const { athleteId } = useParams();

  const isPublicProfile = Boolean(athleteId);

  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showResumeModal, setShowResumeModal] = useState(false);

  const [sendingRequest, setSendingRequest] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("none");
  const [requestError, setRequestError] = useState("");

  const [currentUserRole, setCurrentUserRole] = useState("");

  // ==========================================
  // SHOWCASE
  // ==========================================

  const [showcasePosts, setShowcasePosts] = useState([]);
  const [showcaseLoading, setShowcaseLoading] = useState(false);
  const [showcaseError, setShowcaseError] = useState("");

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Invalid user data in localStorage");
    }

    if (user?.role) {
      setCurrentUserRole(user.role);
    }

    fetchAthleteProfile();
  }, [athleteId]);

  // ==========================================
  // FETCH ATHLETE PROFILE
  // ==========================================

  const fetchAthleteProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setRequestError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      if (isPublicProfile) {
        const response = await axios.get(
          `${API}/athletes/${athleteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const athleteData = response.data?.athlete;

        setAthlete(athleteData);

        // ==========================================
        // FETCH SHOWCASE POSTS
        // ==========================================

        fetchShowcasePosts(athleteId, token);

        // ==========================================
        // CONNECTION STATUS
        // ==========================================

        const storedUser = localStorage.getItem("user");

        let user = null;

        try {
          user = storedUser
            ? JSON.parse(storedUser)
            : null;
        } catch (error) {
          user = null;
        }

        if (user?.role === "coach") {
          try {
            const statusResponse = await axios.get(
              `${API}/connections/status/${athleteId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            const status =
              statusResponse.data?.status || "none";

            if (status === "accepted") {
              setConnectionStatus("connected");
            } else if (status === "pending") {
              setConnectionStatus("pending");
            } else if (status === "rejected") {
              setConnectionStatus("rejected");
            } else {
              setConnectionStatus("none");
            }
          } catch (statusError) {
            console.error(
              "Failed to fetch connection status:",
              statusError
            );

            setConnectionStatus("none");
          }
        } else {
          setConnectionStatus("none");
        }
      } else {
        const response = await axios.get(
          `${API}/athletes/get-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setAthlete(response.data?.athlete);
        setConnectionStatus("none");

        // Own profile posts
        if (response.data?.athlete?._id) {
          fetchShowcasePosts(
            response.data.athlete._id,
            token
          );
        }
      }
    } catch (error) {
      console.error(
        "Failed to fetch athlete profile:",
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

      if (error.response?.status === 404) {
        setError("Athlete profile not found.");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load athlete profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH SHOWCASE POSTS
  // ==========================================

  const fetchShowcasePosts = async (
    athleteIdToFetch,
    token
  ) => {
    try {
      setShowcaseLoading(true);
      setShowcaseError("");

      const response = await axios.get(
        `${API}/showcase/athlete/${athleteIdToFetch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setShowcasePosts(
        Array.isArray(response.data?.posts)
          ? response.data.posts
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch showcase posts:",
        error
      );

      setShowcasePosts([]);

      setShowcaseError(
        error.response?.data?.message ||
          "Failed to load showcase posts."
      );
    } finally {
      setShowcaseLoading(false);
    }
  };

  // ==========================================
  // SEND CONNECTION REQUEST
  // ==========================================

  const sendConnectionRequest = async () => {
    if (
      sendingRequest ||
      connectionStatus === "pending" ||
      connectionStatus === "connected"
    ) {
      return;
    }

    try {
      setSendingRequest(true);
      setRequestError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", {
          replace: true
        });
        return;
      }

      const response = await axios.post(
        `${API}/connections/send/${athleteId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (
        response.status === 200 ||
        response.status === 201
      ) {
        setConnectionStatus("pending");
      }
    } catch (error) {
      console.error(
        "Send connection request error:",
        error
      );

      const status =
        error.response?.data?.status;

      if (status === "pending") {
        setConnectionStatus("pending");
      } else if (status === "accepted") {
        setConnectionStatus("connected");
      } else {
        const message =
          error.response?.data?.message
            ?.toLowerCase() || "";

        if (
          message.includes("pending") ||
          message.includes("already sent")
        ) {
          setConnectionStatus("pending");
        }

        if (
          message.includes("connected") ||
          message.includes("already connected")
        ) {
          setConnectionStatus("connected");
        }
      }

      setRequestError(
        error.response?.data?.message ||
          "Failed to send connection request."
      );
    } finally {
      setSendingRequest(false);
    }
  };

  // ==========================================
  // FORMAT HELPERS
  // ==========================================

  const formatGender = (gender) => {
    if (!gender) {
      return "Not added";
    }

    return (
      gender.charAt(0).toUpperCase() +
      gender.slice(1)
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not added";
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

  // ==========================================
  // RESUME DATA
  // ==========================================

  const resumeData = athlete
    ? {
        name:
          athlete.user?.name ||
          "Athlete",

        email:
          athlete.user?.email || "",

        profilePic:
          athlete.user?.profilePic || "",

        dateOfBirth:
          athlete.dateOfBirth || "",

        gender:
          athlete.gender || "",

        phone:
          athlete.phone || "",

        city:
          athlete.address?.city || "",

        state:
          athlete.address?.state || "",

        country:
          athlete.address?.country ||
          "India",

        sport:
          athlete.sport || "",

        position:
          athlete.position || "",

        experience:
          athlete.experience ?? 0,

        skills:
          athlete.skills || [],

        bio:
          athlete.bio || "",

        height:
          athlete.height || "",

        weight:
          athlete.weight || "",

        achievements:
          athlete.achievements || [],

        socialLinks: {
          instagram:
            athlete.socialLinks?.instagram ||
            "",

          facebook:
            athlete.socialLinks?.facebook ||
            "",

          youtube:
            athlete.socialLinks?.youtube ||
            ""
        }
      }
    : {};

  // ==========================================
  // SIDEBAR
  // ==========================================

  const renderSidebar = () => {
    if (
      isPublicProfile &&
      currentUserRole === "coach"
    ) {
      return <CoachSidebar />;
    }

    return <AthleteSidebar />;
  };

  const showConnectButton =
    isPublicProfile &&
    currentUserRole === "coach";

  const getConnectionButtonText = () => {
    if (
      connectionStatus === "connected"
    ) {
      return "Connected";
    }

    if (
      connectionStatus === "pending"
    ) {
      return "Request Sent";
    }

    if (
      connectionStatus === "rejected"
    ) {
      return "Connect";
    }

    if (sendingRequest) {
      return "Sending...";
    }

    return "Connect";
  };

  const isConnectionButtonDisabled =
    sendingRequest ||
    connectionStatus === "pending" ||
    connectionStatus === "connected";

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="athlete-profile-view-page">
        {renderSidebar()}

        <main className="athlete-profile-view-content">
          <div className="profile-view-container">
            <div className="page-heading">
              <h1>Athlete Profile</h1>
            </div>

            <section className="profile-view-section">
              <h2>Loading Profile</h2>

              <p className="profile-bio">
                Please wait while we load the
                athlete profile.
              </p>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="athlete-profile-view-page">
        {renderSidebar()}

        <main className="athlete-profile-view-content">
          <div className="profile-view-container">
            <div className="page-heading">
              <h1>Athlete Profile</h1>
            </div>

            <div className="profile-error">
              {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="athlete-profile-view-page">
        {renderSidebar()}

        <main className="athlete-profile-view-content">
          <div className="profile-view-container">
            <div className="profile-error">
              Athlete profile not found.
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // PROFILE DATA
  // ==========================================

  const profilePic =
    athlete.user?.profilePic || "";

  const fullLocation = [
    athlete.address?.city,
    athlete.address?.state,
    athlete.address?.country
  ]
    .filter(Boolean)
    .join(", ");

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="athlete-profile-view-page">
      {renderSidebar()}

      <main className="athlete-profile-view-content">
        <div className="profile-view-container">

          {/* ======================================
              PAGE HEADER
          ====================================== */}

          <div className="page-heading profile-page-heading">
            <div>
              <span className="page-eyebrow">
                ATHLETE PROFILE
              </span>

              <h1>
                {athlete.user?.name ||
                  "Athlete"}
              </h1>
            </div>

            <div className="profile-header-actions">

              {!isPublicProfile && (
                <button
                  type="button"
                  className="generate-resume-btn"
                  onClick={() =>
                    setShowResumeModal(true)
                  }
                >
                  <FiFileText />
                  Generate Resume
                </button>
              )}

              {showConnectButton && (
                <button
                  type="button"
                  className="generate-resume-btn"
                  onClick={
                    sendConnectionRequest
                  }
                  disabled={
                    isConnectionButtonDisabled
                  }
                >
                  {connectionStatus ===
                  "connected" ? (
                    <FiCheckCircle />
                  ) : (
                    <FiUserPlus />
                  )}

                  {getConnectionButtonText()}
                </button>
              )}
            </div>
          </div>

          {requestError &&
            connectionStatus === "none" && (
              <div className="profile-error">
                {requestError}
              </div>
            )}

          {/* ======================================
              PROFILE HEADER
          ====================================== */}

          <section className="profile-view-header">
            <div className="profile-view-photo">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt={
                    athlete.user?.name ||
                    "Athlete"
                  }
                />
              ) : (
                <div className="profile-view-placeholder">
                  <FiUser />
                </div>
              )}
            </div>

            <div className="profile-view-user-info">
              <h1>
                {athlete.user?.name ||
                  "Athlete"}
              </h1>

              <p>
                {athlete.sport ||
                  "Sport not added"}

                {athlete.position &&
                  ` • ${athlete.position}`}
              </p>

              <span>
                {fullLocation ||
                  "Location not added"}
              </span>
            </div>
          </section>

          {/* ======================================
              PERSONAL INFORMATION
          ====================================== */}

          <section className="profile-view-section">
            <h2>Personal Information</h2>

            <div className="profile-details-grid">

              <div className="profile-detail">
                <span>
                  <FiUser /> Gender
                </span>

                <strong>
                  {formatGender(
                    athlete.gender
                  )}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  <FiCalendar /> Date of Birth
                </span>

                <strong>
                  {formatDate(
                    athlete.dateOfBirth
                  )}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  <FiPhone /> Phone
                </span>

                <strong>
                  {athlete.phone ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  <FiMail /> Email
                </span>

                <strong>
                  {athlete.user?.email ||
                    "Not available"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Height</span>

                <strong>
                  {athlete.height
                    ? `${athlete.height} cm`
                    : "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Weight</span>

                <strong>
                  {athlete.weight
                    ? `${athlete.weight} kg`
                    : "Not added"}
                </strong>
              </div>

            </div>
          </section>

          {/* ======================================
              SPORTS INFORMATION
          ====================================== */}

          <section className="profile-view-section">
            <h2>Sports Information</h2>

            <div className="profile-details-grid">

              <div className="profile-detail">
                <span>
                  Primary Sport
                </span>

                <strong>
                  {athlete.sport ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Position</span>

                <strong>
                  {athlete.position ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Experience</span>

                <strong>
                  {athlete.experience
                    ? `${athlete.experience} Years`
                    : "0 Years"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Career Status</span>

                <strong>
                  {athlete.isAvailable
                    ? "Open to Opportunities"
                    : "Currently Unavailable"}
                </strong>
              </div>

            </div>
          </section>

          {/* ======================================
              LOCATION
          ====================================== */}

          <section className="profile-view-section">
            <h2>Location</h2>

            <div className="profile-details-grid">

              <div className="profile-detail">
                <span>
                  <FiMapPin /> City
                </span>

                <strong>
                  {athlete.address?.city ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>State</span>

                <strong>
                  {athlete.address?.state ||
                    "Not added"}
                </strong>
              </div>

              <div className="profile-detail">
                <span>Country</span>

                <strong>
                  {athlete.address?.country ||
                    "India"}
                </strong>
              </div>

            </div>
          </section>

          {/* ======================================
              AVAILABILITY
          ====================================== */}

          <section className="profile-view-section">
            <h2>Availability</h2>

            <div className="availability-status">
              {athlete.isAvailable ? (
                <>
                  <FiCheckCircle />
                  Available for opportunities
                </>
              ) : (
                <>
                  <FiClock />
                  Currently unavailable
                </>
              )}
            </div>
          </section>

          {/* ======================================
              SKILLS
          ====================================== */}

          <section className="profile-view-section">
            <h2>Skills</h2>

            <div className="profile-skills">
              {athlete.skills?.length > 0 ? (
                athlete.skills.map(
                  (skill, index) => (
                    <span key={index}>
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p>
                  No skills added yet.
                </p>
              )}
            </div>
          </section>

          {/* ======================================
              ACHIEVEMENTS
          ====================================== */}

          <section className="profile-view-section">
            <h2>Achievements</h2>

            {athlete.achievements?.length >
            0 ? (
              <div className="achievement-list">
                {athlete.achievements.map(
                  (
                    achievement,
                    index
                  ) => (
                    <div
                      className="achievement-card"
                      key={
                        achievement._id ||
                        index
                      }
                    >
                      <h3>
                        {achievement.title ||
                          "Achievement"}
                      </h3>

                      <p>
                        {achievement.description ||
                          "No description added."}
                      </p>

                      {achievement.year && (
                        <span>
                          {achievement.year}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="profile-bio">
                No achievements added
                yet.
              </p>
            )}
          </section>

          {/* ======================================
              ABOUT
          ====================================== */}

          <section className="profile-view-section">
            <h2>About</h2>

            <div className="profile-bio">
              {athlete.bio ||
                "No bio added yet."}
            </div>
          </section>

          {/* ======================================
              SOCIAL LINKS
          ====================================== */}

          <section className="profile-view-section">
            <h2>Social Links</h2>

            <div className="profile-skills">

              {athlete.socialLinks
                ?.instagram && (
                <span>
                  <a
                    href={
                      athlete.socialLinks
                        .instagram
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration:
                        "none"
                    }}
                  >
                    <FiInstagram />
                    {" "}Instagram
                  </a>
                </span>
              )}

              {athlete.socialLinks
                ?.facebook && (
                <span>
                  <a
                    href={
                      athlete.socialLinks
                        .facebook
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration:
                        "none"
                    }}
                  >
                    <FiFacebook />
                    {" "}Facebook
                  </a>
                </span>
              )}

              {athlete.socialLinks
                ?.youtube && (
                <span>
                  <a
                    href={
                      athlete.socialLinks
                        .youtube
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration:
                        "none"
                    }}
                  >
                    <FiYoutube />
                    {" "}YouTube
                  </a>
                </span>
              )}

              {!athlete.socialLinks
                ?.instagram &&
                !athlete.socialLinks
                  ?.facebook &&
                !athlete.socialLinks
                  ?.youtube && (
                  <p>
                    No social links added.
                  </p>
                )}

            </div>
          </section>

          {/* ======================================
              SHOWCASE
              IMPORTANT: PUBLIC PROFILE ONLY
          ====================================== */}

          {isPublicProfile && (
            <section className="profile-view-section">
              <h2>Showcase</h2>

              {showcaseLoading && (
                <p className="profile-bio">
                  Loading showcase posts...
                </p>
              )}

              {!showcaseLoading &&
                showcaseError && (
                  <div className="profile-error">
                    {showcaseError}
                  </div>
                )}

              {!showcaseLoading &&
                !showcaseError &&
                showcasePosts.length === 0 && (
                  <p className="profile-bio">
                    No showcase posts yet.
                  </p>
                )}

              {!showcaseLoading &&
                showcasePosts.length > 0 && (
                  <div className="athlete-showcase-grid">

                    {showcasePosts.map(
                      (post) => (
                        <div
                          className="athlete-showcase-card"
                          key={post._id}
                        >

                          {/* ==========================
                              MEDIA
                          ========================== */}

                          {post.media?.length > 0 && (
                            <div className="athlete-showcase-media">

                              {post.media.map(
                                (
                                  media,
                                  index
                                ) => (
                                  <div
                                    className="athlete-showcase-media-item"
                                    key={
                                      media.fileId ||
                                      index
                                    }
                                  >

                                    {media.type ===
                                    "video" ? (
                                      <video
                                        src={
                                          media.url
                                        }
                                        controls
                                        preload="metadata"
                                      />
                                    ) : (
                                      <img
                                        src={
                                          media.url
                                        }
                                        alt={
                                          post.caption ||
                                          "Athlete showcase"
                                        }
                                      />
                                    )}

                                  </div>
                                )
                              )}

                            </div>
                          )}

                          {/* ==========================
                              CAPTION + DATE
                          ========================== */}

                          {(post.caption ||
                            post.createdAt) && (
                            <div className="athlete-showcase-info">

                              {/* LEFT */}
                              {post.caption && (
                                <p className="athlete-showcase-caption">
                                  {post.caption}
                                </p>
                              )}

                              {/* RIGHT */}
                              {post.createdAt && (
                                <span className="athlete-showcase-date">
                                  {new Date(
                                    post.createdAt
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric"
                                    }
                                  )}
                                </span>
                              )}

                            </div>
                          )}

                        </div>
                      )
                    )}

                  </div>
                )}
            </section>
          )}

          {/* ======================================
              EDIT PROFILE
          ====================================== */}

          {!isPublicProfile && (
            <div className="profile-bottom-actions">
              <button
                className="bottom-edit-profile-btn"
                onClick={() =>
                  navigate(
                    "/athlete/profile?mode=edit"
                  )
                }
              >
                <FiEdit />
                Edit Athlete Profile
              </button>
            </div>
          )}

        </div>
      </main>

      {/* ==========================================
          RESUME MODAL
      ========================================== */}

      {!isPublicProfile &&
        showResumeModal && (
          <div
            className="resume-modal-overlay"
            onClick={() =>
              setShowResumeModal(false)
            }
          >
            <div
              className="resume-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="resume-modal-header">
                <div>
                  <span className="page-eyebrow">
                    ATHLYX
                  </span>

                  <h2>
                    Resume Preview
                  </h2>

                  <p>
                    Review your athlete
                    resume before
                    downloading it.
                  </p>
                </div>

                <button
                  type="button"
                  className="resume-modal-close"
                  onClick={() =>
                    setShowResumeModal(false)
                  }
                  aria-label="Close resume preview"
                >
                  <FiX />
                </button>
              </div>

              <div className="resume-preview">
                <PDFViewer
                  width="100%"
                  height="100%"
                  showToolbar={false}
                >
                  <AthleteResume
                    data={resumeData}
                  />
                </PDFViewer>
              </div>

              <div className="resume-modal-footer">

                <button
                  type="button"
                  className="resume-cancel-btn"
                  onClick={() =>
                    setShowResumeModal(false)
                  }
                >
                  Close
                </button>

                <PDFDownloadLink
                  document={
                    <AthleteResume
                      data={resumeData}
                    />
                  }
                  fileName={`${(
                    athlete.user?.name ||
                    "Athlete"
                  )
                    .replace(
                      /[^a-z0-9]/gi,
                      "-"
                    )
                    .toLowerCase()}-athlyx-resume.pdf`}
                  className="resume-download-btn"
                >
                  {({ loading }) =>
                    loading ? (
                      "Preparing PDF..."
                    ) : (
                      <>
                        <FiDownload />
                        Download as PDF
                      </>
                    )
                  }
                </PDFDownloadLink>

              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AthleteProfileView;