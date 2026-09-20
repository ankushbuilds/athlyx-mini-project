
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
  // =========================================================
  // STATES
  // =========================================================

  // Coach requests
  const [requests, setRequests] = useState([]);

  // Academy requests
  const [academyRequests, setAcademyRequests] = useState([]);

  // Connected coaches
  const [connections, setConnections] = useState([]);

  // Connected academies
  const [academyConnections, setAcademyConnections] = useState([]);

  // Loading states
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [loadingAcademyConnections, setLoadingAcademyConnections] =
    useState(true);

  // Action states
  const [respondingId, setRespondingId] = useState(null);
  const [disconnectingId, setDisconnectingId] = useState(null);

  // Messages
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =========================================================
  // AUTH CONFIG
  // =========================================================

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // =========================================================
  // FETCH CONNECTION REQUESTS
  // =========================================================

  const fetchConnectionRequests = async () => {
    try {
      setLoadingRequests(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const config = getAuthConfig();

      // -------------------------------------------------------
      // COACH REQUESTS
      // -------------------------------------------------------

      const coachResponse = await axios.get(
        `${API}/connections/athlete/requests`,
        config
      );

      // -------------------------------------------------------
      // ACADEMY REQUESTS
      // -------------------------------------------------------

      const academyResponse = await axios.get(
        `${API}/connections/athlete/academy-requests`,
        config
      );

      setRequests(coachResponse.data?.requests || []);

      setAcademyRequests(
        academyResponse.data?.requests || []
      );
    } catch (error) {
      console.error(
        "Fetch connection requests error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Session expired. Please login again."
        );

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

  // =========================================================
  // FETCH CONNECTED COACHES
  // =========================================================

  const fetchConnections = async () => {
    try {
      setLoadingConnections(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        `${API}/connections/athlete/coaches`,
        getAuthConfig()
      );

      console.log(
        "CONNECTED COACHES RESPONSE:",
        response.data
      );

      const coachData =
        response.data?.connections ||
        response.data?.data ||
        [];

      setConnections(coachData);
    } catch (error) {
      console.error(
        "Fetch connected coaches error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Session expired. Please login again."
        );

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

  // =========================================================
  // FETCH CONNECTED ACADEMIES
  // =========================================================

  const fetchAcademyConnections = async () => {
    try {
      setLoadingAcademyConnections(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        `${API}/connections/athlete/academies`,
        getAuthConfig()
      );

      console.log(
        "CONNECTED ACADEMIES RESPONSE:",
        response.data
      );

      // -------------------------------------------------------
      // Get connections from backend
      // -------------------------------------------------------

      const academyData =
        response.data?.connections ||
        response.data?.data ||
        [];

      // -------------------------------------------------------
      // Normalize academy connection structure
      //
      // Supported:
      // connection.academy
      // connection.academyProfile
      // connection.user
      // -------------------------------------------------------

      const normalizedAcademies = academyData
        .map((connection) => {
          if (!connection) {
            return null;
          }

          const academy =
            connection?.academy ||
            connection?.academyProfile ||
            connection?.user ||
            null;

          if (!academy) {
            console.warn(
              "Academy connection has no academy object:",
              connection
            );

            return null;
          }

          return {
            ...connection,
            academy
          };
        })
        .filter(Boolean);

      console.log(
        "NORMALIZED ACADEMY CONNECTIONS:",
        normalizedAcademies
      );

      setAcademyConnections(
        normalizedAcademies
      );
    } catch (error) {
      console.error(
        "Fetch connected academies error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Session expired. Please login again."
        );

        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load your connected academies."
      );
    } finally {
      setLoadingAcademyConnections(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchConnectionRequests();
    fetchConnections();
    fetchAcademyConnections();
  }, []);

  // =========================================================
  // ACCEPT / REJECT REQUEST
  // =========================================================

  const handleRequest = async (
    connectionId,
    action
  ) => {
    try {
      setRespondingId(connectionId);
      setError("");
      setSuccessMessage("");

      // -------------------------------------------------------
      // Find request BEFORE changing state
      // -------------------------------------------------------

      const coachRequest = requests.find(
        (request) =>
          request._id === connectionId
      );

      const academyRequest = academyRequests.find(
        (request) =>
          request._id === connectionId
      );

      // -------------------------------------------------------
      // API CALL
      // -------------------------------------------------------

      const response = await axios.put(
        `${API}/connections/athlete/respond/${connectionId}`,
        {
          action
        },
        getAuthConfig()
      );

      console.log(
        "RESPOND CONNECTION RESPONSE:",
        response.data
      );

      // =======================================================
      // ACCEPTED
      // =======================================================

      if (action === "accepted") {
        setSuccessMessage(
          response.data?.message ||
            "Connection request accepted successfully."
        );

        // -----------------------------------------------------
        // Remove request from pending requests immediately
        // -----------------------------------------------------

        setRequests((prevRequests) =>
          prevRequests.filter(
            (request) =>
              request._id !== connectionId
          )
        );

        setAcademyRequests((prevRequests) =>
          prevRequests.filter(
            (request) =>
              request._id !== connectionId
          )
        );

        // =====================================================
        // ACADEMY ACCEPTED
        // =====================================================

        if (academyRequest) {
          console.log(
            "Academy connection accepted."
          );

          /*
           * IMPORTANT:
           *
           * Do NOT manually create an academy connection here.
           *
           * Backend is the source of truth.
           *
           * After accepting the request, fetch the
           * accepted academy connections again.
           */

          await fetchAcademyConnections();

          return;
        }

        // =====================================================
        // COACH ACCEPTED
        // =====================================================

        if (coachRequest) {
          console.log(
            "Coach connection accepted."
          );

          await fetchConnections();

          return;
        }

        // =====================================================
        // FALLBACK
        // =====================================================

        await fetchConnectionRequests();
        await fetchConnections();
        await fetchAcademyConnections();

        return;
      }

      // =======================================================
      // REJECTED
      // =======================================================

      if (action === "rejected") {
        setRequests((prevRequests) =>
          prevRequests.filter(
            (request) =>
              request._id !== connectionId
          )
        );

        setAcademyRequests((prevRequests) =>
          prevRequests.filter(
            (request) =>
              request._id !== connectionId
          )
        );

        setSuccessMessage(
          response.data?.message ||
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

  // =========================================================
  // DISCONNECT CONNECTION
  // =========================================================

  const handleDisconnect = async (
    connectionId,
    type
  ) => {
    try {
      setDisconnectingId(connectionId);
      setError("");
      setSuccessMessage("");

      const response = await axios.delete(
        `${API}/connections/disconnect/${connectionId}`,
        getAuthConfig()
      );

      // -------------------------------------------------------
      // COACH
      // -------------------------------------------------------

      if (type === "coach") {
        setConnections(
          (prevConnections) =>
            prevConnections.filter(
              (connection) =>
                connection._id !== connectionId
            )
        );

        setSuccessMessage(
          response.data?.message ||
            "Coach disconnected successfully."
        );
      }

      // -------------------------------------------------------
      // ACADEMY
      // -------------------------------------------------------

      if (type === "academy") {
        setAcademyConnections(
          (prevConnections) =>
            prevConnections.filter(
              (connection) =>
                connection._id !== connectionId
            )
        );

        setSuccessMessage(
          response.data?.message ||
            "Academy disconnected successfully."
        );
      }
    } catch (error) {
      console.error(
        "Disconnect connection error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to disconnect connection."
      );
    } finally {
      setDisconnectingId(null);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
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

  // =========================================================
  // TOTAL PENDING REQUESTS
  // =========================================================

  const totalPendingRequests =
    requests.length +
    academyRequests.length;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="athlete-profile-view-page">

      <AthleteSidebar />

      <main className="athlete-profile-view-content">

        <div className="profile-view-container">

          {/* =================================================
              PAGE HEADING
          ================================================= */}

          <div className="page-heading">

            <div>

              <span className="page-eyebrow">
                ATHLYX
              </span>

              <h1>
                Connections
              </h1>

              <p>
                Manage your connections with
                coaches and academies.
              </p>

            </div>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {successMessage && (
            <div className="profile-view-section">

              <div className="availability-status">

                <FiCheck />

                {successMessage}

              </div>

            </div>
          )}

          {/* =================================================
              PENDING REQUESTS
          ================================================= */}

          <section className="profile-view-section">

            <div className="connections-heading">

              <div>

                <h2>
                  Pending Requests
                </h2>

                <p className="profile-bio">
     Coaches and Academies who want
                  to connect with you.
                </p>

              </div>

              <span className="connections-count">
                {totalPendingRequests}
              </span>

            </div>

            {loadingRequests ? (

              <div className="availability-status">

                <FiClock />

                Loading connection requests...

              </div>

            ) : totalPendingRequests === 0 ? (

              <div className="availability-status">

                <FiUsers />

                No pending connection requests.

              </div>

            ) : (

              <div className="connections-list">

                {/* =================================================
                    COACH REQUESTS
                ================================================= */}

                {requests.map((request) => {

                  const coach =
                    request?.coach;

                  return (
                    <div
                      className="connection-card"
                      key={request._id}
                    >

                      <div className="connection-card-info">

                        <div className="profile-view-photo connection-photo">

                          {coach?.profilePic ? (

                            <img
                              src={
                                coach.profilePic
                              }
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
                                {
                                  coach.specialization
                                }
                              </span>
                            )}

                          {coach?.organization && (
                            <span>
                              {
                                coach.organization
                              }
                            </span>
                          )}

                          <div className="connection-meta">

                            {coach?.experience !==
                              undefined && (

                              <span>

                                <FiAward />

                                {
                                  coach.experience
                                }{" "}

                                {coach.experience ===
                                1
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

                                {
                                  coach.address.city
                                }

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

                {/* =================================================
                    ACADEMY REQUESTS
                ================================================= */}

                {academyRequests.map((request) => {

                  const academy =
                    request?.academy;

                  return (
                    <div
                      className="connection-card"
                      key={request._id}
                    >

                      <div className="connection-card-info">

                        <div className="profile-view-photo connection-photo">

                          {academy?.profilePic ? (

                            <img
                              src={
                                academy.profilePic
                              }
                              alt={
                                academy.name ||
                                academy.academyName ||
                                "Academy"
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
                            {academy?.academyName ||
                              academy?.name ||
                              "Academy"}
                          </h2>

                          <p>
                            Academy
                          </p>

                          {academy?.sport && (
                            <span>
                              {academy.sport}
                            </span>
                          )}

                          {academy?.specialization && (
                            <span>
                              {
                                academy.specialization
                              }
                            </span>
                          )}

                          {(academy?.city ||
                            academy?.address?.city) && (
                            <span>
                              {academy?.city ||
                                academy?.address?.city}
                            </span>
                          )}

                          <div className="connection-meta">

                            {academy?.establishedYear && (

                              <span>

                                <FiAward />

                                Established{" "}

                                {
                                  academy.establishedYear
                                }

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

                            {academy?.address?.city && (

                              <span>

                                <FiMapPin />

                                {
                                  academy.address.city
                                }

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

          {/* =================================================
              MY COACHES
          ================================================= */}

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
                    connection?.coach;

                  if (!coach) {
                    return null;
                  }

                  return (
                    <div
                      className="connection-card"
                      key={connection._id}
                    >

                      <div className="connection-card-info">

                        <div className="profile-view-photo connection-photo">

                          {coach?.profilePic ? (

                            <img
                              src={
                                coach.profilePic
                              }
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
                                {
                                  coach.specialization
                                }
                              </span>
                            )}

                          {coach?.organization && (
                            <span>
                              {
                                coach.organization
                              }
                            </span>
                          )}

                          <div className="connection-meta">

                            {coach?.experience !==
                              undefined && (

                              <span>

                                <FiAward />

                                {
                                  coach.experience
                                }{" "}

                                {coach.experience ===
                                1
                                  ? "Year"
                                  : "Years"}{" "}
                                Experience

                              </span>

                            )}

                            {coach?.address?.city && (

                              <span>

                                <FiMapPin />

                                {
                                  coach.address.city
                                }

                              </span>

                            )}

                            {connection?.updatedAt && (

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
                              connection._id,
                              "coach"
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

          {/* =================================================
              MY ACADEMIES
          ================================================= */}

          <section className="profile-view-section">

            <div className="connections-heading">

              <div>

                <h2>
                  My Academies
                </h2>

                <p className="profile-bio">
                  Academies you are currently
                  connected with.
                </p>

              </div>

              <span className="connections-count">
                {academyConnections.length}
              </span>

            </div>

            {loadingAcademyConnections ? (

              <div className="availability-status">

                <FiClock />

                Loading your academies...

              </div>

            ) : academyConnections.length === 0 ? (

              <div className="availability-status">

                <FiUsers />

                You don't have any connected
                academies yet.

              </div>

            ) : (

              <div className="connections-list">

                {academyConnections.map(
                  (connection) => {

                    // ------------------------------------------------
                    // Get academy from all possible response shapes
                    // ------------------------------------------------

                    const academy =
                      connection?.academy ||
                      connection?.academyProfile ||
                      connection?.user ||
                      null;

                    // ------------------------------------------------
                    // Safety check
                    // ------------------------------------------------

                    if (!academy) {
                      return null;
                    }

                    return (
                      <div
                        className="connection-card"
                        key={connection._id}
                      >

                        {/* -----------------------------------------
                            ACADEMY INFORMATION
                        ----------------------------------------- */}

                        <div className="connection-card-info">

                          <div className="profile-view-photo connection-photo">

                            {academy?.profilePic ? (

                              <img
                                src={
                                  academy.profilePic
                                }
                                alt={
                                  academy.name ||
                                  academy.academyName ||
                                  "Academy"
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
                              {academy?.academyName ||
                                academy?.name ||
                                "Academy"}
                            </h2>

                            <p>
                              Academy
                            </p>

                            {academy?.sport && (

                              <span>
                                {academy.sport}
                              </span>

                            )}

                            {academy?.specialization && (

                              <span>
                                {
                                  academy.specialization
                                }
                              </span>

                            )}

                            {(academy?.city ||
                              academy?.address?.city) && (

                              <span>
                                {academy?.city ||
                                  academy?.address?.city}
                              </span>

                            )}

                            <div className="connection-meta">

                              {academy?.establishedYear && (

                                <span>

                                  <FiAward />

                                  Established{" "}

                                  {
                                    academy.establishedYear
                                  }

                                </span>

                              )}

                              {academy?.address?.city && (

                                <span>

                                  <FiMapPin />

                                  {
                                    academy.address.city
                                  }

                                </span>

                              )}

                              {connection?.updatedAt && (

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

                        {/* -----------------------------------------
                            DISCONNECT ACADEMY
                        ----------------------------------------- */}

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
                                connection._id,
                                "academy"
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
                  }
                )}

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
};

export default AthleteConnections;
