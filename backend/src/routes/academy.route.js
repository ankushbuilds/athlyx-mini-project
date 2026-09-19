const express = require("express");
const router = express.Router();

const academyController = require("../controllers/academy.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/profile",
  authMiddleware,
  academyController.createAcademyProfile
);

router.get(
  "/profile",
  authMiddleware,
  academyController.getMyAcademyProfile
);

router.put(
  "/profile",
  authMiddleware,
  academyController.updateAcademyProfile
);

router.delete(
  "/profile",
  authMiddleware,
  academyController.deleteAcademyProfile
);

router.get(
  "/:id",
  authMiddleware,
  academyController.getAcademyProfileById
);

module.exports = router;