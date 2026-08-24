const User = require("../models/user.model");
const Athlete = require("../models/athlete.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER USER
// ==========================================

async function registerUser(req, res) {
    try {
        let { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        name = name.trim();
        email = email.trim().toLowerCase();
        role = role || "athlete";

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
}

// ==========================================
// LOGIN USER
// ==========================================

async function loginUser(req, res) {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        email = email.trim().toLowerCase();

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

// ==========================================
// GET CURRENT USER
// ==========================================

async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });
    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// ==========================================
// DELETE ACCOUNT
// ==========================================

async function deleteAccount(req, res) {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await Athlete.findOneAndDelete({
            user: userId
        });

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (error) {
        console.error("Delete account error:", error);

        return res.status(500).json({
            success: false,
            message: "Error deleting account"
        });
    }
}

// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Change password error:", error);

        return res.status(500).json({
            message: "Failed to change password"
        });
    }
};

// ==========================================
// CHANGE EMAIL
// ==========================================

const changeEmail = async (req, res) => {
    try {
        const { currentPassword, newEmail } = req.body;

        if (!currentPassword || !newEmail) {
            return res.status(400).json({
                message: "Current password and new email are required"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        const normalizedEmail = newEmail.trim().toLowerCase();

        if (normalizedEmail === user.email) {
            return res.status(400).json({
                message: "New email must be different from current email"
            });
        }

        const emailExists = await User.findOne({
            email: normalizedEmail
        });

        if (emailExists) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        user.email = normalizedEmail;

        await user.save();

        return res.status(200).json({
            message: "Email address changed successfully",
            email: user.email
        });
    } catch (error) {
        console.error("Change email error:", error);

        return res.status(500).json({
            message: "Failed to change email address"
        });
    }
};

// ==========================================
// GET ATHLETE SETTINGS
// ==========================================

const getSettings = async (req, res) => {
    try {
        const athlete = await Athlete.findOne({
            user: req.user.id
        });

        if (!athlete) {
            return res.status(404).json({
                message: "Athlete profile not found"
            });
        }

        return res.status(200).json({
            settings: athlete.settings
        });
    } catch (error) {
        console.error("Get settings error:", error);

        return res.status(500).json({
            message: "Failed to fetch settings"
        });
    }
};

// ==========================================
// UPDATE ATHLETE SETTINGS
// ==========================================

const updateSettings = async (req, res) => {
    try {
        const {
            profileVisibility,
            contactVisible,
            messageNotifications,
            opportunityNotifications,
            emailNotifications
        } = req.body;

        if (
            profileVisibility !== undefined &&
            !["Public", "Private"].includes(profileVisibility)
        ) {
            return res.status(400).json({
                message: "Invalid profile visibility"
            });
        }

        if (
            contactVisible !== undefined &&
            typeof contactVisible !== "boolean"
        ) {
            return res.status(400).json({
                message: "Invalid contact visibility value"
            });
        }

        if (
            messageNotifications !== undefined &&
            typeof messageNotifications !== "boolean"
        ) {
            return res.status(400).json({
                message: "Invalid message notification value"
            });
        }

        if (
            opportunityNotifications !== undefined &&
            typeof opportunityNotifications !== "boolean"
        ) {
            return res.status(400).json({
                message: "Invalid opportunity notification value"
            });
        }

        if (
            emailNotifications !== undefined &&
            typeof emailNotifications !== "boolean"
        ) {
            return res.status(400).json({
                message: "Invalid email notification value"
            });
        }

        const athlete = await Athlete.findOne({
            user: req.user.id
        });

        if (!athlete) {
            return res.status(404).json({
                message: "Athlete profile not found"
            });
        }

        if (!athlete.settings) {
            athlete.settings = {};
        }

        if (profileVisibility !== undefined) {
            athlete.settings.profileVisibility = profileVisibility;
        }

        if (contactVisible !== undefined) {
            athlete.settings.contactVisible = contactVisible;
        }

        if (messageNotifications !== undefined) {
            athlete.settings.messageNotifications = messageNotifications;
        }

        if (opportunityNotifications !== undefined) {
            athlete.settings.opportunityNotifications = opportunityNotifications;
        }

        if (emailNotifications !== undefined) {
            athlete.settings.emailNotifications = emailNotifications;
        }

        await athlete.save();

        return res.status(200).json({
            message: "Settings updated successfully",
            settings: athlete.settings
        });
    } catch (error) {
        console.error("Update settings error:", error);

        return res.status(500).json({
            message: "Failed to update settings"
        });
    }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    deleteAccount,
    changePassword,
    changeEmail,
    getSettings,
    updateSettings
};