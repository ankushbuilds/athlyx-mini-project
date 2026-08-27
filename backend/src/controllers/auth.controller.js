const User = require("../models/user.model");
const Athlete = require("../models/athlete.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

// ==========================================
// RESEND
// ==========================================

const resend = new Resend(process.env.RESEND_API_KEY);

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

        if (!["athlete", "coach"].includes(role)) {
            return res.status(400).json({
                message: "Invalid user role"
            });
        }

        // ==========================================
        // CHECK EXISTING USER
        // ==========================================

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            // Already verified
            if (existingUser.emailVerified) {
                return res.status(400).json({
                    message: "User already exists"
                });
            }

            // ==========================================
            // USER EXISTS BUT EMAIL NOT VERIFIED
            // SEND NEW OTP
            // ==========================================

            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            const otpExpires = new Date(
                Date.now() + 10 * 60 * 1000
            );

            existingUser.name = name;

            existingUser.password = await bcrypt.hash(
                password,
                10
            );

            existingUser.role = role;

            existingUser.emailVerified = false;

            existingUser.emailVerificationOTP = otp;

            existingUser.emailVerificationOTPExpires =
                otpExpires;

            await existingUser.save();

            // ==========================================
            // SEND OTP USING RESEND
            // ==========================================

            const { data, error } = await resend.emails.send({
                from: "onboarding@resend.dev",
                to: email,
                subject: "Athlyx Email Verification OTP",
                text:
                    `Your Athlyx verification OTP is ${otp}. ` +
                    `This OTP will expire in 10 minutes.`
            });

            if (error) {
                console.error("Resend email error:", error);

                return res.status(500).json({
                    success: false,
                    message: "User saved but OTP email could not be sent",
                    error: error.message || error
                });
            }

            console.log("OTP email sent:", data);

            return res.status(200).json({
                success: true,
                otpSent: true,
                message: "OTP sent to your email"
            });
        }

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // ==========================================
        // GENERATE OTP
        // ==========================================

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // ==========================================
        // CREATE USER
        // ==========================================

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,

            emailVerified: false,

            emailVerificationOTP: otp,

            emailVerificationOTPExpires: otpExpires
        });

        // ==========================================
        // SEND OTP USING RESEND
        // ==========================================

        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Athlyx Email Verification OTP",
            text:
                `Your Athlyx verification OTP is ${otp}. ` +
                `This OTP will expire in 10 minutes.`
        });

        if (error) {
            console.error("Resend email error:", error);

            return res.status(500).json({
                success: false,
                message: "User registered but OTP email could not be sent",
                error: error.message || error
            });
        }

        console.log("OTP email sent:", data);

        return res.status(201).json({
            success: true,
            otpSent: true,
            message: "OTP sent to your email",
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
// VERIFY EMAIL OTP
// ==========================================

async function verifyEmailOTP(req, res) {
    try {
        let { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        email = email.trim().toLowerCase();
        otp = otp.toString().trim();

        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ==========================================
        // CHECK ALREADY VERIFIED
        // ==========================================

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        // ==========================================
        // CHECK OTP
        // ==========================================

        if (user.emailVerificationOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // ==========================================
        // CHECK OTP EXPIRY
        // ==========================================

        if (
            !user.emailVerificationOTPExpires ||
            user.emailVerificationOTPExpires < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        // ==========================================
        // VERIFY EMAIL
        // ==========================================

        user.emailVerified = true;

        user.emailVerificationOTP = "";

        user.emailVerificationOTPExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            verified: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error("Verify OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "OTP verification failed",
            error: error.message
        });
    }
}

// ==========================================
// RESEND EMAIL OTP
// ==========================================

async function resendEmailOTP(req, res) {
    try {
        let { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        email = email.trim().toLowerCase();

        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ==========================================
        // ALREADY VERIFIED
        // ==========================================

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        // ==========================================
        // GENERATE NEW OTP
        // ==========================================

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        user.emailVerificationOTP = otp;

        user.emailVerificationOTPExpires =
            otpExpires;

        await user.save();

        // ==========================================
        // SEND NEW OTP USING RESEND
        // ==========================================

        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Athlyx Email Verification OTP",
            text:
                `Your new Athlyx verification OTP is ${otp}. ` +
                `This OTP will expire in 10 minutes.`
        });

        if (error) {
            console.error("Resend email error:", error);

            return res.status(500).json({
                success: false,
                message: "OTP generated but email could not be sent",
                error: error.message || error
            });
        }

        console.log("OTP email sent:", data);

        return res.status(200).json({
            success: true,
            message: "New OTP sent successfully"
        });

    } catch (error) {
        console.error("Resend OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to resend OTP",
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

        // ==========================================
        // EMAIL VERIFICATION CHECK
        // ==========================================

        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Please verify your email before login"
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
        const user = await User.findById(
            req.user.id
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {
        console.error(
            "Get current user error:",
            error
        );

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
        const role = req.user.role;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (role === "athlete") {
            await Athlete.findOneAndDelete({
                user: userId
            });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete account error:",
            error
        );

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
        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message:
                    "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message:
                    "New password must be at least 6 characters"
            });
        }

        const user = await User.findById(
            req.user.id
        );

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
                message:
                    "Current password is incorrect"
            });
        }

        const isSamePassword =
            await bcrypt.compare(
                newPassword,
                user.password
            );

        if (isSamePassword) {
            return res.status(400).json({
                message:
                    "New password must be different"
            });
        }

        user.password =
            await bcrypt.hash(newPassword, 10);

        await user.save();

        return res.status(200).json({
            message:
                "Password changed successfully"
        });

    } catch (error) {
        console.error(
            "Change password error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to change password"
        });
    }
};

// ==========================================
// CHANGE EMAIL
// ==========================================

const changeEmail = async (req, res) => {
    try {
        const {
            currentPassword,
            newEmail
        } = req.body;

        if (!currentPassword || !newEmail) {
            return res.status(400).json({
                message:
                    "Current password and new email are required"
            });
        }

        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordCorrect =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message:
                    "Current password is incorrect"
            });
        }

        const normalizedEmail =
            newEmail.trim().toLowerCase();

        if (normalizedEmail === user.email) {
            return res.status(400).json({
                message:
                    "New email must be different from current email"
            });
        }

        const emailExists =
            await User.findOne({
                email: normalizedEmail
            });

        if (emailExists) {
            return res.status(409).json({
                message:
                    "Email is already registered"
            });
        }

        user.email = normalizedEmail;

        await user.save();

        return res.status(200).json({
            message:
                "Email address changed successfully",
            email: user.email
        });

    } catch (error) {
        console.error(
            "Change email error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to change email address"
        });
    }
};

// ==========================================
// GET SETTINGS
// ==========================================

const getSettings = async (req, res) => {
    try {
        const user = await User.findById(
            req.user.id
        ).select("role settings");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (
            user.role !== "athlete" &&
            user.role !== "coach"
        ) {
            return res.status(400).json({
                message: "Invalid user role"
            });
        }

        const settings = {
            profileVisibility:
                user.settings?.profileVisibility ||
                "Public",

            contactVisible:
                user.settings?.contactVisible ??
                true,

            messageNotifications:
                user.settings?.messageNotifications ??
                true,

            opportunityNotifications:
                user.settings?.opportunityNotifications ??
                true,

            emailNotifications:
                user.settings?.emailNotifications ??
                true
        };

        return res.status(200).json({
            settings
        });

    } catch (error) {
        console.error(
            "Get settings error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch settings"
        });
    }
};

// ==========================================
// UPDATE SETTINGS
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

        // ------------------------------------------
        // VALIDATE PROFILE VISIBILITY
        // ------------------------------------------

        if (
            profileVisibility !== undefined &&
            !["Public", "Private"].includes(
                profileVisibility
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid profile visibility"
            });
        }

        // ------------------------------------------
        // VALIDATE CONTACT VISIBILITY
        // ------------------------------------------

        if (
            contactVisible !== undefined &&
            typeof contactVisible !== "boolean"
        ) {
            return res.status(400).json({
                message:
                    "Invalid contact visibility value"
            });
        }

        // ------------------------------------------
        // VALIDATE MESSAGE NOTIFICATIONS
        // ------------------------------------------

        if (
            messageNotifications !== undefined &&
            typeof messageNotifications !== "boolean"
        ) {
            return res.status(400).json({
                message:
                    "Invalid message notification value"
            });
        }

        // ------------------------------------------
        // VALIDATE OPPORTUNITY NOTIFICATIONS
        // ------------------------------------------

        if (
            opportunityNotifications !== undefined &&
            typeof opportunityNotifications !== "boolean"
        ) {
            return res.status(400).json({
                message:
                    "Invalid opportunity notification value"
            });
        }

        // ------------------------------------------
        // VALIDATE EMAIL NOTIFICATIONS
        // ------------------------------------------

        if (
            emailNotifications !== undefined &&
            typeof emailNotifications !== "boolean"
        ) {
            return res.status(400).json({
                message:
                    "Invalid email notification value"
            });
        }

        // ------------------------------------------
        // FIND USER
        // ------------------------------------------

        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // ------------------------------------------
        // ROLE CHECK
        // ------------------------------------------

        if (
            user.role !== "athlete" &&
            user.role !== "coach"
        ) {
            return res.status(400).json({
                message: "Invalid user role"
            });
        }

        // ------------------------------------------
        // INITIALIZE SETTINGS
        // ------------------------------------------

        if (!user.settings) {
            user.settings = {};
        }

        // ------------------------------------------
        // UPDATE ONLY PROVIDED VALUES
        // ------------------------------------------

        if (profileVisibility !== undefined) {
            user.settings.profileVisibility =
                profileVisibility;
        }

        if (contactVisible !== undefined) {
            user.settings.contactVisible =
                contactVisible;
        }

        if (messageNotifications !== undefined) {
            user.settings.messageNotifications =
                messageNotifications;
        }

        if (opportunityNotifications !== undefined) {
            user.settings.opportunityNotifications =
                opportunityNotifications;
        }

        if (emailNotifications !== undefined) {
            user.settings.emailNotifications =
                emailNotifications;
        }

        await user.save();

        return res.status(200).json({
            message:
                "Settings updated successfully",
            settings: user.settings
        });

    } catch (error) {
        console.error(
            "Update settings error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to update settings"
        });
    }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    registerUser,
    verifyEmailOTP,
    resendEmailOTP,
    loginUser,
    getCurrentUser,
    deleteAccount,
    changePassword,
    changeEmail,
    getSettings,
    updateSettings
};