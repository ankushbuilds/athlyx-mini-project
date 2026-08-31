const mongoose = require("mongoose");
const Challenge = require("../models/challenge.model");
require("dotenv").config();

const challenges = [
    {
        title: "100 Push-ups",
        description: "Complete 100 push-ups during the week.",
        category: "Strength",
        target: 100,
        unit: "reps",
        difficulty: "Easy",
        xpReward: 50
    },

    {
        title: "200 Squats",
        description: "Complete 200 bodyweight squats during the week.",
        category: "Strength",
        target: 200,
        unit: "reps",
        difficulty: "Medium",
        xpReward: 100
    },

    {
        title: "10 KM Running",
        description: "Complete a total of 10 kilometers of running during the week.",
        category: "Endurance",
        target: 10,
        unit: "km",
        difficulty: "Medium",
        xpReward: 100
    },

    {
        title: "60 Minutes Stretching",
        description: "Complete 60 minutes of stretching during the week.",
        category: "Flexibility",
        target: 60,
        unit: "minutes",
        difficulty: "Easy",
        xpReward: 50
    },

    {
        title: "5 Active Days",
        description: "Stay physically active for at least 5 days this week.",
        category: "Consistency",
        target: 5,
        unit: "days",
        difficulty: "Medium",
        xpReward: 100
    },

    {
        title: "50,000 Steps",
        description: "Complete 50,000 steps throughout the week.",
        category: "Endurance",
        target: 50000,
        unit: "steps",
        difficulty: "Hard",
        xpReward: 150
    },

    {
        title: "5-Minute Plank",
        description: "Complete a total of 5 minutes of plank exercises.",
        category: "Strength",
        target: 300,
        unit: "seconds",
        difficulty: "Hard",
        xpReward: 150
    },

    {
        title: "3 Recovery Sessions",
        description: "Complete 3 recovery or mobility sessions during the week.",
        category: "Recovery",
        target: 3,
        unit: "days",
        difficulty: "Easy",
        xpReward: 50
    },

    {
        title: "120 Minutes Training",
        description: "Complete at least 120 minutes of physical training this week.",
        category: "Consistency",
        target: 120,
        unit: "minutes",
        difficulty: "Medium",
        xpReward: 100
    },

    {
        title: "7 Days Hydration",
        description: "Maintain your daily hydration goal for all 7 days.",
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

        await Challenge.deleteMany({});

        await Challenge.insertMany(challenges);

        console.log(`${challenges.length} challenges inserted successfully.`);

        await mongoose.connection.close();

        console.log("MongoDB connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("Challenge seeding failed:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedChallenges();