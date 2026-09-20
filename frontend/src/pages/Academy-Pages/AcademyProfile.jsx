import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    FiUser,
    FiEdit2,
    FiMapPin,
    FiPhone,
    FiAward,
    FiCalendar,
    FiBookOpen,
    FiHome,
    FiGlobe,
    FiInstagram,
    FiFacebook,
    FiCheckCircle,
    FiUserPlus,
    FiClock,
    FiCheck
} from "react-icons/fi";

import AcademySidebar from "../../components/AcademySidebar";
import AthleteSidebar from "../../components/AthleteSidebar";

const API = "http://localhost:5000/api";

const AcademyProfile = () => {
    const navigate = useNavigate();
    const { academyId } = useParams();

    const [academy, setAcademy] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [connectionStatus, setConnectionStatus] = useState("none");
    const [connectionLoading, setConnectionLoading] = useState(false);

    // ==========================================
    // DETERMINE PROFILE TYPE
    // ==========================================

    const isPublicProfile = Boolean(academyId);

    // ==========================================
    // LOAD CURRENT USER
    // ==========================================

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to load current user:", error);
        }
    }, []);

    // ==========================================
    // GET ACADEMY USER ID
    // ==========================================
   

    const getAcademyUserId = () => {
        if (!academy) {
            return null;
        }

        // academy.user is populated object
        if (
            academy.user &&
            typeof academy.user === "object" &&
            academy.user._id
        ) {
            return academy.user._id;
        }

        // academy.user is directly an ObjectId string
        if (academy.user) {
            return academy.user;
        }

        // In case backend returns userId separately
        if (academy.userId) {
            return academy.userId;
        }

        return null;
    };

    // ==========================================
    // LOAD PROFILE
    // ==========================================

    useEffect(() => {
        const loadProfile = async () => {
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

                let response;

                // ======================================
                // PUBLIC ACADEMY PROFILE
                // ======================================

                if (isPublicProfile) {
                    response = await axios.get(
                        `${API}/academies/${academyId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                }

                // ======================================
                // OWN ACADEMY PROFILE
                // ======================================

                else {
                    response = await axios.get(
                        `${API}/academies/profile`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                }

                const profile =
                    response.data?.academy ||
                    response.data ||
                    null;

                if (!profile) {
                    setError("Academy profile not found.");
                    return;
                }

                console.log("ACADEMY PROFILE:", profile);
                console.log(
                    "ACADEMY PROFILE ID:",
                    profile._id
                );
                console.log(
                    "ACADEMY USER:",
                    profile.user
                );
                console.log(
                    "ACADEMY USER ID:",
                    profile.user?._id || profile.user
                );

                setAcademy(profile);

            } catch (error) {
                console.error(
                    "Failed to load academy profile:",
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
                    "Failed to load academy profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [academyId, isPublicProfile, navigate]);

    // ==========================================
    // CHECK CONNECTION STATUS
    // ==========================================

    useEffect(() => {
        const checkConnection = async () => {
            if (
                !isPublicProfile ||
                !academy ||
                !currentUser ||
                currentUser.role !== "athlete"
            ) {
                return;
            }

            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            // IMPORTANT:
            // Connection API needs Academy USER ID,
            // NOT Academy profile ID.

            const academyUserId = getAcademyUserId();

            if (!academyUserId) {
                console.error(
                    "Academy User ID not found.",
                    academy
                );

                setConnectionStatus("none");
                return;
            }

            try {
                console.log(
                    "Checking academy connection using User ID:",
                    academyUserId
                );

                const response = await axios.get(
                    `${API}/connections/status/athlete/academy/${academyUserId}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                console.log(
                    "Academy connection status:",
                    response.data
                );

                setConnectionStatus(
                    response.data?.status ||
                    "none"
                );

            } catch (error) {
                console.error(
                    "Failed to check academy connection:",
                    error
                );

                setConnectionStatus("none");
            }
        };

        checkConnection();

    }, [
        academy,
        currentUser,
        isPublicProfile
    ]);

    // ==========================================
    // SEND CONNECTION REQUEST
    // ==========================================

    const handleConnect = async () => {
        if (
            !academy ||
            !currentUser ||
            currentUser.role !== "athlete"
        ) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/auth", {
                replace: true
            });

            return;
        }

        // IMPORTANT:
        // Use Academy USER ID here.
        // Do NOT use academy._id.

        const academyUserId = getAcademyUserId();

        if (!academyUserId) {
            console.error(
                "Academy User ID is missing:",
                academy
            );

            alert(
                "Academy account information is missing. Please try again."
            );

            return;
        }

        try {
            setConnectionLoading(true);

            console.log(
                "Sending academy connection request to User ID:",
                academyUserId
            );

            const response = await axios.post(
                `${API}/connections/send/athlete/academy/${academyUserId}`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.log(
                "Academy connection response:",
                response.data
            );

            if (
                response.data?.success ||
                response.data?.status === "pending"
            ) {
                setConnectionStatus("pending");
            } else {
                setConnectionStatus(
                    response.data?.status ||
                    "pending"
                );
            }

        } catch (error) {
            console.error(
                "Failed to send academy connection request:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to send connection request."
            );

        } finally {
            setConnectionLoading(false);
        }
    };

    // ==========================================
    // LOCATION
    // ==========================================

    const getLocation = () => {
        if (!academy) {
            return "Location not available";
        }

        const parts = [
            academy.city,
            academy.state
        ].filter(Boolean);

        return (
            parts.join(", ") ||
            academy.address ||
            "Location not available"
        );
    };

    // ==========================================
    // PROFILE PICTURE
    // ==========================================

    const getProfilePic = () => {
        return (
            academy?.profilePic ||
            academy?.user?.profilePic ||
            ""
        );
    };

    // ==========================================
    // ACADEMY NAME
    // ==========================================

    const getAcademyName = () => {
        return (
            academy?.academyName ||
            academy?.user?.name ||
            "Academy"
        );
    };

    // ==========================================
    // ACADEMY USER ID
    // ==========================================

    const academyUserId = getAcademyUserId();

    // ==========================================
    // SHOULD SHOW CONNECT BUTTON?
    // ==========================================

    const shouldShowConnect =
        isPublicProfile &&
        currentUser?.role === "athlete" &&
        academy &&
        academyUserId &&
        String(currentUser._id) !==
            String(academyUserId);

    // ==========================================
    // SIDEBAR
    // ==========================================

    const renderSidebar = () => {
        if (isPublicProfile) {
            return <AthleteSidebar />;
        }

        return <AcademySidebar />;
    };

    // ==========================================
    // CONNECTION BUTTON
    // ==========================================

    const renderConnectionButton = () => {
        if (!shouldShowConnect) {
            return null;
        }

        // ======================================
        // CONNECTED
        // ======================================

        if (connectionStatus === "accepted") {
            return (
                <button
                    type="button"
                    className="bottom-edit-profile-btn"
                    disabled
                >
                    <FiCheck size={16} />
                    Connected
                </button>
            );
        }

        // ======================================
        // REQUEST SENT
        // ======================================

        if (connectionStatus === "pending") {
            return (
                <button
                    type="button"
                    className="bottom-edit-profile-btn"
                    disabled
                >
                    <FiClock size={16} />
                    Request Sent
                </button>
            );
        }

        // ======================================
        // REJECTED / NONE
        // ======================================

        return (
            <button
                type="button"
                className="bottom-edit-profile-btn"
                onClick={handleConnect}
                disabled={connectionLoading}
            >
                <FiUserPlus size={16} />

                {connectionLoading
                    ? "Sending..."
                    : "Connect"}
            </button>
        );
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="dashboard-layout">

                {renderSidebar()}

                <main className="coach-athletes-content">

                    <div className="coach-athletes-loading">

                        <div className="loading-spinner"></div>

                        <h2>
                            Loading Profile
                        </h2>

                        <p>
                            Please wait while we load the
                            academy profile.
                        </p>

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
            <div className="dashboard-layout">

                {renderSidebar()}

                <main className="coach-athletes-content">

                    <div className="coach-athletes-empty">

                        <div className="empty-icon">
                            <FiUser size={30} />
                        </div>

                        <h2>
                            Unable to Load Profile
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try Again
                        </button>

                    </div>

                </main>

            </div>
        );
    }

    // ==========================================
    // PROFILE
    // ==========================================

    return (
        <div className="dashboard-layout">

            {renderSidebar()}

            <main className="coach-athletes-content">

                <div className="coach-athletes-container">

                    {/* ======================================
                        HEADER
                    ====================================== */}

                    <div className="coach-athletes-header">

                        <div>

                            <span className="coach-athletes-eyebrow">
                                ACADEMY PROFILE
                            </span>

                            <h1>
                                {isPublicProfile
                                    ? getAcademyName()
                                    : "My Profile"}
                            </h1>

                            <p>
                                {isPublicProfile
                                    ? "View academy information, training programs and opportunities."
                                    : "Manage your academy information and public profile."}
                            </p>

                        </div>

                    </div>

                    {/* ======================================
                        PROFILE CARD
                    ====================================== */}

                    <div className="coach-athlete-card">

                        <div className="athlete-card-top">

                            <div className="athlete-avatar">

                                {getProfilePic() ? (
                                    <img
                                        src={getProfilePic()}
                                        alt={getAcademyName()}
                                    />
                                ) : (
                                    <FiHome size={28} />
                                )}

                            </div>

                            <div className="athlete-card-status connected">

                                <span></span>

                                {academy?.isAvailable !== false
                                    ? "Available"
                                    : "Unavailable"}

                            </div>

                        </div>

                        <div className="athlete-card-info">

                            <h3>
                                {getAcademyName()}
                            </h3>

                            <p className="athlete-position">
                                {academy?.specialization ||
                                    academy?.sport ||
                                    "Sports Academy"}
                            </p>

                        </div>

                        <div className="athlete-card-details">

                            <div className="athlete-detail">

                                <FiAward size={16} />

                                <span>
                                    {academy?.sport ||
                                        "Sport not available"}
                                </span>

                            </div>

                            <div className="athlete-detail">

                                <FiMapPin size={16} />

                                <span>
                                    {getLocation()}
                                </span>

                            </div>

                            {academy?.establishedYear && (
                                <div className="athlete-detail">

                                    <FiCalendar size={16} />

                                    <span>
                                        Established{" "}
                                        {academy.establishedYear}
                                    </span>

                                </div>
                            )}

                            {academy?.phone && (
                                <div className="athlete-detail">

                                    <FiPhone size={16} />

                                    <span>
                                        {academy.phone}
                                    </span>

                                </div>
                            )}

                        </div>

                    </div>

                    {/* ======================================
                        BIO
                    ====================================== */}

                    {academy?.bio && (
                        <section className="coach-athletes-section">

                            <div className="coach-athletes-header">

                                <div>

                                    <span className="coach-athletes-eyebrow">
                                        ABOUT
                                    </span>

                                </div>

                            </div>

                            <p>
                                {academy.bio}
                            </p>

                        </section>
                    )}

                    {/* ======================================
                        TRAINING PROGRAMS
                    ====================================== */}

                    {Array.isArray(
                        academy?.trainingPrograms
                    ) &&
                        academy.trainingPrograms.length > 0 && (

                            <section className="coach-athletes-section">

                                <div className="coach-athletes-header">

                                    <div>

                                        <span className="coach-athletes-eyebrow">
                                            TRAINING PROGRAMS
                                        </span>

                                    </div>

                                </div>

                                <div className="athlete-skills">

                                    {academy.trainingPrograms.map(
                                        (program, index) => (
                                            <span key={index}>
                                                <FiBookOpen size={13} />
                                                {program}
                                            </span>
                                        )
                                    )}

                                </div>

                            </section>
                        )}

                    {/* ======================================
                        FACILITIES
                    ====================================== */}

                    {Array.isArray(
                        academy?.facilities
                    ) &&
                        academy.facilities.length > 0 && (

                            <section className="coach-athletes-section">

                                <div className="coach-athletes-header">

                                    <div>

                                        <span className="coach-athletes-eyebrow">
                                            FACILITIES
                                        </span>

                                    </div>

                                </div>

                                <div className="athlete-skills">

                                    {academy.facilities.map(
                                        (facility, index) => (
                                            <span key={index}>
                                                <FiCheckCircle size={13} />
                                                {facility}
                                            </span>
                                        )
                                    )}

                                </div>

                            </section>
                        )}

                    {/* ======================================
                        ACHIEVEMENTS
                    ====================================== */}

                    {Array.isArray(
                        academy?.achievements
                    ) &&
                        academy.achievements.length > 0 && (

                            <section className="coach-athletes-section">

                                <div className="coach-athletes-header">

                                    <div>

                                        <span className="coach-athletes-eyebrow">
                                            ACHIEVEMENTS
                                        </span>

                                    </div>

                                </div>

                                <div className="athlete-skills">

                                    {academy.achievements.map(
                                        (achievement, index) => (
                                            <span key={index}>
                                                <FiAward size={13} />
                                                {achievement}
                                            </span>
                                        )
                                    )}

                                </div>

                            </section>
                        )}

                    {/* ======================================
                        SOCIAL LINKS
                    ====================================== */}

                    {academy?.socialLinks &&
                        (
                            academy.socialLinks.website ||
                            academy.socialLinks.instagram ||
                            academy.socialLinks.facebook
                        ) && (

                            <section className="coach-athletes-section">

                                <div className="coach-athletes-header">

                                    <div>

                                        <span className="coach-athletes-eyebrow">
                                            ONLINE PRESENCE
                                        </span>

                                    </div>

                                </div>

                                <div className="athlete-skills">

                                    {academy.socialLinks.website && (
                                        <a
                                            href={
                                                academy.socialLinks.website
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FiGlobe size={14} />
                                            Website
                                        </a>
                                    )}

                                    {academy.socialLinks.instagram && (
                                        <a
                                            href={
                                                academy.socialLinks.instagram
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FiInstagram size={14} />
                                            Instagram
                                        </a>
                                    )}

                                    {academy.socialLinks.facebook && (
                                        <a
                                            href={
                                                academy.socialLinks.facebook
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <FiFacebook size={14} />
                                            Facebook
                                        </a>
                                    )}

                                </div>

                            </section>
                        )}

                    {/* ======================================
                        ACTION BUTTONS
                    ====================================== */}

                    <div className="profile-action-bottom">

                        {/* OWN ACADEMY PROFILE */}

                        {!isPublicProfile && (
                            <button
                                className="bottom-edit-profile-btn"
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/academy/edit-profile"
                                    )
                                }
                            >
                                <FiEdit2 size={16} />
                                Edit Profile
                            </button>
                        )}

                        {/* ATHLETE VIEWING ACADEMY */}

                        {isPublicProfile &&
                            renderConnectionButton()}

                    </div>

                </div>

            </main>

        </div>
    );
};

export default AcademyProfile;