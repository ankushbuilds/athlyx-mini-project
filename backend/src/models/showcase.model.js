const mongoose = require("mongoose");

const showcaseSchema = new mongoose.Schema(
  {
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Athlete",
      required: true
    },

    caption: {
      type: String,
      trim: true,
      maxlength: 2000
    },

    media: [
      {
        url: {
          type: String,
          required: true
        },

        type: {
          type: String,
          enum: ["image", "video"],
          required: true
        },

        fileId: {
          type: String
        }
      }
    ],

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Showcase", showcaseSchema);