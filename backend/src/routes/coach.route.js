const express = require("express");
const {
  getCoachProfile,
  updateCoachProfile
} = require("../controllers/coach.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/get-profile",
  authMiddleware,
  getCoachProfile
);

router.put(
  "/update-profile",
  authMiddleware,
  updateCoachProfile
);

module.exports = router;