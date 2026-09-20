
import { useEffect, useState } from "react";
import axios from "axios";
import AthleteSidebar from "../../components/AthleteSidebar";

const API = "http://localhost:5000/api";

const Challenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [stats, setStats] = useState(null);

    // Stores TODAY'S progress input, not total progress
    const [progressValues, setProgressValues] = useState({});

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
    const [error, setError] = useState("");

    // ======================================================
    // AUTH CONFIG
    // ======================================================

    const getAuthConfig = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Please login again.");
        }

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    // ======================================================
    // FETCH CHALLENGES
    // ======================================================

    const fetchChallenges = async () => {
        try {
            setLoading(true);
            setError("");

            const config = getAuthConfig();

            const [challengeResponse, statsResponse] =
                await Promise.all([
                    axios.get(
                        `${API}/challenges/weekly`,
                        config
                    ),
                    axios.get(
                        `${API}/challenges/stats`,
                        config
                    )
                ]);

            const weeklyChallenges =
                challengeResponse.data?.challenges || [];

            // Remove broken assignments
            const validChallenges =
                weeklyChallenges.filter(
                    (item) => item?.challenge
                );

            setChallenges(validChallenges);

            setStats(
                statsResponse.data?.stats || null
            );

            // ==================================================
            // RESET TODAY'S INPUT VALUES
            // ==================================================
            //
            // IMPORTANT:
            // We do NOT put item.progress here.
            //
            // item.progress = TOTAL progress
            // progressValues = TODAY'S progress
            //

            const initialProgress = {};

            validChallenges.forEach((item) => {
                initialProgress[item._id] = "";
            });

            setProgressValues(initialProgress);

        } catch (error) {
            console.error(
                "Fetch challenges error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to load challenges."
            );

        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        fetchChallenges();
    }, []);

    // ======================================================
    // PROGRESS PERCENTAGE
    // ======================================================

    const getProgressPercentage = (item) => {
        if (!item?.challenge) {
            return 0;
        }

        const target = Number(
            item.challenge.target
        );

        const progress = Number(
            item.progress || 0
        );

        if (!target || target <= 0) {
            return 0;
        }

        return Math.min(
            (progress / target) * 100,
            100
        );
    };

    // ======================================================
    // HANDLE TODAY'S INPUT CHANGE
    // ======================================================

    const handleProgressChange = (
        assignmentId,
        value
    ) => {
        setProgressValues((previous) => ({
            ...previous,
            [assignmentId]: value
        }));

        setError("");
    };

    // ======================================================
    // UPDATE PROGRESS
    // ======================================================

    const handleUpdateProgress = async (item) => {
        try {
            setError("");

            // Safety check
            if (!item?.challenge?._id) {
                setError(
                    "Challenge information is missing. Please refresh the page."
                );
                return;
            }

            const config = getAuthConfig();

            // Today's entered progress
            const rawValue =
                progressValues[item._id];

            // ==================================================
            // EMPTY INPUT
            // ==================================================

            if (
                rawValue === "" ||
                rawValue === undefined ||
                rawValue === null
            ) {
                setError(
                    "Please enter today's progress."
                );
                return;
            }

            const todayProgress =
                Number(rawValue);

            // Current TOTAL progress
            const currentProgress =
                Number(item.progress || 0);

            const target =
                Number(item.challenge.target);

            // ==================================================
            // VALIDATE NUMBER
            // ==================================================

            if (
                Number.isNaN(todayProgress) ||
                !Number.isFinite(todayProgress)
            ) {
                setError(
                    "Please enter a valid progress value."
                );
                return;
            }

            // ==================================================
            // NEGATIVE VALUE
            // ==================================================

            if (todayProgress < 0) {
                setError(
                    "Today's progress cannot be negative."
                );
                return;
            }

            // ==================================================
            // CALCULATE NEW TOTAL
            // ==================================================

            const newTotal =
                currentProgress + todayProgress;

            // ==================================================
            // PREVENT EXCEEDING TARGET
            // ==================================================

            if (newTotal > target) {
                setError(
                    `Your total progress cannot exceed the target of ${target}.`
                );
                return;
            }

            // ==================================================
            // SET UPDATING STATE
            // ==================================================

            setUpdating((previous) => ({
                ...previous,
                [item._id]: true
            }));

            console.log(
                "================================"
            );

            console.log(
                "Updating challenge:",
                item.challenge._id
            );

            console.log(
                "Assignment ID:",
                item._id
            );

            console.log(
                "Previous total:",
                currentProgress
            );

            console.log(
                "Today's progress:",
                todayProgress
            );

            console.log(
                "New total:",
                newTotal
            );

            console.log(
                "Target:",
                target
            );

            console.log(
                "Request body:",
                {
                    progress: newTotal
                }
            );

            console.log(
                "================================"
            );

            // ==================================================
            // SEND NEW TOTAL TO BACKEND
            // ==================================================

            const response = await axios.put(
                `${API}/challenges/${item.challenge._id}/progress`,
                {
                    progress: newTotal
                },
                config
            );

            console.log(
                "Backend update response:",
                response.data
            );

            // ==================================================
            // GET UPDATED ASSIGNMENT
            // ==================================================

            const updatedChallenge =
                response.data?.challenge;

            if (!updatedChallenge) {
                throw new Error(
                    "Updated challenge was not returned by server."
                );
            }

            // ==================================================
            // NORMALIZE RESPONSE
            // ==================================================

            const normalizedChallenge = {
                ...updatedChallenge,

                challenge:
                    updatedChallenge.challenge ||
                    item.challenge
            };

            // ==================================================
            // UPDATE CHALLENGE STATE
            // ==================================================

            setChallenges((previous) =>
                previous.map((existingItem) =>
                    existingItem._id === item._id
                        ? normalizedChallenge
                        : existingItem
                )
            );

            // ==================================================
            // CLEAR TODAY'S INPUT
            // ==================================================

            setProgressValues((previous) => ({
                ...previous,
                [item._id]: ""
            }));

            // ==================================================
            // REFRESH STATS
            // ==================================================

            const statsResponse =
                await axios.get(
                    `${API}/challenges/stats`,
                    config
                );

            setStats(
                statsResponse.data?.stats || null
            );

            // ==================================================
            // SUCCESS MESSAGE
            // ==================================================

            if (
                normalizedChallenge.status ===
                "completed"
            ) {
                setError(
                    "Challenge completed successfully! 🎉"
                );
            } else {
                setError(
                    `Today's ${todayProgress} ${normalizedChallenge.challenge.unit || "units"} added successfully. Total progress: ${normalizedChallenge.progress}.`
                );
            }

        } catch (error) {
            console.error(
                "Update challenge progress error:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to update challenge progress."
            );

        } finally {
            setUpdating((previous) => ({
                ...previous,
                [item._id]: false
            }));
        }
    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="dashboard-layout">

            <AthleteSidebar />

            <main className="dashboard-main">

                <div className="challenges-page">

                    {/* =====================================
                        PAGE HEADER
                    ===================================== */}

                    <div className="challenges-header">

                        <div>

                            <h1>
                                Weekly Challenges
                            </h1>

                            <p>
                                Stay active, complete
                                challenges and earn XP
                                every week.
                            </p>

                        </div>

                    </div>


                    {/* =====================================
                        STATS
                    ===================================== */}

                    {stats && (

                        <div className="challenge-stats">

                            <div className="challenge-stat-card">

                                <span>
                                    Total XP
                                </span>

                                <strong>
                                    {stats.totalXP ?? 0}
                                </strong>

                            </div>


                            <div className="challenge-stat-card">

                                <span>
                                    Completed
                                </span>

                                <strong>
                                    {stats.challengesCompleted ?? 0}
                                </strong>

                            </div>


                            <div className="challenge-stat-card">

                                <span>
                                    Current Streak
                                </span>

                                <strong>
                                    {stats.currentStreak ?? 0}
                                </strong>

                            </div>


                            <div className="challenge-stat-card">

                                <span>
                                    Best Streak
                                </span>

                                <strong>
                                    {stats.longestStreak ?? 0}
                                </strong>

                            </div>

                        </div>

                    )}


                    {/* =====================================
                        ERROR / SUCCESS
                    ===================================== */}

                    {!loading && error && (

                        <div className="challenges-error">
                            {error}
                        </div>

                    )}


                    {/* =====================================
                        LOADING
                    ===================================== */}

                    {loading && (

                        <div className="challenges-loading">
                            Loading challenges...
                        </div>

                    )}


                    {/* =====================================
                        EMPTY
                    ===================================== */}

                    {!loading &&
                        !error &&
                        challenges.length === 0 && (

                            <div className="challenges-empty">

                                <h3>
                                    No challenges available
                                </h3>

                                <p>
                                    Check back later for
                                    new weekly challenges.
                                </p>

                            </div>

                        )}


                    {/* =====================================
                        CHALLENGES
                    ===================================== */}

                    {!loading &&
                        challenges.length > 0 && (

                            <div className="challenges-grid">

                                {challenges.map((item) => {

                                    if (!item?.challenge) {
                                        return null;
                                    }

                                    const challenge =
                                        item.challenge;

                                    const percentage =
                                        getProgressPercentage(
                                            item
                                        );

                                    const completed =
                                        item.status ===
                                        "completed";

                                    // TODAY'S INPUT
                                    const todayValue =
                                        progressValues[
                                            item._id
                                        ] ?? "";

                                    return (

                                        <div
                                            className={`challenge-card ${
                                                completed
                                                    ? "completed"
                                                    : ""
                                            }`}
                                            key={item._id}
                                        >

                                            {/* =================================
                                                CATEGORY + DIFFICULTY
                                            ================================= */}

                                            <div className="challenge-card-top">

                                                <span className="challenge-category">

                                                    {
                                                        challenge.category
                                                    }

                                                </span>


                                                <span
                                                    className={`challenge-difficulty ${
                                                        challenge.difficulty
                                                            ?.toLowerCase() ||
                                                        ""
                                                    }`}
                                                >

                                                    {
                                                        challenge.difficulty
                                                    }

                                                </span>

                                            </div>


                                            {/* =================================
                                                TITLE
                                            ================================= */}

                                            <h2>
                                                {
                                                    challenge.title
                                                }
                                            </h2>


                                            {/* =================================
                                                DESCRIPTION
                                            ================================= */}

                                            <p>
                                                {
                                                    challenge.description
                                                }
                                            </p>


                                            {/* =================================
                                                TOTAL TARGET
                                            ================================= */}

                                            <div className="challenge-target">

                                                <strong>
                                                    {
                                                        item.progress ??
                                                        0
                                                    }
                                                </strong>

                                                <span>
                                                    /
                                                    {
                                                        challenge.target
                                                    }{" "}
                                                    {
                                                        challenge.unit
                                                    }
                                                </span>

                                            </div>


                                            {/* =================================
                                                PROGRESS BAR
                                            ================================= */}

                                            <div className="challenge-progress">

                                                <div className="challenge-progress-bar">

                                                    <div
                                                        className="challenge-progress-fill"
                                                        style={{
                                                            width:
                                                                `${percentage}%`
                                                        }}
                                                    />

                                                </div>


                                                <span>
                                                    {
                                                        Math.round(
                                                            percentage
                                                        )
                                                    }
                                                    %
                                                </span>

                                            </div>


                                            {/* =================================
                                                TODAY'S PROGRESS
                                            ================================= */}

                                            {!completed && (

                                                <div className="challenge-update">

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={
                                                            todayValue
                                                        }
                                                        onChange={(event) =>
                                                            handleProgressChange(
                                                                item._id,
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder={`Today's ${challenge.unit || "progress"}`}
                                                    />


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleUpdateProgress(
                                                                item
                                                            )
                                                        }
                                                        disabled={
                                                            updating[
                                                                item._id
                                                            ]
                                                        }
                                                    >

                                                        {
                                                            updating[
                                                                item._id
                                                            ]
                                                                ? "Updating..."
                                                                : "Add Today's Progress"
                                                        }

                                                    </button>

                                                </div>

                                            )}


                                            {/* =================================
                                                FOOTER
                                            ================================= */}

                                            <div className="challenge-card-footer">

                                                <span>
                                                    +
                                                    {
                                                        challenge.xpReward
                                                    }{" "}
                                                    XP
                                                </span>


                                                {completed ? (

                                                    <span className="challenge-completed">
                                                        Completed
                                                    </span>

                                                ) : (

                                                    <span>
                                                        In Progress
                                                    </span>

                                                )}

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

export default Challenges;
