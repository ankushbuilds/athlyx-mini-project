const mongoose = require("mongoose");
const Shortlist = require("../models/shortlist.model");
const Athlete = require("../models/athlete.model");

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

    const athleteExists = await Athlete.findById(athleteId);

    if (!athleteExists) {
      return res.status(404).json({
        message: "Athlete not found",
      });
    }

    const existing = await Shortlist.findOne({
      scout: scoutId,
      athlete: athleteId,
    });

    if (existing) {
      return res.status(409).json({
        message: "Athlete is already shortlisted",
      });
    }

    const shortlist = await Shortlist.create({
      scout: scoutId,
      athlete: athleteId,
    });

    return res.status(201).json({
      message: "Athlete added to shortlist",
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