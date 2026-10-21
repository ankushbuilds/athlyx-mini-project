
const mongoose = require("mongoose");

const shortlistSchema = new mongoose.Schema(
  {
    scout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Athlete",
      required: true,
    },
  },
  { timestamps: true }
);

shortlistSchema.index(
  { scout: 1, athlete: 1 },
  { unique: true }
);

module.exports = mongoose.model("Shortlist", shortlistSchema);
