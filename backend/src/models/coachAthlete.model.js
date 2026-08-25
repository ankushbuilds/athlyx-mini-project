const mongoose = require("mongoose");

const coachAthleteSchema = new mongoose.Schema(
    {
        coach: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        athlete: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected"
            ],
            default: "pending"
        },

        requestedBy: {
            type: String,
            enum: [
                "coach",
                "athlete"
            ],
            required: true
        }
    },
    {
        timestamps: true
    }
);

coachAthleteSchema.index(
    {
        coach: 1,
        athlete: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "CoachAthlete",
    coachAthleteSchema
);