import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiUsers,
  FiCheck,
  FiX,
  FiMapPin,
  FiAward
} from "react-icons/fi";
import AcademySidebar from "../../components/AcademySidebar";

const API = "http://localhost:5000/api";

const AcademyRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingId, setProcessingId] = useState("");

  // ==========================================
  // LOAD REQUESTS
  // ==========================================

  useEffect(() => {
    loadRequests();
  }, []);

  // ==========================================
  // LOAD ACADEMY REQUESTS
  // ==========================================

  const loadRequests = async () => {
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
        `${API}/connections/academy/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const incomingRequests =
        Array.isArray(response.data?.requests)
          ? response.data.requests
          : Array.isArray(response.data?.connections)
            ? response.data.connections
            : [];

      setRequests(incomingRequests);

    } catch (error) {
      console.error(
        "Failed to load academy requests:",
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
          "Failed to load requests."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET REQUESTING USER
  // ==========================================

  const getRequester = (request) => {
    if (request?.athlete) {
      return {
        user: request.athlete,
        type: "Athlete"
      };
    }

    if (request?.coach) {
      return {
        user: request.coach,
        type: "Coach"
      };
    }

    return {
      user: null,
      type: "User"
    };
  };

  // ==========================================
  // NAME
  // ==========================================

  const getName = (user) => {
    return (
      user?.name ||
      "User"
    );
  };

  // ==========================================
  // PROFILE PIC
  // ==========================================

  const getProfilePic = (user) => {
    return user?.profilePic || "";
  };

  // ==========================================
  // SPORT
  // ==========================================

  const getSport = (user, type) => {
    if (type === "Athlete") {
      return user?.sport || "Athlete";
    }

    return user?.sport || "Coach";
  };

  // ==========================================
  // LOCATION
  // ==========================================

  const getLocation = (user) => {
    const city =
      user?.address?.city ||
      "";

    const state =
      user?.address?.state ||
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

  // ==========================================
  // ACCEPT / REJECT
  // ==========================================

  const handleResponse = async (
    connectionId,
    status
  ) => {
    const token = localStorage.getItem("token");

    if (!token || !connectionId) {
      return;
    }

    try {
      setProcessingId(connectionId);

      await axios.put(
        `${API}/connections/academy/respond/${connectionId}`,
        {
          status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRequests((previousRequests) =>
        previousRequests.filter(
          (request) =>
            request._id !== connectionId
        )
      );

    } catch (error) {
      console.error(
        "Failed to respond to request:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update request."
      );

    } finally {
      setProcessingId("");
    }
  };

  // ==========================================
  // VIEW PROFILE
  // ==========================================

  const handleViewProfile = (
    request,
    type
  ) => {
    const user =
      type === "Athlete"
        ? request?.athlete
        : request?.coach;

    if (!user?._id) {
      return;
    }

    navigate(
      `/profile/${type.toLowerCase()}/${user._id}`
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="coach-athletes-page">

      <AcademySidebar />

      <main className="coach-athletes-content">

        <div className="coach-athletes-container">

          {/* ======================================
              HEADER
          ====================================== */}

          <div className="coach-athletes-header">

            <div>

              <span className="coach-athletes-eyebrow">
                CONNECTION REQUESTS
              </span>

              <h1>
                Requests
              </h1>

              <p>
                Manage connection requests from
                athletes and coaches.
              </p>

            </div>

            {!loading && !error && (
              <div className="coach-athletes-count">

                <span>
                  {requests.length}
                </span>

                <small>
                  {requests.length === 1
                    ? "Request"
                    : "Requests"}
                </small>

              </div>
            )}

          </div>

          {/* ======================================
              ERROR
          ====================================== */}

          {error && (
            <div className="coach-athletes-error">
              {error}
            </div>
          )}

          {/* ======================================
              LOADING
          ====================================== */}

          {loading && (
            <div className="coach-athletes-loading">

              <div className="loading-spinner"></div>

              <h2>
                Loading Requests
              </h2>

              <p>
                Fetching your connection requests.
              </p>

            </div>
          )}

          {/* ======================================
              EMPTY
          ====================================== */}

          {!loading &&
            !error &&
            requests.length === 0 && (
              <div className="coach-athletes-empty">

                <div className="empty-icon">
                  <FiUsers size={30} />
                </div>

                <h2>
                  No Pending Requests
                </h2>

                <p>
                  New connection requests from
                  athletes or coaches will appear
                  here.
                </p>

              </div>
            )}

          {/* ======================================
              REQUEST GRID
          ====================================== */}

          {!loading &&
            !error &&
            requests.length > 0 && (

              <div className="coach-athletes-grid">

                {requests.map((request) => {

                  const {
                    user,
                    type
                  } = getRequester(request);

                  const profilePic =
                    getProfilePic(user);

                  const isProcessing =
                    processingId === request._id;

                  return (
                    <div
                      key={request._id}
                      className="coach-athlete-card"
                    >

                      {/* ==================================
                          CARD TOP
                      ================================== */}

                      <div className="athlete-card-top">

                        <div className="athlete-avatar">

                          {profilePic ? (
                            <img
                              src={profilePic}
                              alt={getName(user)}
                            />
                          ) : (
                            <FiUser size={25} />
                          )}

                        </div>

                        <div className="athlete-card-status pending">

                          <span></span>

                          Pending

                        </div>

                      </div>

                      {/* ==================================
                          USER INFO
                      ================================== */}

                      <div className="athlete-card-info">

                        <h3>
                          {getName(user)}
                        </h3>

                        <p className="athlete-position">
                          {type}
                        </p>

                      </div>

                      {/* ==================================
                          DETAILS
                      ================================== */}

                      <div className="athlete-card-details">

                        <div className="athlete-detail">

                          <FiAward size={16} />

                          <span>
                            {getSport(
                              user,
                              type
                            )}
                          </span>

                        </div>

                        <div className="athlete-detail">

                          <FiMapPin size={16} />

                          <span>
                            {getLocation(user)}
                          </span>

                        </div>

                      </div>

                      {/* ==================================
                          REQUEST ACTIONS
                      ================================== */}

                      <div className="athlete-card-footer">

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            handleViewProfile(
                              request,
                              type
                            )
                          }
                        >
                          View Profile
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            handleResponse(
                              request._id,
                              "rejected"
                            )
                          }
                          title="Reject request"
                        >
                          <FiX size={17} />
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            handleResponse(
                              request._id,
                              "accepted"
                            )
                          }
                          title="Accept request"
                        >
                          <FiCheck size={17} />
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </div>

      </main>

    </div>
  );
};

export default AcademyRequests;