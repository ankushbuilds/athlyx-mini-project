const express = require("express");

const userController = require("../controllers/user.controller");

const authMiddleware = require("../middleware/auth.middleware");

const upload = require("../middleware/upload.middleware");

const router = express.Router();


// ======================================================
// PROFILE PICTURE
// ======================================================

router.post(
    "/profile-pic",
    authMiddleware,
    upload.single("profilePic"),
    userController.uploadProfilePic
);


// ======================================================
// GET ALL COACHES
// ======================================================

router.get(
    "/coaches",
    authMiddleware,
    userController.getAllCoaches
);


// ======================================================
// GET SINGLE COACH
// ======================================================

router.get(
    "/coaches/:coachId",
    authMiddleware,
    userController.getCoachById
);


module.exports = router;