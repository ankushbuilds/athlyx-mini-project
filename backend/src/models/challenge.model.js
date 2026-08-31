const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Strength",
                "Endurance",
                "Flexibility",
                "Recovery",
                "Consistency",
                "Wellness"
            ],
            trim: true
        },

        target: {
            type: Number,
            required: true,
            min: 1
        },

        unit: {
            type: String,
            required: true,
            enum: [
                "reps",
                "km",
                "minutes",
                "hours",
                "days",
                "steps",
                "seconds"
            ],
            trim: true
        },

        difficulty: {
            type: String,
            required: true,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium"
        },

        xpReward: {
            type: Number,
            required: true,
            min: 0,
            default: 50
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Challenge", challengeSchema);