import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiUsers,
  FiCheck,
  FiX,
  FiClock,
  FiMapPin,
  FiAward,
  FiUser,
  FiTrash2
} from "react-icons/fi";
import AthleteSidebar from "../../components/AthleteSidebar";

const API = "http://localhost:5000/api";

const AthleteConnections = () => {
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);

  const [respondingId, setRespondingId] = useState(null);
  const [disconnectingId, setDisconnectingId] = useState(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================
  // AUTH CONFIG
  // ==========================================

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // ==========================================
  // FETCH PENDING COACH REQUESTS
  // ==========================================

  const fetchConnectionRequests = async () => {
    try {
      setLoadingRequests(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        `${API}/connections/athlete/requests`,
        getAuthConfig()
      );

      setRequests(response.data.requests || []);
    } catch (error) {
      console.error(
        "Fetch connection requests error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError("Session expired. Please login again.");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load connection requests."
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  // ==========================================
  // FETCH ACCEPTED COACH CONNECTIONS
  // ==========================================

  const fetchConnections = async () => {
    try {
      setLoadingConnections(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        `${API}/connections/athlete/coaches`,
        getAuthConfig()
      );

      setConnections(response.data.connections || []);
    } catch (error) {
      console.error(
        "Fetch connected coaches error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError("Session expired. Please login again.");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load your connected coaches."
      );
    } finally {
      setLoadingConnections(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchConnectionRequests();
    fetchConnections();
  }, []);

  // ==========================================
  // ACCEPT / REJECT REQUEST
  // ==========================================

  const handleRequest = async (
    connectionId,
    action
  ) => {
    try {
      setRespondingId(connectionId);
      setError("");
      setSuccessMessage("");

      const response = await axios.put(
        `${API}/connections/athlete/respond/${connectionId}`,
        {
          action
        },
        getAuthConfig()
      );

      // Remove request from pending list
      setRequests((prevRequests) =>
        prevRequests.filter(
          (request) =>
            request._id !== connectionId
        )
      );

      if (action === "accepted") {
        setSuccessMessage(
          response.data.message ||
            "Connection request accepted successfully."
        );

        // Refresh connected coaches
        await fetchConnections();
      } else {
        setSuccessMessage(
          response.data.message ||
            "Connection request rejected."
        );
      }
    } catch (error) {
      console.error(
        "Respond to connection request error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to respond to connection request."
      );
    } finally {
      setRespondingId(null);
    }
  };

  // ==========================================
  // DISCONNECT COACH
  // ==========================================

  const handleDisconnect = async (
    connectionId
  ) => {
    try {
      setDisconnectingId(connectionId);
      setError("");
      setSuccessMessage("");

      const response = await axios.delete(
        `${API}/connections/disconnect/${connectionId}`,
        getAuthConfig()
      );

      // Remove connection from UI
      setConnections((prevConnections) =>
        prevConnections.filter(
          (connection) =>
            connection._id !== connectionId
        )
      );

      setSuccessMessage(
        response.data.message ||
          "Coach disconnected successfully."
      );
    } catch (error) {
      console.error(
        "Disconnect coach error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to disconnect coach."
      );
    } finally {
      setDisconnectingId(null);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="athlete-profile-view-page">

      <AthleteSidebar />

      <main className="athlete-profile-view-content">

        <div className="profile-view-container">

          {/* ==========================================
              PAGE HEADING
          ========================================== */}

          <div className="page-heading">

            <div>

              <span className="page-eyebrow">
                ATHLYX
              </span>

              <h1>Connections</h1>

              <p>
                Manage your connections with coaches.
              </p>

            </div>

          </div>

          {/* ==========================================
              ERROR MESSAGE
          ========================================== */}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {/* ==========================================
              SUCCESS MESSAGE
          ========================================== */}

          {successMessage && (
            <div className="profile-view-section">

              <div className="availability-status">

                <FiCheck />

                {successMessage}

              </div>

            </div>
          )}

          {/* ==========================================
              PENDING COACH REQUESTS
          ========================================== */}

          <section className="profile-view-section">

            <div className="connections-heading">

              <div>

                <h2>
                  Pending Requests
                </h2>

                <p className="profile-bio">
                  Coaches who want to connect
                  with you.
                </p>

              </div>

              <span className="connections-count">
                {requests.length}
              </span>

            </div>

            {loadingRequests ? (

              <div className="availability-status">

                <FiClock />

                Loading connection requests...

              </div>

            ) : requests.length === 0 ? (

              <div className="availability-status">

                <FiUsers />

                No pending coach requests.

              </div>

            ) : (

              <div className="connections-list">

                {requests.map((request) => {

                  const coach = request.coach;

                  return (
                    <div
                      className="connection-card"
                      key={request._id}
                    >

                      {/* ==========================================
                          COACH INFORMATION
                      ========================================== */}

                      <div className="connection-card-info">

                        <div className="profile-view-photo connection-photo">

                          {coach?.profilePic ? (

                            <img
                              src={coach.profilePic}
                              alt={
                                coach.name ||
                                "Coach"
                              }
                            />

                          ) : (

                            <div className="profile-view-placeholder">

                              <FiUser />

                            </div>

                          )}

                        </div>

                        <div className="profile-view-user-info">

                          <h2>
                            {coach?.name ||
                              "Coach"}
                          </h2>

                          <p>
                            {coach?.sport ||
                              coach?.specialization ||
                              "Coach"}
                          </p>

                          {coach?.organization && (
                            <span>
                              {coach.organization}
                            </span>
                          )}

                          <div className="connection-meta">

                            {coach?.experience !==
                              undefined && (

                              <span>

                                <FiAward />

                                {coach.experience}{" "}

                                {coach.experience === 1
                                  ? "Year"
                                  : "Years"}{" "}

                                Experience

                              </span>

                            )}

                            {request.createdAt && (

                              <span>

                                <FiClock />

                                {formatDate(
                                  request.createdAt
                                )}

                              </span>

                            )}

                            {coach?.address?.city && (

                              <span>

                                <FiMapPin />

                                {coach.address.city}

                              </span>

                            )}

                          </div>

                        </div>

                      </div>

                      {/* ==========================================
                          REQUEST ACTIONS
                      ========================================== */}

                      <div className="connection-actions">

                        <button
                          type="button"
                          className="connection-reject-btn"
                          disabled={
                            respondingId ===
                            request._id
                          }
                          onClick={() =>
                            handleRequest(
                              request._id,
                              "rejected"
                            )
                          }
                        >

                          <FiX />

                          {respondingId ===
                          request._id
                            ? "Processing..."
                            : "Reject"}

                        </button>

                        <button
                          type="button"
                          className="connection-accept-btn"
                          disabled={
                            respondingId ===
                            request._id
                          }
                          onClick={() =>
                            handleRequest(
                              request._id,
                              "accepted"
                            )
                          }
                        >

                          <FiCheck />

                          {respondingId ===
                          request._id
                            ? "Processing..."
                            : "Accept"}

                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>

            )}

          </section>

          {/* ==========================================
              MY CONNECTED COACHES
          ========================================== */}

          <section className="profile-view-section">

            <div className="connections-heading">

              <div>

                <h2>
                  My Coaches
                </h2>

                <p className="profile-bio">
                  Coaches you are currently
                  connected with.
                </p>

              </div>

              <span className="connections-count">
                {connections.length}
              </span>

            </div>

            {loadingConnections ? (

              <div className="availability-status">

                <FiClock />

                Loading your coaches...

              </div>

            ) : connections.length === 0 ? (

              <div className="availability-status">

                <FiUsers />

                You don't have any connected
                coaches yet.

              </div>

            ) : (

              <div className="connections-list">

                {connections.map((connection) => {

                  const coach =
                    connection.coach;

                  return (
                    <div
                      className="connection-card"
                      key={connection._id}
                    >

                      {/* ==========================================
                          COACH INFORMATION
                      ========================================== */}

                      <div className="connection-card-info">

                        <div className="profile-view-photo connection-photo">

                          {coach?.profilePic ? (

                            <img
                              src={coach.profilePic}
                              alt={
                                coach.name ||
                                "Coach"
                              }
                            />

                          ) : (

                            <div className="profile-view-placeholder">

                              <FiUser />

                            </div>

                          )}

                        </div>

                        <div className="profile-view-user-info">

                          <h2>
                            {coach?.name ||
                              "Coach"}
                          </h2>

                          <p>
                            Coach
                          </p>

                          {coach?.sport && (

                            <span>
                              {coach.sport}
                            </span>

                          )}

                          {coach?.specialization &&
                            !coach?.sport && (

                            <span>
                              {coach.specialization}
                            </span>

                          )}

                          {coach?.organization && (

                            <span>
                              {coach.organization}
                            </span>

                          )}

                          <div className="connection-meta">

                            {coach?.experience !==
                              undefined && (

                              <span>

                                <FiAward />

                                {coach.experience}{" "}

                                {coach.experience === 1
                                  ? "Year"
                                  : "Years"}{" "}

                                Experience

                              </span>

                            )}

                            {coach?.address?.city && (

                              <span>

                                <FiMapPin />

                                {coach.address.city}

                              </span>

                            )}

                            {connection.updatedAt && (

                              <span>

                                <FiCheck />

                                Connected{" "}

                                {formatDate(
                                  connection.updatedAt
                                )}

                              </span>

                            )}

                          </div>

                        </div>

                      </div>

                      {/* ==========================================
                          ONLY DISCONNECT BUTTON
                      ========================================== */}

                      <div className="connection-actions">

                        <button
                          type="button"
                          className="connection-reject-btn"
                          disabled={
                            disconnectingId ===
                            connection._id
                          }
                          onClick={() =>
                            handleDisconnect(
                              connection._id
                            )
                          }
                        >

                          <FiTrash2 />

                          {disconnectingId ===
                          connection._id
                            ? "Removing..."
                            : "Disconnect"}

                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
};

export default AthleteConnections;