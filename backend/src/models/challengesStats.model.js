const mongoose = require("mongoose");

const challengeStatsSchema = new mongoose.Schema(
    {
        athlete: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Athlete",
            required: true,
            unique: true
        },

        totalXP: {
            type: Number,
            default: 0,
            min: 0
        },

        challengesCompleted: {
            type: Number,
            default: 0,
            min: 0
        },

        currentStreak: {
            type: Number,
            default: 0,
            min: 0
        },

        longestStreak: {
            type: Number,
            default: 0,
            min: 0
        },

        lastCompletedWeek: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ChallengeStats",
    challengeStatsSchema
);