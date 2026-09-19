const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
    {
        coach: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: undefined
        },

        academy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: undefined
        },

        athlete: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: undefined
        },

        requestedBy: {
            type: String,
            enum: [
                "coach",
                "academy",
                "athlete"
            ],
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


// Exactly two participants must exist
connectionSchema.pre("validate", function (next) {
    const participants = [
        this.coach,
        this.academy,
        this.athlete
    ].filter(Boolean);

    if (participants.length !== 2) {
        return next(
            new Error(
                "A connection must have exactly two participants"
            )
        );
    }

    next();
});


// Coach ↔ Athlete
connectionSchema.index(
    { coach: 1, athlete: 1 },
    {
        unique: true,
        partialFilterExpression: {
            coach: { $type: "objectId" },
            athlete: { $type: "objectId" }
        }
    }
);


// Academy ↔ Athlete
connectionSchema.index(
    { academy: 1, athlete: 1 },
    {
        unique: true,
        partialFilterExpression: {
            academy: { $type: "objectId" },
            athlete: { $type: "objectId" }
        }
    }
);


// Academy ↔ Coach
connectionSchema.index(
    { academy: 1, coach: 1 },
    {
        unique: true,
        partialFilterExpression: {
            academy: { $type: "objectId" },
            coach: { $type: "objectId" }
        }
    }
);


module.exports = mongoose.model(
    "Connection",
    connectionSchema
);