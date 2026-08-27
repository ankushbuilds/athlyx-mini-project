import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FiUser,
  FiCheck,
  FiX,
  FiClock
} from "react-icons/fi";

import CoachSidebar from "../../components/CoachSidebar";

const API = "http://localhost:5000/api";

const CoachRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // ==================================================
  // FETCH COACH REQUESTS
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
        `${API}/connections/coach/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "COACH REQUESTS RESPONSE:",
        response.data
      );

      const incomingRequests =
        Array.isArray(response.data?.requests)
          ? response.data.requests
          : [];

      console.log(
        "ATHLETE REQUESTS:",
        incomingRequests
      );

      setRequests(incomingRequests);
    } catch (error) {
      console.error(
        "Failed to fetch coach requests:",
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
  // ACCEPT / REJECT REQUEST
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
        `${API}/connections/coach/respond/${connectionId}`,
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
        "REQUEST RESPONSE:",
        response.data
      );

      // Remove from pending requests
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
          "Failed to update connection request."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="athlete-profile-view-page">

        <CoachSidebar />

        <main className="athlete-profile-view-content">

          <div className="profile-view-container">

            <div className="page-heading">

              <span className="page-eyebrow">
                CONNECTIONS
              </span>

              <h1>
                Athlete Requests
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

      <CoachSidebar />

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
                Athlete Requests
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

              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px"
                }}
              >

                <FiClock
                  size={42}
                  style={{
                    marginBottom: "15px"
                  }}
                />

                <h2>
                  No Pending Requests
                </h2>

                <p className="profile-bio">
                  You don't have any athlete
                  connection requests right now.
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >

                {requests.map((request) => {

                  const athlete =
                    request?.athlete;

                  const isLoading =
                    actionLoading ===
                    request?._id;

                  return (
                    <div
                      key={request?._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "space-between",
                        gap: "20px",
                        padding: "20px",
                        border:
                          "1px solid var(--app-border)",
                        borderRadius: "12px",
                        background:
                          "var(--app-card)"
                      }}
                    >

                      {/* =================================
                          ATHLETE INFO
                      ================================= */}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          minWidth: 0
                        }}
                      >

                        <div
                          className="profile-view-photo"
                          style={{
                            width: "60px",
                            height: "60px",
                            minWidth: "60px"
                          }}
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
                            />

                          ) : (

                            <div className="profile-view-placeholder">
                              <FiUser />
                            </div>

                          )}

                        </div>

                        <div
                          style={{
                            minWidth: 0
                          }}
                        >

                          <h3
                            style={{
                              margin: 0
                            }}
                          >
                            {athlete?.name ||
                              "Athlete"}
                          </h3>

                          <p
                            style={{
                              margin:
                                "5px 0 0"
                            }}
                          >
                            {athlete?.email ||
                              "No email available"}
                          </p>

                          <span
                            style={{
                              fontSize: "13px"
                            }}
                          >
                            Wants to connect
                            with you
                          </span>

                        </div>

                      </div>

                      {/* =================================
                          ACTIONS
                      ================================= */}

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexShrink: 0
                        }}
                      >

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

export default CoachRequests;