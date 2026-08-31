
import { useEffect, useState } from "react";
import axios from "axios";
import AthleteSidebar from "../../components/AthleteSidebar";

const API = "http://localhost:5000/api";

const Challenges = () => {

    const [challenges, setChallenges] = useState([]);
    const [stats, setStats] = useState(null);

    const [progressValues, setProgressValues] = useState({});

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
    const [error, setError] = useState("");

    // ======================================================
    // FETCH CHALLENGES + STATS
    // ======================================================

    const fetchChallenges = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login again.");
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const [
                challengeResponse,
                statsResponse
            ] = await Promise.all([
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
                challengeResponse.data.challenges || [];

            setChallenges(weeklyChallenges);

            setStats(
                statsResponse.data.stats || null
            );

            // Keep input values synced with backend
            const initialProgress = {};

            weeklyChallenges.forEach((item) => {
                initialProgress[item._id] =
                    item.progress;
            });

            setProgressValues(initialProgress);

        } catch (error) {

            console.error(
                "Fetch challenges error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load challenges."
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchChallenges();
    }, []);


    // ======================================================
    // PROGRESS PERCENTAGE
    // ======================================================

    const getProgressPercentage = (challenge) => {

        if (!challenge.challenge?.target) {
            return 0;
        }

        return Math.min(
            (challenge.progress /
                challenge.challenge.target) *
                100,
            100
        );
    };


    // ======================================================
    // HANDLE PROGRESS INPUT
    // ======================================================

    const handleProgressChange = (
        assignmentId,
        value
    ) => {

        setProgressValues((previous) => ({
            ...previous,
            [assignmentId]: value
        }));
    };


    // ======================================================
    // UPDATE PROGRESS
    // ======================================================

    const handleUpdateProgress = async (item) => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login again.");
                return;
            }

            const value = Number(
                progressValues[item._id]
            );

            if (
                Number.isNaN(value) ||
                value < 0
            ) {
                setError(
                    "Please enter a valid progress value."
                );
                return;
            }

            setUpdating((previous) => ({
                ...previous,
                [item._id]: true
            }));

            const response = await axios.put(
                `${API}/challenges/${item.challenge._id}/progress`,
                {
                    progress: value
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const updatedChallenge =
                response.data.challenge;

            // Update only the changed challenge
            setChallenges((previous) =>
                previous.map((challenge) =>
                    challenge._id === item._id
                        ? updatedChallenge
                        : challenge
                )
            );

            setProgressValues((previous) => ({
                ...previous,
                [item._id]:
                    updatedChallenge.progress
            }));

            // Refresh stats because completion
            // can change XP / completed count / streak
            const statsResponse =
                await axios.get(
                    `${API}/challenges/stats`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setStats(
                statsResponse.data.stats || null
            );

            setError("");

        } catch (error) {

            console.error(
                "Update challenge progress error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update challenge progress."
            );

        } finally {

            setUpdating((previous) => ({
                ...previous,
                [item._id]: false
            }));
        }
    };


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
                                Stay active, complete challenges
                                and earn XP every week.
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
                                    {stats.totalXP}
                                </strong>

                            </div>


                            <div className="challenge-stat-card">

                                <span>
                                    Completed
                                </span>

                                <strong>
                                    {stats.challengesCompleted}
                                </strong>

                            </div>


                            <div className="challenge-stat-card">

                                <span>
                                    Current Streak
                                </span>

                                <strong>
                                    {stats.currentStreak}
                                </strong>

                            </div>


                            <div className="challenge-stat-card">

                                <span>
                                    Best Streak
                                </span>

                                <strong>
                                    {stats.longestStreak}
                                </strong>

                            </div>

                        </div>
                    )}


                    {/* =====================================
                        ERROR
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
                                    Check back later for new
                                    weekly challenges.
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

                                    const challenge =
                                        item.challenge;

                                    const percentage =
                                        getProgressPercentage(
                                            item
                                        );

                                    const completed =
                                        item.status ===
                                        "completed";

                                    const currentValue =
                                        progressValues[
                                            item._id
                                        ] ?? item.progress;

                                    return (
                                        <div
                                            className={`challenge-card ${
                                                completed
                                                    ? "completed"
                                                    : ""
                                            }`}
                                            key={item._id}
                                        >

                                            {/* CATEGORY */}

                                            <div className="challenge-card-top">

                                                <span className="challenge-category">
                                                    {
                                                        challenge.category
                                                    }
                                                </span>

                                                <span
                                                    className={`challenge-difficulty ${
                                                        challenge.difficulty?.toLowerCase()
                                                    }`}
                                                >
                                                    {
                                                        challenge.difficulty
                                                    }
                                                </span>

                                            </div>


                                            {/* TITLE */}

                                            <h2>
                                                {
                                                    challenge.title
                                                }
                                            </h2>


                                            {/* DESCRIPTION */}

                                            <p>
                                                {
                                                    challenge.description
                                                }
                                            </p>


                                            {/* TARGET */}

                                            <div className="challenge-target">

                                                <strong>
                                                    {item.progress}
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


                                            {/* PROGRESS */}

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
                                                    {Math.round(
                                                        percentage
                                                    )}
                                                    %
                                                </span>

                                            </div>


                                            {/* UPDATE PROGRESS */}

                                            {!completed && (
                                                <div className="challenge-update">

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={
                                                            challenge.target
                                                        }
                                                        value={
                                                            currentValue
                                                        }
                                                        onChange={(event) =>
                                                            handleProgressChange(
                                                                item._id,
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="Enter progress"
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
                                                        {updating[
                                                            item._id
                                                        ]
                                                            ? "Updating..."
                                                            : "Update Progress"}
                                                    </button>

                                                </div>
                                            )}


                                            {/* FOOTER */}

                                            <div className="challenge-card-footer">

                                                <span>
                                                    +{
                                                        challenge.xpReward
                                                    } XP
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

