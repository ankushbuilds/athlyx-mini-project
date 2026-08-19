const mongoose = require("mongoose");

const athleteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        dateOfBirth: {
            type: Date
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },

        phone: {
            type: String,
            trim: true
        },

        address: {
            city: {
                type: String,
                trim: true
            },
            state: {
                type: String,
                trim: true
            },
            country: {
                type: String,
                default: "India",
                trim: true
            }
        },

        sport: {
            type: String,
            required: true,
            trim: true
        },

        position: {
            type: String,
            trim: true
        },

        experience: {
            type: Number,
            min: 0,
            default: 0
        },

        achievements: [
            {
                title: {
                    type: String,
                    trim: true
                },
                description: {
                    type: String,
                    trim: true
                },
                year: {
                    type: Number
                }
            }
        ],

        skills: [
            {
                type: String,
                trim: true
            }
        ],

        bio: {
            type: String,
            trim: true,
            maxlength: 500
        },

        height: {
            type: Number,
            min: 0
        },

        weight: {
            type: Number,
            min: 0
        },

        socialLinks: {
            instagram: {
                type: String,
                trim: true
            },
            facebook: {
                type: String,
                trim: true
            },
            youtube: {
                type: String,
                trim: true
            }
        },

        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending"
        },

        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Athlete", athleteSchema);