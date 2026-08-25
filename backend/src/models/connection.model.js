const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
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
                "rejected",
                "cancelled"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

connectionSchema.index(
    { coach: 1, athlete: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "Connection",
    connectionSchema
);