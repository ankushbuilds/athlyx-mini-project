const User = require("../models/user.model");

// ==========================================
// GET COACH PROFILE
// ==========================================

const getCoachProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role !== "coach") {
            return res.status(403).json({
                message: "Access denied. Coach account required."
            });
        }

        return res.status(200).json({
            coach: user
        });
    } catch (error) {
        console.error("Get coach profile error:", error);

        return res.status(500).json({
            message: "Failed to fetch coach profile"
        });
    }
};

// ==========================================
// UPDATE COACH PROFILE
// ==========================================

const updateCoachProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.role !== "coach") {
            return res.status(403).json({
                message: "Access denied. Coach account required."
            });
        }

        const {
            name,
            phone,
            city,
            state,
            country,
            sport,
            specialization,
            experience,
            organization,
            achievements,
            skills,
            bio,
            isAvailable
        } = req.body;

        // ==========================================
        // NAME
        // ==========================================

        if (name !== undefined) {
            user.name = String(name).trim();
        }

        // ==========================================
        // PHONE
        // ==========================================

        if (phone !== undefined) {
            user.phone = String(phone).trim();
        }

        // ==========================================
        // ADDRESS
        // ==========================================

        if (!user.address) {
            user.address = {};
        }

        if (city !== undefined) {
            user.address.city = String(city).trim();
        }

        if (state !== undefined) {
            user.address.state = String(state).trim();
        }

        if (country !== undefined) {
            user.address.country = String(country).trim();
        }

        // ==========================================
        // SPORT
        // ==========================================

        if (sport !== undefined) {
            user.sport = String(sport).trim();
        }

        // ==========================================
        // SPECIALIZATION
        // ==========================================

        if (specialization !== undefined) {
            user.specialization =
                String(specialization).trim();
        }

        // ==========================================
        // EXPERIENCE
        // ==========================================

        if (experience !== undefined) {
            user.experience =
                Number(experience) || 0;
        }

        // ==========================================
        // ORGANIZATION
        // ==========================================

        if (organization !== undefined) {
            user.organization =
                String(organization).trim();
        }

        // ==========================================
        // ACHIEVEMENTS
        // ==========================================

        if (achievements !== undefined) {
            user.achievements =
                Array.isArray(achievements)
                    ? achievements
                        .map((item) => String(item).trim())
                        .filter(Boolean)
                    : [];
        }

        // ==========================================
        // SKILLS
        // ==========================================

        // NOTE:
        // skills is not present in your current
        // User schema. This will only persist after
        // adding skills to the schema.

        if (skills !== undefined) {
            user.skills =
                Array.isArray(skills)
                    ? skills
                        .map((item) => String(item).trim())
                        .filter(Boolean)
                    : [];
        }

        // ==========================================
        // BIO
        // ==========================================

        if (bio !== undefined) {
            user.bio = String(bio).trim();
        }

        // ==========================================
        // AVAILABILITY
        // ==========================================

        if (isAvailable !== undefined) {
            user.isAvailable = Boolean(isAvailable);
        }

        // ==========================================
        // SAVE
        // ==========================================

        await user.save();

        const updatedUser = await User.findById(
            user._id
        ).select("-password");

        return res.status(200).json({
            message: "Coach profile updated successfully",
            coach: updatedUser
        });

    } catch (error) {
        console.error(
            "Update coach profile error:",
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                "Failed to update coach profile"
        });
    }
};

module.exports = {
    getCoachProfile,
    updateCoachProfile
};