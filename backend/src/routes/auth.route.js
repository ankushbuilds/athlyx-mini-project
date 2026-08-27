const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

// ==========================================
// AUTH ROUTES
// ==========================================

// Register
router.post(
    "/register",
    authController.registerUser
);

// Verify Email OTP
router.post(
    "/verify-email-otp",
    authController.verifyEmailOTP
);

// Resend Email OTP
router.post(
    "/resend-email-otp",
    authController.resendEmailOTP
);

// Login
router.post(
    "/login",
    authController.loginUser
);

// Get Current User
router.get(
    "/me",
    authMiddleware,
    authController.getCurrentUser
);

// ==========================================
// ACCOUNT
// ==========================================

// Delete Account
router.delete(
    "/delete-account",
    authMiddleware,
    authController.deleteAccount
);

// ==========================================
// PASSWORD
// ==========================================

// Change Password
router.put(
    "/change-password",
    authMiddleware,
    authController.changePassword
);

// ==========================================
// EMAIL
// ==========================================

// Change Email
router.put(
    "/change-email",
    authMiddleware,
    authController.changeEmail
);

// ==========================================
// SETTINGS
// ==========================================

// Get Settings
router.get(
    "/settings",
    authMiddleware,
    authController.getSettings
);

// Update Settings
router.put(
    "/settings",
    authMiddleware,
    authController.updateSettings
);

module.exports = router;