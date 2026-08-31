const mongoose = require("mongoose");

const athleteChallengeSchema = new mongoose.Schema(
    {
        athlete: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Athlete",
            required: true
        },

        challenge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge",
            required: true
        },

        weekStart: {
            type: Date,
            required: true
        },

        weekEnd: {
            type: Date,
            required: true
        },

        progress: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active"
        },

        completedAt: {
            type: Date,
            default: null
        },

        xpEarned: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

/*
 * Prevent the same challenge from being assigned
 * to the same athlete more than once in the same week.
 */
athleteChallengeSchema.index(
    {
        athlete: 1,
        challenge: 1,
        weekStart: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "AthleteChallenge",
    athleteChallengeSchema
);