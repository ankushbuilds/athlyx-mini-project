const mongoose = require("mongoose");

const opportunityApplicationSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true
    },

    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

// Same athlete cannot apply to the same event twice
opportunityApplicationSchema.index(
  {
    opportunity: 1,
    athlete: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model(
  "OpportunityApplication",
  opportunityApplicationSchema
);