const express = require("express");
const router = express.Router();

const {
  createOrUpdateProfile,
  getMyProfile,
  getScoutById,
  deleteProfile
} = require("../controllers/scout.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get(
  "/profile",
  authMiddleware,
  getMyProfile
);

router.post(
  "/profile",
  authMiddleware,
  createOrUpdateProfile
);

router.delete(
  "/profile",
  authMiddleware,
  deleteProfile
);

router.get(
  "/:id",
  getScoutById
);

module.exports = router;