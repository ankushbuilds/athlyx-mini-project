const mongoose = require("mongoose");

const opportunityApplicationSchema =
  new mongoose.Schema(
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

      resumeUrl: {
        type: String,
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
      }
    },
    {
      timestamps: true
    }
  );

opportunityApplicationSchema.index(
  {
    opportunity: 1,
    athlete: 1
  },
  {
    unique: true
  }
);

module.exports =
  mongoose.model(
    "OpportunityApplication",
    opportunityApplicationSchema
  );