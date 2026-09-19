
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    FiCheckCircle
} from "react-icons/fi";

import AcademySidebar from "../../components/AcademySidebar";

const API = "http://localhost:5000/api";

const AcademyProfile = () => {
    const navigate = useNavigate();

    const [academy, setAcademy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // LOAD PROFILE
    // ==========================================

    useEffect(() => {
        loadProfile();
    }, []);

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

            const response = await axios.get(
                `${API}/academies/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAcademy(
                response.data?.academy ||
                response.data ||
                null
            );

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

    // ==========================================
    // HELPERS
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

    const getProfilePic = () => {
        return (
            academy?.profilePic ||
            academy?.user?.profilePic ||
            ""
        );
    };

    const getAcademyName = () => {
        return (
            academy?.academyName ||
            academy?.user?.name ||
            "Academy"
        );
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="dashboard-layout">

                <AcademySidebar />

                <main className="coach-athletes-content">

                    <div className="coach-athletes-loading">

                        <div className="loading-spinner"></div>

                        <h2>
                            Loading Profile
                        </h2>

                        <p>
                            Please wait while we load your
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

                <AcademySidebar />

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
                            onClick={loadProfile}
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

            <AcademySidebar />

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
                                My Profile
                            </h1>

                            <p>
                                Manage your academy information
                                and public profile.
                            </p>

                        </div>

                    </div>

                    {/* ======================================
                        PROFILE CARD
                    ====================================== */}

                    <div className="coach-athlete-card">

                        {/* PROFILE TOP */}

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

                        {/* BASIC INFO */}

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

                        {/* DETAILS */}

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
                        EDIT PROFILE BUTTON
                    ====================================== */}

                    <div className="profile-action-bottom">

                        <button className="bottom-edit-profile-btn"
                            type="button"
                            onClick={() =>
                                navigate("/academy/edit-profile")
                            }
                        >
                            <FiEdit2 size={16} />
                            Edit Profile
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default AcademyProfile;
