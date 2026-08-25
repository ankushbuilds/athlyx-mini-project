import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiUsers,
  FiCheck,
  FiX,
  FiClock,
  FiMapPin,
  FiAward
} from "react-icons/fi";
import AthleteSidebar from "../../components/AthleteSidebar";

const API = "http://localhost:5000/api";

const AthleteConnections = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchConnectionRequests = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectionRequests();
  }, []);

  const handleRequest = async (connectionId, action) => {
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

      setRequests((prevRequests) =>
        prevRequests.filter(
          (request) => request._id !== connectionId
        )
      );

      setSuccessMessage(
        response.data.message ||
          `Connection request ${action}.`
      );
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

  const formatDate = (date) => {
    if (!date) {
      return "";
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

  return (
    <div className="athlete-profile-view-page">
      <AthleteSidebar />

      <main className="athlete-profile-view-content">
        <div className="profile-view-container">
          <div className="page-heading">
            <div>
              <span className="page-eyebrow">
                ATHLYX
              </span>

              <h1>Connections</h1>

              <p>
                Manage connection requests from coaches.
              </p>
            </div>
          </div>

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="profile-view-section">
              <div className="availability-status">
                <FiCheck />
                {successMessage}
              </div>
            </div>
          )}

          {loading ? (
            <section className="profile-view-section">
              <h2>Loading Connections</h2>

              <p className="profile-bio">
                Please wait while we load your
                connection requests.
              </p>
            </section>
          ) : requests.length === 0 ? (
            <section className="profile-view-section">
              <h2>Connection Requests</h2>

              <div className="availability-status">
                <FiUsers />
                No pending connection requests.
              </div>
            </section>
          ) : (
            <section className="profile-view-section">
              <div className="connections-heading">
                <div>
                  <h2>Pending Requests</h2>

                  <p className="profile-bio">
                    Coaches who want to connect with you.
                  </p>
                </div>

                <span className="connections-count">
                  {requests.length}
                </span>
              </div>

              <div className="connections-list">
                {requests.map((request) => {
                  const coach = request.coach;

                  return (
                    <div
                      className="connection-card"
                      key={request._id}
                    >
                      <div className="connection-card-info">
                        <div className="profile-view-photo connection-photo">
                          {coach?.profilePic ? (
                            <img
                              src={coach.profilePic}
                              alt={
                                coach.name || "Coach"
                              }
                            />
                          ) : (
                            <div className="profile-view-placeholder">
                              <FiUsers />
                            </div>
                          )}
                        </div>

                        <div className="profile-view-user-info">
                          <h2>
                            {coach?.name || "Coach"}
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

                      <div className="connection-actions">
                        <button
                          type="button"
                          className="connection-reject-btn"
                          disabled={
                            respondingId === request._id
                          }
                          onClick={() =>
                            handleRequest(
                              request._id,
                              "rejected"
                            )
                          }
                        >
                          <FiX />

                          {respondingId === request._id
                            ? "Processing..."
                            : "Reject"}
                        </button>

                        <button
                          type="button"
                          className="connection-accept-btn"
                          disabled={
                            respondingId === request._id
                          }
                          onClick={() =>
                            handleRequest(
                              request._id,
                              "accepted"
                            )
                          }
                        >
                          <FiCheck />

                          {respondingId === request._id
                            ? "Processing..."
                            : "Accept"}
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

export default AthleteConnections;