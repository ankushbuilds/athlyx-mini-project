const express = require("express");
const router = express.Router();
const athleteController = require("../controllers/athlete.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware, athleteController.createAthlete);

router.get("/get-profile", authMiddleware, athleteController.getMyAthleteProfile);

router.put("/update-profile", authMiddleware, athleteController.updateMyAthleteProfile);

router.delete("/delete-profile", authMiddleware, athleteController.deleteMyAthleteProfile);

router.get("/get-all", athleteController.getAllAthletes);
router.get("/:id", athleteController.getAthleteById);

module.exports = router;