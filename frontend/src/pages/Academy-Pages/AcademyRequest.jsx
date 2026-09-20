import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiUser,
  FiCheck,
  FiX,
  FiClock
} from "react-icons/fi";

import AcademySidebar from "../../components/AcademySidebar";

const API = "http://localhost:5000/api";

const AcademyRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // ==================================================
  // FETCH ACADEMY REQUESTS
  // ==================================================

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", {
          replace: true
        });
        return;
      }

      const response = await axios.get(
        `${API}/connections/academy/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "ACADEMY REQUESTS RESPONSE:",
        response.data
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
        "Failed to fetch academy requests:",
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
        "Failed to load connection requests."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // GET REQUESTING USER
  // ==================================================

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

  // ==================================================
  // ACCEPT / REJECT
  // ==================================================

  const handleRequest = async (
    connectionId,
    action
  ) => {
    try {
      setActionLoading(connectionId);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", {
          replace: true
        });
        return;
      }

      const response = await axios.put(
        `${API}/connections/academy/respond/${connectionId}`,
        {
          action
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "ACADEMY REQUEST RESPONSE:",
        response.data
      );

      // Remove processed request
      setRequests((previousRequests) =>
        previousRequests.filter(
          (request) =>
            request._id !== connectionId
        )
      );

    } catch (error) {
      console.error(
        "Failed to respond to academy request:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to update connection request."
      );

    } finally {
      setActionLoading(null);
    }
  };

  // ==================================================
  // VIEW PROFILE
  // ==================================================

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

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="athlete-profile-view-page">

        <AcademySidebar />

        <main className="athlete-profile-view-content">

          <div className="profile-view-container">

            <div className="page-heading">

              <span className="page-eyebrow">
                CONNECTIONS
              </span>

              <h1>
                Requests
              </h1>

            </div>

            <section className="profile-view-section">

              <h2>
                Loading Requests
              </h2>

              <p className="profile-bio">
                Please wait while we load
                your connection requests.
              </p>

            </section>

          </div>

        </main>

      </div>
    );
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="athlete-profile-view-page">

      <AcademySidebar />

      <main className="athlete-profile-view-content">

        <div className="profile-view-container">

          {/* =========================================
              HEADER
          ========================================= */}

          <div className="page-heading profile-page-heading">

            <div>

              <span className="page-eyebrow">
                CONNECTIONS
              </span>

              <h1>
                Requests
              </h1>

            </div>

            <div>

              <span className="page-eyebrow">
                {requests.length} Pending
              </span>

            </div>

          </div>

          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {/* =========================================
              NO REQUESTS
          ========================================= */}

          {requests.length === 0 && !error && (
            <section className="profile-view-section">

              <div className="academy-requests-empty">

                <FiClock
                  size={42}
                  className="academy-requests-empty-icon"
                />

                <h2>
                  No Pending Requests
                </h2>

                <p className="profile-bio">
                  You don't have any connection
                  requests right now.
                </p>

              </div>

            </section>
          )}

          {/* =========================================
              REQUEST LIST
          ========================================= */}

          {requests.length > 0 && (

            <section className="profile-view-section">

              <h2>
                Pending Requests
              </h2>

              <div className="academy-request-list">

                {requests.map((request) => {

                  const {
                    user,
                    type
                  } = getRequester(request);

                  const isLoading =
                    actionLoading ===
                    request?._id;

                  return (
                    <div
                      key={request?._id}
                      className="academy-request-card"
                    >

                      {/* =================================
                          USER INFO
                      ================================= */}

                      <div className="academy-request-user">

                        <div className="profile-view-photo academy-request-photo">

                          {user?.profilePic ? (

                            <img
                              src={user.profilePic}
                              alt={
                                user.name ||
                                type
                              }
                            />

                          ) : (

                            <div className="profile-view-placeholder">
                              <FiUser />
                            </div>

                          )}

                        </div>

                        <div className="academy-request-user-info">

                          <h3>
                            {user?.name ||
                              type}
                          </h3>

                          <p>
                            {user?.email ||
                              "No email available"}
                          </p>

                          <span>
                            {type} wants to connect
                            with you
                          </span>

                        </div>

                      </div>

                      {/* =================================
                          ACTIONS
                      ================================= */}

                      <div className="academy-request-actions">

                       

                        {/* ACCEPT */}

                        <button
                          type="button"
                          className="connection-accept-btn"
                          onClick={() =>
                            handleRequest(
                              request._id,
                              "accepted"
                            )
                          }
                          disabled={isLoading}
                        >
                          <FiCheck />

                          {isLoading
                            ? "..."
                            : "Accept"}
                        </button>

                        {/* REJECT */}

                        <button
                          type="button"
                          className="connection-reject-btn"
                          onClick={() =>
                            handleRequest(
                              request._id,
                              "rejected"
                            )
                          }
                          disabled={isLoading}
                        >
                          <FiX />

                          {isLoading
                            ? "..."
                            : "Reject"}
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>

            </section>
          )}

        </div>

      </main>

    </div>
  );
};

export default AcademyRequests;