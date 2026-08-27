const User = require("../models/user.model");
const imagekit = require("../config/imagekit");

const uploadProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select an image"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: `profile-${user._id}-${Date.now()}`,
            folder: "/athlyx/profile-pics"
        });

        user.profilePic = result.url;
        await user.save();

        res.status(200).json({
            message: "Profile picture uploaded successfully",
            profilePic: user.profilePic
        });
    } catch (error) {
        console.error("Profile picture upload error:", error);

        res.status(500).json({
            message: "Failed to upload profile picture"
        });
    }
};
const getAllCoaches = async (req, res) => {
  try {
    const coaches = await User.find({ role: "coach" })
      .select(
        "name profilePic sport specialization experience organization bio address isAvailable"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      coaches,
    });
  } catch (error) {
    console.error("Get coaches error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch coaches",
    });
  }
};
async function getCoachById(req, res) {
    try {

        const { coachId } = req.params;

        const coach = await User.findOne({
            _id: coachId,
            role: "coach"
        }).select(
            "-password -emailVerificationOTP -emailVerificationOTPExpires"
        );

        if (!coach) {
            return res.status(404).json({
                success: false,
                message: "Coach not found"
            });
        }

        return res.status(200).json({
            success: true,
            coach
        });

    } catch (error) {

        console.error(
            "Get coach by ID error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch coach profile",
            error: error.message
        });
    }
}



module.exports = {
    uploadProfilePic,
    getAllCoaches,
    getCoachById
};