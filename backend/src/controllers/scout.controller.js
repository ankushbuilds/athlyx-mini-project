const Scout = require("../models/scout.model");
const User = require("../models/user.model");


// ===============================
// CREATE / UPDATE SCOUT PROFILE
// ===============================
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      organization,
      sport,
      specialization,
      experience,
      phone,
      address,
      achievements,
      skills,
      bio,
      isAvailable,
      socialLinks
    } = req.body;

    let scout = await Scout.findOne({ user: userId });

    if (!scout) {
      scout = new Scout({
        user: userId
      });
    }

    scout.organization = organization || "";
    scout.sport = sport || "";
    scout.specialization = specialization || "";
    scout.experience = experience || 0;
    scout.phone = phone || "";
    scout.address = address || "";
    scout.achievements = achievements || "";
    scout.skills = skills || "";
    scout.bio = bio || "";
    scout.isAvailable =
      typeof isAvailable === "boolean"
        ? isAvailable
        : scout.isAvailable;

    scout.socialLinks = {
      instagram: socialLinks?.instagram || "",
      linkedin: socialLinks?.linkedin || "",
      website: socialLinks?.website || ""
    };

    await scout.save();

    res.status(200).json({
      success: true,
      message: "Scout profile saved successfully",
      scout
    });
  } catch (error) {
    console.error("Scout profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save scout profile"
    });
  }
};


// ===============================
// GET MY PROFILE
// ===============================
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const scout = await Scout.findOne({
      user: userId
    }).populate(
      "user",
      "name email role profilePic"
    );

    if (!scout) {
      return res.status(404).json({
        success: false,
        message: "Scout profile not found"
      });
    }

    res.status(200).json({
      success: true,
      scout
    });

  } catch (error) {
    console.error(
      "Get scout profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch scout profile"
    });
  }
};


// ===============================
// GET SCOUT BY ID
// ===============================
exports.getScoutById = async (req, res) => {
  try {
    const scout = await Scout.findById(req.params.id)
      .populate(
        "user",
        "name email role profilePic"
      );

    if (!scout) {
      return res.status(404).json({
        success: false,
        message: "Scout not found"
      });
    }

    res.status(200).json({
      success: true,
      scout
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch scout"
    });
  }
};


// ===============================
// DELETE PROFILE
// ===============================
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    await Scout.findOneAndDelete({
      user: userId
    });

    res.status(200).json({
      success: true,
      message: "Scout profile deleted"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete scout profile"
    });
  }
};