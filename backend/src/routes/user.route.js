const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.post(
    "/profile-pic",
    authMiddleware,
    upload.single("profilePic"),
    userController.uploadProfilePic
);

module.exports = router;