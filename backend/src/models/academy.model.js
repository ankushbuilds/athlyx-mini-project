const mongoose = require("mongoose");

const academySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    academyName: {
      type: String,
      required: true,
      trim: true
    },

    profilePic: {
      type: String,
      default: ""
    },

    sport: {
      type: String,
      required: true,
      trim: true
    },

    specialization: {
      type: String,
      trim: true,
      default: ""
    },

    establishedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear()
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    address: {
      type: String,
      trim: true,
      default: "India"
    },

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

    trainingPrograms: {
      type: [String],
      default: []
    },

    facilities: {
      type: [String],
      default: []
    },

    achievements: {
      type: [String],
      default: []
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    socialLinks: {
      website: {
        type: String,
        trim: true,
        default: ""
      },

      instagram: {
        type: String,
        trim: true,
        default: ""
      },

      facebook: {
        type: String,
        trim: true,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Academy", academySchema);