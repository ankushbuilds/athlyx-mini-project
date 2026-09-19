const Academy = require("../models/academy.model");


// Create Academy Profile
const createAcademyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingAcademy = await Academy.findOne({
      user: userId
    });

    if (existingAcademy) {
      return res.status(400).json({
        message: "Academy profile already exists"
      });
    }

    const {
      academyName,
      sport,
      specialization,
      establishedYear,
      phone,
      address,
      city,
      state,
      trainingPrograms,
      facilities,
      achievements,
      bio,
      isAvailable,
      socialLinks
    } = req.body;

    if (!academyName || !sport) {
      return res.status(400).json({
        message: "Academy name and sport are required"
      });
    }

    const academy = await Academy.create({
      user: userId,
      academyName,
      sport,
      specialization,
      establishedYear,
      phone,
      address,
      city,
      state,
      trainingPrograms,
      facilities,
      achievements,
      bio,
      isAvailable,
      socialLinks
    });

    return res.status(201).json({
      message: "Academy profile created successfully",
      academy
    });

  } catch (error) {
    console.error("Create academy profile error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Get My Academy Profile
const getMyAcademyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const academy = await Academy.findOne({
      user: userId
    }).populate(
      "user",
      "name email role"
    );

    if (!academy) {
      return res.status(404).json({
        message: "Academy profile not found"
      });
    }

    return res.status(200).json({
      academy
    });

  } catch (error) {
    console.error("Get academy profile error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Get Academy Profile By ID
const getAcademyProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const academy = await Academy.findById(id).populate(
      "user",
      "name email role"
    );

    if (!academy) {
      return res.status(404).json({
        message: "Academy profile not found"
      });
    }

    return res.status(200).json({
      academy
    });

  } catch (error) {
    console.error("Get academy profile by ID error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Update Academy Profile
const updateAcademyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const academy = await Academy.findOne({
      user: userId
    });

    if (!academy) {
      return res.status(404).json({
        message: "Academy profile not found"
      });
    }

    const {
      academyName,
      sport,
      specialization,
      establishedYear,
      phone,
      address,
      city,
      state,
      trainingPrograms,
      facilities,
      achievements,
      bio,
      isAvailable,
      socialLinks
    } = req.body;

    if (academyName !== undefined) {
      academy.academyName = academyName;
    }

    if (sport !== undefined) {
      academy.sport = sport;
    }

    if (specialization !== undefined) {
      academy.specialization = specialization;
    }

    if (establishedYear !== undefined) {
      academy.establishedYear = establishedYear;
    }

    if (phone !== undefined) {
      academy.phone = phone;
    }

    if (address !== undefined) {
      academy.address = address;
    }

    if (city !== undefined) {
      academy.city = city;
    }

    if (state !== undefined) {
      academy.state = state;
    }

    if (trainingPrograms !== undefined) {
      academy.trainingPrograms = trainingPrograms;
    }

    if (facilities !== undefined) {
      academy.facilities = facilities;
    }

    if (achievements !== undefined) {
      academy.achievements = achievements;
    }

    if (bio !== undefined) {
      academy.bio = bio;
    }

    if (isAvailable !== undefined) {
      academy.isAvailable = isAvailable;
    }

    if (socialLinks !== undefined) {
      academy.socialLinks = socialLinks;
    }

    await academy.save();

    return res.status(200).json({
      message: "Academy profile updated successfully",
      academy
    });

  } catch (error) {
    console.error("Update academy profile error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Delete Academy Profile
const deleteAcademyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const academy = await Academy.findOneAndDelete({
      user: userId
    });

    if (!academy) {
      return res.status(404).json({
        message: "Academy profile not found"
      });
    }

    return res.status(200).json({
      message: "Academy profile deleted successfully"
    });

  } catch (error) {
    console.error("Delete academy profile error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  createAcademyProfile,
  getMyAcademyProfile,
  getAcademyProfileById,
  updateAcademyProfile,
  deleteAcademyProfile
};