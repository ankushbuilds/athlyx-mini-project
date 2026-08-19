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

module.exports = {
    uploadProfilePic
};