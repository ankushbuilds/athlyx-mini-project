const mongoose = require("mongoose");
const Challenge = require("../models/challenge.model");
const AthleteChallenge = require("../models/athleteChallenge.model");

require("dotenv").config();

const challenges = [
    {
        title: "1000 Push-ups",
        description:
            "Complete 1000 push-ups throughout the week.",
        category: "Strength",
        target: 1000,
        unit: "reps",
        difficulty: "Medium",
        xpReward: 100
    },

    {
        title: "1000 Squats",
        description:
            "Complete 1000 bodyweight squats throughout the week.",
        category: "Strength",
        target: 1000,
        unit: "reps",
        difficulty: "Medium",
        xpReward: 100
    },

    {
        title: "25 KM Running",
        description:
            "Complete a total of 25 kilometers of running throughout the week.",
        category: "Endurance",
        target: 25,
        unit: "km",
        difficulty: "Medium",
        xpReward: 120
    },

    {
        title: "150 Minutes Stretching",
        description:
            "Complete 150 minutes of stretching throughout the week.",
        category: "Flexibility",
        target: 150,
        unit: "minutes",
        difficulty: "Medium",
        xpReward: 100
    },

    {
        title: "5 Active Days",
        description:
            "Stay physically active for at least 5 days this week.",
        category: "Consistency",
        target: 5,
        unit: "days",
        difficulty: "Medium",
        xpReward: 100
    },

    {
        title: "100000 Steps",
        description:
            "Complete 100,000 steps throughout the week.",
        category: "Endurance",
        target: 100000,
        unit: "steps",
        difficulty: "Hard",
        xpReward: 150
    },

    {
        title: "100-Minute Plank",
        description:
            "Complete a total of 100 minutes of plank exercises throughout the week.",
        category: "Strength",
        target: 6000,
        unit: "seconds",
        difficulty: "Hard",
        xpReward: 150
    },

    {
        title: "4 Recovery Sessions",
        description:
            "Complete 4 recovery or mobility sessions during the week.",
        category: "Recovery",
        target: 4,
        unit: "days",
        difficulty: "Medium",
        xpReward: 100
    },

    {
        title: "7 Days Hydration",
        description:
            "Meet your daily hydration goal for all 7 days of the week.",
        category: "Wellness",
        target: 7,
        unit: "days",
        difficulty: "Hard",
        xpReward: 150
    }
];

const seedChallenges = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected.");

        // =====================================================
        // DELETE OLD ATHLETE CHALLENGE ASSIGNMENTS
        // =====================================================

        const deletedAssignments =
            await AthleteChallenge.deleteMany({});

        console.log(
            `${deletedAssignments.deletedCount} old athlete challenge assignments deleted.`
        );

        // =====================================================
        // DELETE OLD CHALLENGES
        // =====================================================

        const deletedChallenges =
            await Challenge.deleteMany({});

        console.log(
            `${deletedChallenges.deletedCount} old challenges deleted.`
        );

        // =====================================================
        // INSERT NEW CHALLENGES
        // =====================================================

        const insertedChallenges =
            await Challenge.insertMany(challenges);

        console.log(
            `${insertedChallenges.length} challenges inserted successfully.`
        );

        // =====================================================
        // CLOSE CONNECTION
        // =====================================================

        await mongoose.connection.close();

        console.log("MongoDB connection closed.");

        process.exit(0);

    } catch (error) {

        console.error(
            "Challenge seeding failed:",
            error
        );

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }

        process.exit(1);
    }
};

seedChallenges();