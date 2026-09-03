const Challenge = require("../models/challenge.model");
const AthleteChallenge = require("../models/athleteChallenge.model");
const Athlete = require("../models/athlete.model");
const ChallengeStats = require("../models/challengesStats.model");


/* ==========================================================
   GET CURRENT WEEK DATES
   Monday = Start of week
   Sunday = End of week
   ========================================================== */

const getCurrentWeek = () => {
    const now = new Date();

    // Current date/time in India
    const indiaDate = new Date(
        now.toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
        })
    );

    const day = indiaDate.getDay();

    // Monday = 1, Sunday = 0
    const daysFromMonday = day === 0 ? 6 : day - 1;

    const weekStart = new Date(indiaDate);

    weekStart.setDate(
        indiaDate.getDate() - daysFromMonday
    );

    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);

    weekEnd.setDate(
        weekStart.getDate() + 6
    );

    weekEnd.setHours(23, 59, 59, 999);

    return {
        weekStart,
        weekEnd
    };
};


/* ==========================================================
   GET PREVIOUS WEEK START
   ========================================================== */

const getPreviousWeekStart = (weekStart) => {
    const previousWeekStart = new Date(weekStart);

    previousWeekStart.setDate(
        previousWeekStart.getDate() - 7
    );

    return previousWeekStart;
};


/* ==========================================================
   GET WEEKLY CHALLENGES
   GET /api/challenges/weekly
   ========================================================== */

const getWeeklyChallenges = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find athlete profile
        const athlete = await Athlete.findOne({
            user: userId
        });

        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: "Athlete profile not found."
            });
        }

        const { weekStart, weekEnd } = getCurrentWeek();

        // Get active challenges
        const challenges = await Challenge.find({
            isActive: true
        });

        if (!challenges.length) {
            return res.status(200).json({
                success: true,
                message: "No challenges available.",
                challenges: []
            });
        }

        /*
         * Create AthleteChallenge records if they don't
         * already exist for the current week.
         */

        for (const challenge of challenges) {
            const existingAssignment =
                await AthleteChallenge.findOne({
                    athlete: athlete._id,
                    challenge: challenge._id,
                    weekStart
                });

            if (!existingAssignment) {
                await AthleteChallenge.create({
                    athlete: athlete._id,
                    challenge: challenge._id,
                    weekStart,
                    weekEnd,
                    progress: 0,
                    status: "active",
                    xpEarned: 0
                });
            }
        }

        // Get all current week's assignments
        const weeklyChallenges =
            await AthleteChallenge.find({
                athlete: athlete._id,
                weekStart
            })
                .populate("challenge")
                .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            week: {
                start: weekStart,
                end: weekEnd
            },
            challenges: weeklyChallenges
        });

    } catch (error) {
        console.error(
            "Get weekly challenges error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch weekly challenges.",
            error: error.message
        });
    }
};


/* ==========================================================
   GET MY CHALLENGES
   GET /api/challenges/my-challenges
   ========================================================== */

const getMyChallenges = async (req, res) => {
    try {
        const userId = req.user.id;

        const athlete = await Athlete.findOne({
            user: userId
        });

        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: "Athlete profile not found."
            });
        }

        const { weekStart } = getCurrentWeek();

        const challenges =
            await AthleteChallenge.find({
                athlete: athlete._id,
                weekStart
            })
                .populate("challenge")
                .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            challenges
        });

    } catch (error) {
        console.error(
            "Get my challenges error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch your challenges.",
            error: error.message
        });
    }
};


/* ==========================================================
   UPDATE CHALLENGE PROGRESS
   PUT /api/challenges/:challengeId/progress
   ========================================================== */

const updateChallengeProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { challengeId } = req.params;
        const { progress } = req.body;

        // Validate progress
        if (
            progress === undefined ||
            progress === null
        ) {
            return res.status(400).json({
                success: false,
                message: "Progress is required."
            });
        }

        if (
            typeof progress !== "number" ||
            progress < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Progress must be a valid positive number."
            });
        }

        // Find athlete
        const athlete = await Athlete.findOne({
            user: userId
        });

        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: "Athlete profile not found."
            });
        }

        // Current week
        const { weekStart } = getCurrentWeek();

        // Find athlete's challenge for current week
        const athleteChallenge =
            await AthleteChallenge.findOne({
                athlete: athlete._id,
                challenge: challengeId,
                weekStart
            }).populate("challenge");

        if (!athleteChallenge) {
            return res.status(404).json({
                success: false,
                message: "Weekly challenge not found."
            });
        }

        // Don't allow updates to completed challenges
        if (
            athleteChallenge.status === "completed"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "This challenge is already completed."
            });
        }

        const target =
            athleteChallenge.challenge.target;

        // Progress cannot exceed target
        const updatedProgress = Math.min(
            progress,
            target
        );

        athleteChallenge.progress =
            updatedProgress;


        /* ======================================================
           CHALLENGE COMPLETION
           ====================================================== */

        if (updatedProgress >= target) {

            athleteChallenge.status =
                "completed";

            athleteChallenge.completedAt =
                new Date();

            athleteChallenge.xpEarned =
                athleteChallenge.challenge.xpReward;


            /* ==================================================
               GET OR CREATE CHALLENGE STATS
               ================================================== */

            let stats =
                await ChallengeStats.findOne({
                    athlete: athlete._id
                });

            if (!stats) {

                stats =
                    await ChallengeStats.create({
                        athlete: athlete._id,
                        totalXP: 0,
                        challengesCompleted: 0,
                        currentStreak: 0,
                        longestStreak: 0,
                        lastCompletedWeek: null
                    });
            }


            /* ==================================================
               UPDATE TOTAL XP
               ================================================== */

            stats.totalXP +=
                athleteChallenge.challenge.xpReward;

            stats.challengesCompleted += 1;


            /* ==================================================
               UPDATE WEEKLY STREAK
               ================================================== */

            const previousWeekStart =
                getPreviousWeekStart(
                    weekStart
                );


            // First completed week
            if (!stats.lastCompletedWeek) {

                stats.currentStreak = 1;

            }

            // Another challenge completed
            // during the same week
            else if (
                new Date(
                    stats.lastCompletedWeek
                ).getTime() ===
                weekStart.getTime()
            ) {

                // Do not increase streak.
                // Multiple challenges in one week
                // still count as one successful week.

            }

            // Previous week was completed
            else if (
                new Date(
                    stats.lastCompletedWeek
                ).getTime() ===
                previousWeekStart.getTime()
            ) {

                stats.currentStreak += 1;

            }

            // Gap between completed weeks
            else {

                stats.currentStreak = 1;

            }


            /* ==================================================
               UPDATE LONGEST STREAK
               ================================================== */

            if (
                stats.currentStreak >
                stats.longestStreak
            ) {
                stats.longestStreak =
                    stats.currentStreak;
            }


            /* ==================================================
               SAVE LAST COMPLETED WEEK
               ================================================== */

            stats.lastCompletedWeek =
                weekStart;


            await stats.save();
        }


        /* ======================================================
           SAVE ATHLETE CHALLENGE
           ====================================================== */

        await athleteChallenge.save();
        console.log("UPDATED FROM BACKEND:", athleteChallenge);
console.log("UPDATED PROGRESS:", athleteChallenge.progress);

        /* ======================================================
           RESPONSE
           ====================================================== */

        return res.status(200).json({
            success: true,

            message:
                athleteChallenge.status ===
                "completed"
                    ? "Challenge completed successfully!"
                    : "Challenge progress updated successfully.",

            challenge: athleteChallenge
        });

    } catch (error) {

        console.error(
            "Update challenge progress error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update challenge progress.",
            error: error.message
        });
    }
};


/* ==========================================================
   GET CHALLENGE STATS
   GET /api/challenges/stats
   ========================================================== */

const getChallengeStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find athlete
        const athlete = await Athlete.findOne({
            user: userId
        });

        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: "Athlete profile not found."
            });
        }

        // Find stats
        let stats =
            await ChallengeStats.findOne({
                athlete: athlete._id
            });

        // Create stats if they don't exist
        if (!stats) {

            stats =
                await ChallengeStats.create({
                    athlete: athlete._id,
                    totalXP: 0,
                    challengesCompleted: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    lastCompletedWeek: null
                });
        }


        /* ======================================================
           CHECK WHETHER CURRENT STREAK IS STILL ACTIVE
           ====================================================== */

        const { weekStart } =
            getCurrentWeek();

        let currentStreak =
            stats.currentStreak;


        if (stats.lastCompletedWeek) {

            const lastCompletedWeek =
                new Date(
                    stats.lastCompletedWeek
                );

            const previousWeekStart =
                getPreviousWeekStart(
                    weekStart
                );


            /*
             * If the last completed week is older
             * than the previous week, the streak
             * is no longer active.
             */

            if (
                lastCompletedWeek.getTime() !==
                    weekStart.getTime() &&
                lastCompletedWeek.getTime() !==
                    previousWeekStart.getTime()
            ) {

                currentStreak = 0;
            }
        }


        return res.status(200).json({
            success: true,
            stats: {
                totalXP: stats.totalXP,
                challengesCompleted:
                    stats.challengesCompleted,
                currentStreak,
                longestStreak:
                    stats.longestStreak,
                lastCompletedWeek:
                    stats.lastCompletedWeek
            }
        });

    } catch (error) {

        console.error(
            "Get challenge stats error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch challenge stats.",
            error: error.message
        });
    }
};
/* ==========================================================
   GET CHALLENGE HISTORY
   GET /api/challenges/history
   ========================================================== */

const getChallengeHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const athlete = await Athlete.findOne({
            user: userId
        });

        if (!athlete) {
            return res.status(404).json({
                success: false,
                message: "Athlete profile not found."
            });
        }

        const history = await AthleteChallenge.find({
            athlete: athlete._id
        })
            .populate("challenge")
            .sort({
                weekStart: -1,
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            history
        });

    } catch (error) {
        console.error(
            "Get challenge history error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch challenge history.",
            error: error.message
        });
    }
};


/* ==========================================================
   EXPORT CONTROLLERS
   ========================================================== */

module.exports = {
    getWeeklyChallenges,
    getMyChallenges,
    updateChallengeProgress,
    getChallengeStats,
    getChallengeHistory
};