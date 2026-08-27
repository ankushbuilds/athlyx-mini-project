import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FiUser,
    FiMapPin,
    FiAward,
    FiSearch,
    FiUserMinus,
    FiX,
    FiAlertTriangle
} from "react-icons/fi";
import CoachSidebar from "../../components/CoachSidebar";

const API = "http://localhost:5000/api";

const CoachAthletes = () => {
    const navigate = useNavigate();

    const [athletes, setAthletes] = useState([]);
    const [filteredAthletes, setFilteredAthletes] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [disconnectingId, setDisconnectingId] = useState(null);

    // ==========================================
    // DISCONNECT MODAL
    // ==========================================

    const [showDisconnectModal, setShowDisconnectModal] =
        useState(false);

    const [selectedAthlete, setSelectedAthlete] =
        useState(null);

    // ==========================================
    // LOAD CONNECTED ATHLETES
    // ==========================================

    useEffect(() => {
        loadMyAthletes();
    }, []);

    // ==========================================
    // SEARCH / FILTER
    // ==========================================

    useEffect(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) {
            setFilteredAthletes(athletes);
            return;
        }

        const filtered = athletes.filter((athlete) => {
            const name =
                athlete?.name ||
                athlete?.user?.name ||
                "";

            const sport =
                athlete?.sport ||
                athlete?.profile?.sport ||
                "";

            const position =
                athlete?.position ||
                athlete?.profile?.position ||
                "";

            const city =
                athlete?.address?.city ||
                athlete?.profile?.address?.city ||
                "";

            const state =
                athlete?.address?.state ||
                athlete?.profile?.address?.state ||
                "";

            const skills =
                Array.isArray(athlete?.skills)
                    ? athlete.skills.join(" ")
                    : Array.isArray(
                        athlete?.profile?.skills
                    )
                        ? athlete.profile.skills.join(" ")
                        : "";

            const searchableText = `
                ${name}
                ${sport}
                ${position}
                ${city}
                ${state}
                ${skills}
            `.toLowerCase();

            return searchableText.includes(searchValue);
        });

        setFilteredAthletes(filtered);
    }, [search, athletes]);

    // ==========================================
    // FETCH CONNECTED ATHLETES
    // ==========================================

    const loadMyAthletes = async () => {
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
                `${API}/connections/coach/athletes`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const myAthletes = Array.isArray(
                response.data?.athletes
            )
                ? response.data.athletes
                : [];

            setAthletes(myAthletes);
            setFilteredAthletes(myAthletes);

        } catch (error) {
            console.error(
                "Failed to load my athletes:",
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
                "Failed to load your athletes."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // OPEN DISCONNECT MODAL
    // ==========================================

    const openDisconnectModal = (event, athlete) => {
        // VERY IMPORTANT
        // Stop card click
        event.preventDefault();
        event.stopPropagation();

        const connectionId =
            athlete?.connectionId ||
            athlete?.connection?._id;

        if (!connectionId) {
            console.error(
                "Connection ID missing:",
                athlete
            );

            setError(
                "Connection information not found. Please refresh the page."
            );

            return;
        }

        setSelectedAthlete(athlete);
        setShowDisconnectModal(true);
    };

    // ==========================================
    // CLOSE DISCONNECT MODAL
    // ==========================================

    const closeDisconnectModal = () => {
        if (disconnectingId) {
            return;
        }

        setShowDisconnectModal(false);
        setSelectedAthlete(null);
    };

    // ==========================================
    // CONFIRM DISCONNECT
    // ==========================================

    const confirmDisconnect = async () => {
        if (!selectedAthlete) {
            return;
        }

        const connectionId =
            selectedAthlete?.connectionId ||
            selectedAthlete?.connection?._id;

        if (!connectionId) {
            console.error(
                "Connection ID missing:",
                selectedAthlete
            );

            return;
        }

        try {
            setDisconnectingId(connectionId);

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/auth", {
                    replace: true
                });
                return;
            }

            await axios.delete(
                `${API}/connections/disconnect/${connectionId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            // ==========================================
            // REMOVE FROM ATHLETES
            // ==========================================

            setAthletes((prevAthletes) =>
                prevAthletes.filter(
                    (item) =>
                        item._id !==
                        selectedAthlete._id
                )
            );

            // ==========================================
            // REMOVE FROM FILTERED ATHLETES
            // ==========================================

            setFilteredAthletes((prevAthletes) =>
                prevAthletes.filter(
                    (item) =>
                        item._id !==
                        selectedAthlete._id
                )
            );

            // ==========================================
            // CLOSE MODAL
            // ==========================================

            setShowDisconnectModal(false);
            setSelectedAthlete(null);

        } catch (error) {
            console.error(
                "Disconnect athlete error:",
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
                "Failed to disconnect athlete."
            );

        } finally {
            setDisconnectingId(null);
        }
    };

    // ==========================================
    // ATHLETE HELPERS
    // ==========================================

    const getAthleteName = (athlete) => {
        return (
            athlete?.name ||
            athlete?.user?.name ||
            "Athlete"
        );
    };

    const getProfilePic = (athlete) => {
        return (
            athlete?.profilePic ||
            athlete?.user?.profilePic ||
            ""
        );
    };

    const getSport = (athlete) => {
        return (
            athlete?.sport ||
            athlete?.profile?.sport ||
            "Sport not available"
        );
    };

    const getPosition = (athlete) => {
        return (
            athlete?.position ||
            athlete?.profile?.position ||
            "Athlete"
        );
    };

    const getLocation = (athlete) => {
        const city =
            athlete?.address?.city ||
            athlete?.profile?.address?.city ||
            "";

        const state =
            athlete?.address?.state ||
            athlete?.profile?.address?.state ||
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

    const getSkills = (athlete) => {
        if (Array.isArray(athlete?.skills)) {
            return athlete.skills;
        }

        if (
            Array.isArray(
                athlete?.profile?.skills
            )
        ) {
            return athlete.profile.skills;
        }

        return [];
    };

    // ==========================================
    // OPEN ATHLETE PROFILE
    // ==========================================

    const handleAthleteClick = (athlete) => {
        const athleteId = athlete?._id;

        if (!athleteId) {
            console.error(
                "Athlete ID not found:",
                athlete
            );

            return;
        }

        navigate(
            `/coach/athletes/${athleteId}`
        );
    };

    // ==========================================
    // KEYBOARD CARD HANDLER
    // ==========================================

    const handleCardKeyDown = (
        event,
        athlete
    ) => {
        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();

            handleAthleteClick(athlete);
        }
    };

    // ==========================================
    // CLEAR SEARCH
    // ==========================================

    const clearSearch = () => {
        setSearch("");
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="coach-athletes-page">

            <CoachSidebar />

            <main className="coach-athletes-content">

                <div className="coach-athletes-container">

                    {/* ==========================================
                        HEADER
                    ========================================== */}

                    <div className="coach-athletes-header">

                        <div>

                            <span className="coach-athletes-eyebrow">
                                ATHLETE MANAGEMENT
                            </span>

                            <h1>
                                My Athletes
                            </h1>

                            <p>
                                Manage athletes you are
                                connected with.
                            </p>

                        </div>

                        {!loading &&
                            !error && (
                                <div className="coach-athletes-count">

                                    <span>
                                        {
                                            filteredAthletes.length
                                        }
                                    </span>

                                    <small>
                                        {
                                            filteredAthletes.length ===
                                            1
                                                ? "Athlete"
                                                : "Athletes"
                                        }
                                    </small>

                                </div>
                            )}

                    </div>

                    {/* ==========================================
                        ERROR
                    ========================================== */}

                    {error && (
                        <div className="coach-athletes-error">

                            <span>
                                {error}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setError("")
                                }
                            >
                                <FiX size={16} />
                            </button>

                        </div>
                    )}

                    {/* ==========================================
                        LOADING
                    ========================================== */}

                    {loading && (
                        <div className="coach-athletes-loading">

                            <div className="loading-spinner"></div>

                            <h2>
                                Loading My Athletes
                            </h2>

                            <p>
                                Please wait while we load
                                your connected athletes.
                            </p>

                        </div>
                    )}

                    {/* ==========================================
                        MAIN CONTENT
                    ========================================== */}

                    {!loading &&
                        !error && (
                            <>

                                {/* ==========================================
                                    TOOLBAR
                                ========================================== */}

                                <div className="coach-athletes-toolbar">

                                    <div className="coach-athletes-sport">

                                        <span>
                                            MY ATHLETES
                                        </span>

                                        <strong>
                                            Connected Athletes
                                        </strong>

                                    </div>

                                    <div className="coach-athletes-search">

                                        <FiSearch
                                            size={18}
                                        />

                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(
                                                event
                                            ) =>
                                                setSearch(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Search athletes..."
                                        />

                                        {search && (
                                            <button
                                                type="button"
                                                onClick={
                                                    clearSearch
                                                }
                                                className="clear-search"
                                                aria-label="Clear search"
                                            >
                                                ×
                                            </button>
                                        )}

                                    </div>

                                </div>

                                {/* ==========================================
                                    EMPTY STATE
                                ========================================== */}

                                {filteredAthletes.length ===
                                    0 && (
                                        <div className="coach-athletes-empty">

                                            <div className="empty-icon">

                                                <FiUser
                                                    size={30}
                                                />

                                            </div>

                                            <h2>
                                                {
                                                    search
                                                        ? "No Athletes Found"
                                                        : "No Connected Athletes"
                                                }
                                            </h2>

                                            <p>
                                                {
                                                    search
                                                        ? "Try searching with a different name, position, location or skill."
                                                        : "You do not have any connected athletes yet."
                                                }
                                            </p>

                                            {search && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        clearSearch
                                                    }
                                                >
                                                    Clear Search
                                                </button>
                                            )}

                                        </div>
                                    )}

                                {/* ==========================================
                                    ATHLETE GRID
                                ========================================== */}

                                {filteredAthletes.length >
                                    0 && (
                                        <div className="coach-athletes-grid">

                                            {filteredAthletes.map(
                                                (athlete) => {

                                                    const profilePic =
                                                        getProfilePic(
                                                            athlete
                                                        );

                                                    const skills =
                                                        getSkills(
                                                            athlete
                                                        );

                                                    const connectionId =
                                                        athlete?.connectionId ||
                                                        athlete?.connection?._id;

                                                    const isDisconnecting =
                                                        disconnectingId ===
                                                        connectionId;

                                                    return (
                                                        <div
                                                            key={
                                                                athlete._id
                                                            }
                                                            className="coach-athlete-card"
                                                            onClick={() =>
                                                                handleAthleteClick(
                                                                    athlete
                                                                )
                                                            }
                                                            role="button"
                                                            tabIndex={0}
                                                            onKeyDown={(
                                                                event
                                                            ) =>
                                                                handleCardKeyDown(
                                                                    event,
                                                                    athlete
                                                                )
                                                            }
                                                        >

                                                            {/* ==========================================
                                                                CARD TOP
                                                            ========================================== */}

                                                            <div className="athlete-card-top">

                                                                <div className="athlete-avatar">

                                                                    {profilePic ? (
                                                                        <img
                                                                            src={
                                                                                profilePic
                                                                            }
                                                                            alt={getAthleteName(
                                                                                athlete
                                                                            )}
                                                                        />
                                                                    ) : (
                                                                        <FiUser
                                                                            size={
                                                                                25
                                                                            }
                                                                        />
                                                                    )}

                                                                </div>

                                                                <div className="athlete-card-status">

                                                                    <span></span>

                                                                    Connected

                                                                </div>

                                                            </div>

                                                            {/* ==========================================
                                                                ATHLETE INFO
                                                            ========================================== */}

                                                            <div className="athlete-card-info">

                                                                <h3>
                                                                    {getAthleteName(
                                                                        athlete
                                                                    )}
                                                                </h3>

                                                                <p className="athlete-position">
                                                                    {getPosition(
                                                                        athlete
                                                                    )}
                                                                </p>

                                                            </div>

                                                            {/* ==========================================
                                                                DETAILS
                                                            ========================================== */}

                                                            <div className="athlete-card-details">

                                                                <div className="athlete-detail">

                                                                    <FiAward
                                                                        size={
                                                                            16
                                                                        }
                                                                    />

                                                                    <span>
                                                                        {getSport(
                                                                            athlete
                                                                        )}
                                                                    </span>

                                                                </div>

                                                                <div className="athlete-detail">

                                                                    <FiMapPin
                                                                        size={
                                                                            16
                                                                        }
                                                                    />

                                                                    <span>
                                                                        {getLocation(
                                                                            athlete
                                                                        )}
                                                                    </span>

                                                                </div>

                                                            </div>

                                                            {/* ==========================================
                                                                SKILLS
                                                            ========================================== */}

                                                            {skills.length >
                                                                0 && (
                                                                <div className="athlete-skills">

                                                                    {skills
                                                                        .slice(
                                                                            0,
                                                                            3
                                                                        )
                                                                        .map(
                                                                            (
                                                                                skill,
                                                                                index
                                                                            ) => (
                                                                                <span
                                                                                    key={`${skill}-${index}`}
                                                                                >
                                                                                    {
                                                                                        skill
                                                                                    }
                                                                                </span>
                                                                            )
                                                                        )}

                                                                    {skills.length >
                                                                        3 && (
                                                                        <span>
                                                                            +
                                                                            {skills.length -
                                                                                3}
                                                                        </span>
                                                                    )}

                                                                </div>
                                                            )}

                                                            {/* ==========================================
                                                                FOOTER
                                                            ========================================== */}

                                                            <div className="athlete-card-footer">

                                                                <span>
                                                                    View Profile
                                                                </span>

                                                                <span className="arrow">
                                                                    →
                                                                </span>

                                                            </div>

                                                            {/* ==========================================
                                                                DISCONNECT BUTTON
                                                            ========================================== */}

                                                            <button
                                                                type="button"
                                                                className="disconnect-athlete-btn"
                                                                onClick={(
                                                                    event
                                                                ) =>
                                                                    openDisconnectModal(
                                                                        event,
                                                                        athlete
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDisconnecting
                                                                }
                                                            >

                                                                <FiUserMinus
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                {isDisconnecting
                                                                    ? "Disconnecting..."
                                                                    : "Disconnect"}

                                                            </button>

                                                        </div>
                                                    );
                                                }
                                            )}

                                        </div>
                                    )}

                            </>
                        )}

                </div>

            </main>

            {/* ======================================================
                DISCONNECT MODAL
            ====================================================== */}

            {showDisconnectModal &&
                selectedAthlete && (
                    <div
                        className="disconnect-modal-overlay"
                        onClick={
                            closeDisconnectModal
                        }
                    >

                        <div
                            className="disconnect-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            {/* ==========================================
                                MODAL CLOSE
                            ========================================== */}

                            <button
                                type="button"
                                className="disconnect-modal-close"
                                onClick={
                                    closeDisconnectModal
                                }
                                disabled={
                                    !!disconnectingId
                                }
                                aria-label="Close"
                            >
                                <FiX size={18} />
                            </button>

                            {/* ==========================================
                                WARNING ICON
                            ========================================== */}

                            <div className="disconnect-modal-icon">

                                <FiAlertTriangle
                                    size={28}
                                />

                            </div>

                            {/* ==========================================
                                CONTENT
                            ========================================== */}

                            <div className="disconnect-modal-content">

                                <h2>
                                    Disconnect Athlete?
                                </h2>

                                <p>
                                    Are you sure you want
                                    to disconnect{" "}
                                    <strong>
                                        {getAthleteName(
                                            selectedAthlete
                                        )}
                                    </strong>
                                    ?
                                </p>

                                <span>
                                    This athlete will be
                                    removed from your
                                    connected athletes.
                                </span>

                            </div>

                            {/* ==========================================
                                ACTIONS
                            ========================================== */}

                            <div className="disconnect-modal-actions">

                                <button
                                    type="button"
                                    className="disconnect-modal-cancel"
                                    onClick={
                                        closeDisconnectModal
                                    }
                                    disabled={
                                        !!disconnectingId
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="disconnect-modal-confirm"
                                    onClick={
                                        confirmDisconnect
                                    }
                                    disabled={
                                        !!disconnectingId
                                    }
                                >

                                    <FiUserMinus
                                        size={16}
                                    />

                                    {disconnectingId
                                        ? "Disconnecting..."
                                        : "Disconnect"}

                                </button>

                            </div>

                        </div>

                    </div>
                )}

        </div>
    );
};

export default CoachAthletes;