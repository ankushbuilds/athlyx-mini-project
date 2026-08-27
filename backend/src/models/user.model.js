const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["athlete", "coach", "scout", "academy", "admin"],
      required: true,
    },

    profilePic: {
      type: String,
      default: "",
    },

    // ==========================================
    // COACH PROFILE
    // ==========================================

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      city: {
        type: String,
        trim: true,
        default: "",
      },

      state: {
        type: String,
        trim: true,
        default: "",
      },

      country: {
        type: String,
        trim: true,
        default: "India",
      },
    },

    sport: {
      type: String,
      trim: true,
      default: "",
    },

    specialization: {
      type: String,
      trim: true,
      default: "",
    },

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    organization: {
      type: String,
      trim: true,
      default: "",
    },

    achievements: {
      type: [String],
      default: [],
    },
    skills: {
  type: [String],
  default: [],
},

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    // ==========================================
// EMAIL VERIFICATION
// ==========================================

emailVerified: {
  type: Boolean,
  default: false,
},

emailVerificationOTP: {
  type: String,
  default: "",
},

emailVerificationOTPExpires: {
  type: Date,
  default: null,
},

    // ==========================================
    // SETTINGS
    // ==========================================

    settings: {
      profileVisibility: {
        type: String,
        enum: ["Public", "Private"],
        default: "Public",
      },

      contactVisible: {
        type: Boolean,
        default: true,
      },

      messageNotifications: {
        type: Boolean,
        default: true,
      },

      opportunityNotifications: {
        type: Boolean,
        default: true,
      },

      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);