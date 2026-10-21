const mongoose = require("mongoose");
const Shortlist = require("../models/shortlist.model");
const Athlete = require("../models/athlete.model");
const User = require("../models/user.model");
const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

// Get the logged-in user's ID
const getUserId = (req) => {
  return req.user?._id || req.user?.id || null;
};

// Add an athlete to the scout's shortlist

exports.addToShortlist = async (req, res) => {
  try {
    const scoutId = getUserId(req);
    const { athleteId } = req.params;

    if (!scoutId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (req.user?.role !== "scout") {
      return res.status(403).json({
        message: "Only scouts can manage their shortlist",
      });
    }

    if (!mongoose.isValidObjectId(athleteId)) {
      return res.status(400).json({
        message: "Invalid athlete ID",
      });
    }

    // Find athlete profile and its linked User account.
    const athleteProfile = await Athlete.findById(athleteId)
      .populate("user", "_id name role");

    if (!athleteProfile || !athleteProfile.user) {
      return res.status(404).json({
        message: "Athlete or athlete user account not found",
      });
    }

    const athleteUserId = athleteProfile.user._id;

    if (athleteProfile.user.role !== "athlete") {
      return res.status(400).json({
        message: "The linked user is not an athlete",
      });
    }

    // Prevent duplicate shortlist entries.
    const existing = await Shortlist.findOne({
      scout: scoutId,
      athlete: athleteId,
    });

    if (existing) {
      return res.status(409).json({
        message: "Athlete is already shortlisted",
      });
    }

    // Save shortlist first.
    const shortlist = await Shortlist.create({
      scout: scoutId,
      athlete: athleteId,
    });

    try {
      // Use the same deterministic key as the chat controller.
      const participantIds = [
        scoutId.toString(),
        athleteUserId.toString(),
      ].sort();

      const participantKey = participantIds.join("_");

      // Find or create the existing chat conversation.
      let conversation = await Conversation.findOne({
        participantKey,
      });

      if (!conversation) {
        try {
          conversation = await Conversation.create({
            participants: participantIds,
            participantKey,
          });
        } catch (createError) {
          // Handle simultaneous conversation creation.
          if (createError.code !== 11000) {
            throw createError;
          }

          conversation = await Conversation.findOne({
            participantKey,
          });
        }
      }

      if (!conversation) {
        throw new Error("Unable to create chat conversation");
      }

      const notificationText =
        "🎉 Congratulations! You've been shortlisted! " +
        "A scout has shortlisted your profile on Athlyx. " +
        "Your talent has caught their attention. " +
        "Keep your profile updated and stay ready for exciting opportunities!";

      // Send an automatic message from the scout to the athlete.
      const message = await Message.create({
        conversation: conversation._id,
        sender: scoutId,
        receiver: athleteUserId,
        text: notificationText,
        read: false,
      });

      // Update the conversation preview and sorting time.
      conversation.lastMessage = message._id;
      conversation.lastMessageAt = message.createdAt;

      await conversation.save();

    } catch (notificationError) {
      // Avoid leaving a shortlist entry that failed to notify.
      await Shortlist.findByIdAndDelete(shortlist._id);

      console.error(
        "Shortlist notification error:",
        notificationError
      );

      return res.status(500).json({
        message:
          "Could not send the shortlist notification. Please try again.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Athlete shortlisted and notification sent",
      shortlist,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Athlete is already shortlisted",
      });
    }

    console.error("Add shortlist error:", error);

    return res.status(500).json({
      message: "Failed to add athlete to shortlist",
    });
  }
};


// Get the logged-in scout's shortlist
exports.getShortlist = async (req, res) => {
  try {
    const scoutId = getUserId(req);

    if (!scoutId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (req.user?.role !== "scout") {
      return res.status(403).json({
        message: "Only scouts can access their shortlist",
      });
    }

    const shortlist = await Shortlist.find({
      scout: scoutId,
    })
      .populate({
        path: "athlete",
        populate: {
          path: "user",
          select: "name email profilePic role",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    // Exclude deleted athletes or missing user references
    const validShortlist = shortlist.filter(
      (item) => item.athlete && item.athlete.user
    );

    return res.status(200).json({
      count: validShortlist.length,
      shortlist: validShortlist,
    });
  } catch (error) {
    console.error("Get shortlist error:", error);

    return res.status(500).json({
      message: "Failed to fetch shortlist",
    });
  }
};

// Remove an athlete from the logged-in scout's shortlist
exports.removeFromShortlist = async (req, res) => {
  try {
    const scoutId = getUserId(req);
    const { athleteId } = req.params;

    if (!scoutId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (req.user?.role !== "scout") {
      return res.status(403).json({
        message: "Only scouts can manage their shortlist",
      });
    }

    if (!mongoose.isValidObjectId(athleteId)) {
      return res.status(400).json({
        message: "Invalid athlete ID",
      });
    }

    const removed = await Shortlist.findOneAndDelete({
      scout: scoutId,
      athlete: athleteId,
    });

    if (!removed) {
      return res.status(404).json({
        message: "Athlete not found in your shortlist",
      });
    }

    return res.status(200).json({
      message: "Athlete removed from shortlist",
    });
  } catch (error) {
    console.error("Remove shortlist error:", error);

    return res.status(500).json({
      message: "Failed to remove athlete",
    });
  }
};