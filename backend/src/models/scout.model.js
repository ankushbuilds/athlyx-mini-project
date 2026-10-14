const mongoose = require("mongoose");

const scoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    organization: {
      type: String,
      trim: true,
      default: ""
    },

    sport: {
      type: String,
      trim: true,
      default: ""
    },

    specialization: {
      type: String,
      trim: true,
      default: ""
    },

    experience: {
      type: Number,
      default: 0
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    address: {
      city: {
        type: String,
        trim: true,
        default: ""
      },

      state: {
        type: String,
        trim: true,
        default: ""
      },

      country: {
        type: String,
        trim: true,
        default: "India"
      }
    },

    achievements: {
      type: String,
      trim: true,
      default: ""
    },

    skills: {
      type: String,
      trim: true,
      default: ""
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ""
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    socialLinks: {
      instagram: {
        type: String,
        default: ""
      },

      linkedin: {
        type: String,
        default: ""
      },

      website: {
        type: String,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Scout", scoutSchema);