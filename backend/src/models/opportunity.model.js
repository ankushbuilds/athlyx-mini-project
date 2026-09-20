const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    // ======================================================
    // ACADEMY
    // ======================================================

    academy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ======================================================
    // EVENT TITLE
    // ======================================================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    // ======================================================
    // EVENT TYPE
    // ======================================================

    type: {
      type: String,
      required: true,
      enum: [
        "Tournament",
        "Trials",
        "Competition",
        "Camp",
        "Program",
        "Talent Hunt",
        "Other"
      ],
      trim: true
    },

    // ======================================================
    // SPORT
    // ======================================================

    sport: {
      type: String,
      required: true,
      trim: true
    },

    // ======================================================
    // EVENT DATE
    // ======================================================

    date: {
      type: Date,
      required: true
    },

    // ======================================================
    // REGISTRATION DEADLINE
    // ======================================================

    registrationDeadline: {
      type: Date,
      required: true
    },

    // ======================================================
    // LOCATION
    // ======================================================

    location: {
      type: String,
      required: true,
      trim: true
    },

    // ======================================================
    // DESCRIPTION
    // ======================================================

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },

    // ======================================================
    // ELIGIBILITY
    // ======================================================

    eligibility: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    },

    // ======================================================
    // STATUS
    // ======================================================

    status: {
      type: String,
      enum: [
        "draft",
        "active",
        "closed"
      ],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Opportunity",
  opportunitySchema
);