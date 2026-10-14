import { useEffect, useState } from "react";
import axios from "axios";
import {
    FiUsers,
    FiUser,
    FiClock,
    FiCheck,
    FiX,
    FiUserPlus,
    FiTrash2,
    FiRefreshCw
} from "react-icons/fi";

import ScoutSidebar from "../../components/ScoutSidebar";

const API = "http://localhost:5000/api";

const ScoutConnections = () => {
    const [connectedAthletes, setConnectedAthletes] = useState([]);
    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [requestLoading, setRequestLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState("");

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {
        fetchConnections();
        fetchRequests();
    }, []);

    // =====================================================
    // FETCH CONNECTED ATHLETES
    // =====================================================

    const fetchConnections = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API}/connections/scout/connected-athletes`,
                config
            );

            setConnectedAthletes(
                response.data?.connections || []
            );
        } catch (error) {
            console.error(
                "Failed to fetch connected athletes:",
                error
            );

            setConnectedAthletes([]);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FETCH OUTGOING REQUESTS
    // =====================================================

    const fetchRequests = async () => {
        try {
            setRequestLoading(true);

            const response = await axios.get(
                `${API}/connections/scout/requests`,
                config
            );

            setRequests(
                response.data?.connections ||
                response.data?.requests ||
                []
            );
        } catch (error) {
            console.error(
                "Failed to fetch scout requests:",
                error
            );

            setRequests([]);
        } finally {
            setRequestLoading(false);
        }
    };

    // =====================================================
    // RESPOND TO REQUEST
    // =====================================================

    const handleRequest = async (
        connectionId,
        status
    ) => {
        try {
            setActionLoading(connectionId);

            await axios.put(
                `${API}/connections/respond/${connectionId}`,
                {
                    status
                },
                config
            );

            await fetchConnections();
            await fetchRequests();

        } catch (error) {
            console.error(
                "Failed to update connection:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update connection"
            );
        } finally {
            setActionLoading("");
        }
    };

    // =====================================================
    // DISCONNECT
    // =====================================================

    const handleDisconnect = async (connectionId) => {
        const confirmed = window.confirm(
            "Are you sure you want to disconnect from this athlete?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(connectionId);

            await axios.delete(
                `${API}/connections/${connectionId}`,
                config
            );

            await fetchConnections();

        } catch (error) {
            console.error(
                "Failed to disconnect:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to disconnect"
            );
        } finally {
            setActionLoading("");
        }
    };

    // =====================================================
    // ATHLETE DETAILS
    // =====================================================

    const getAthlete = (connection) => {
        return (
            connection?.athlete?.athlete ||
            connection?.athlete
        );
    };

    const getAthleteName = (connection) => {
        const athlete = getAthlete(connection);

        return (
            athlete?.user?.name ||
            athlete?.name ||
            connection?.athlete?.name ||
            "Athlete"
        );
    };

    const getAthletePic = (connection) => {
        const athlete = getAthlete(connection);

        return (
            athlete?.user?.profilePic ||
            athlete?.profilePic ||
            connection?.athlete?.profilePic ||
            ""
        );
    };

    const getAthleteSport = (connection) => {
        const athlete = getAthlete(connection);

        return athlete?.sport || "Sport not specified";
    };

    const getAthletePosition = (connection) => {
        const athlete = getAthlete(connection);

        return athlete?.position || "Position not specified";
    };

    // =====================================================
    // OPEN ATHLETE
    // =====================================================

    const openAthlete = (connection) => {
        const athlete = getAthlete(connection);

        const athleteId =
            athlete?._id ||
            connection?.athlete?._id;

        if (!athleteId) {
            return;
        }

        window.location.href =
            `/scout/athlete/${athleteId}`;
    };

    return (
        <div className="dashboard-layout">

            <ScoutSidebar />

            <main className="dashboard-content">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="dashboard-header">

                    <div>
                        <h1>Connections</h1>

                        <p>
                            Manage your connected athletes
                            and connection requests.
                        </p>
                    </div>

                </div>


                {/* =================================================
                    CONNECTED ATHLETES
                ================================================= */}

                <div className="dashboard-section">

                    <div className="section-header">

                        <h2>
                            <FiUsers />
                            Connected Athletes
                        </h2>

                        <button
                            className="back-btn"
                            onClick={fetchConnections}
                            disabled={loading}
                        >
                            <FiRefreshCw />
                            Refresh
                        </button>

                    </div>


                    {loading ? (

                        <div className="profile-fields">
                            <p>
                                Loading connected athletes...
                            </p>
                        </div>

                    ) : connectedAthletes.length === 0 ? (

                        <div className="profile-fields">

                            <div className="form-group full-width">

                                <label>
                                    <FiUsers />
                                    No Connections
                                </label>

                                <p>
                                    You don't have any connected
                                    athletes yet.
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="form-grid">

                            {connectedAthletes.map(
                                (connection) => {

                                    const pic =
                                        getAthletePic(
                                            connection
                                        );

                                    return (
                                        <div
                                            className="profile-completion-card"
                                            key={
                                                connection._id
                                            }
                                        >

                                            <div className="completion-header">

                                                {pic ? (

                                                    <img
                                                        src={pic}
                                                        alt={
                                                            getAthleteName(
                                                                connection
                                                            )
                                                        }
                                                        style={{
                                                            width: "55px",
                                                            height: "55px",
                                                            borderRadius:
                                                                "50%",
                                                            objectFit:
                                                                "cover"
                                                        }}
                                                    />

                                                ) : (

                                                    <div
                                                        style={{
                                                            width: "55px",
                                                            height: "55px",
                                                            borderRadius:
                                                                "50%",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            background:
                                                                "#222",
                                                            color:
                                                                "#c49a6c",
                                                            fontSize:
                                                                "24px"
                                                        }}
                                                    >
                                                        <FiUser />
                                                    </div>

                                                )}

                                                <div>
                                                    <h3>
                                                        {
                                                            getAthleteName(
                                                                connection
                                                            )
                                                        }
                                                    </h3>

                                                    <p>
                                                        {
                                                            getAthleteSport(
                                                                connection
                                                            )
                                                        }
                                                    </p>
                                                </div>

                                            </div>


                                            <div className="profile-fields">

                                                <div className="form-group">
                                                    <label>
                                                        Position
                                                    </label>

                                                    <p>
                                                        {
                                                            getAthletePosition(
                                                                connection
                                                            )
                                                        }
                                                    </p>
                                                </div>

                                            </div>


                                            <div className="form-actions">

                                                <button
                                                    className="back-btn"
                                                    onClick={() =>
                                                        openAthlete(
                                                            connection
                                                        )
                                                    }
                                                >
                                                    <FiUser />
                                                    View Profile
                                                </button>

                                                <button
                                                    className="back-btn"
                                                    onClick={() =>
                                                        handleDisconnect(
                                                            connection._id
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        connection._id
                                                    }
                                                >
                                                    <FiTrash2 />
                                                    Disconnect
                                                </button>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    OUTGOING REQUESTS
                ================================================= */}

                <div className="dashboard-section">

                    <div className="section-header">

                        <h2>
                            <FiClock />
                            Sent Requests
                        </h2>

                        <button
                            className="back-btn"
                            onClick={fetchRequests}
                            disabled={requestLoading}
                        >
                            <FiRefreshCw />
                            Refresh
                        </button>

                    </div>


                    {requestLoading ? (

                        <div className="profile-fields">
                            <p>
                                Loading requests...
                            </p>
                        </div>

                    ) : requests.length === 0 ? (

                        <div className="profile-fields">

                            <div className="form-group full-width">

                                <label>
                                    <FiClock />
                                    No Pending Requests
                                </label>

                                <p>
                                    You don't have any pending
                                    connection requests.
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="form-grid">

                            {requests.map((connection) => (

                                <div
                                    className="profile-completion-card"
                                    key={connection._id}
                                >

                                    <div className="completion-header">

                                        {getAthletePic(
                                            connection
                                        ) ? (

                                            <img
                                                src={getAthletePic(
                                                    connection
                                                )}
                                                alt={
                                                    getAthleteName(
                                                        connection
                                                    )
                                                }
                                                style={{
                                                    width: "55px",
                                                    height: "55px",
                                                    borderRadius:
                                                        "50%",
                                                    objectFit:
                                                        "cover"
                                                }}
                                            />

                                        ) : (

                                            <div
                                                style={{
                                                    width: "55px",
                                                    height: "55px",
                                                    borderRadius:
                                                        "50%",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    background:
                                                        "#222",
                                                    color:
                                                        "#c49a6c",
                                                    fontSize:
                                                        "24px"
                                                }}
                                            >
                                                <FiUser />
                                            </div>

                                        )}

                                        <div>

                                            <h3>
                                                {
                                                    getAthleteName(
                                                        connection
                                                    )
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    getAthleteSport(
                                                        connection
                                                    )
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    <div className="profile-fields">

                                        <div className="form-group">
                                            <label>
                                                Status
                                            </label>

                                            <p>
                                                Request Sent
                                            </p>
                                        </div>

                                    </div>


                                    <div className="form-actions">

                                        <button
                                            className="back-btn"
                                            onClick={() =>
                                                openAthlete(
                                                    connection
                                                )
                                            }
                                        >
                                            <FiUser />
                                            View Profile
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
};

export default ScoutConnections;