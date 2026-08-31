const express = require("express");

const router = express.Router();

const challengeController = require("../controllers/challenge.controller");

const authMiddleware = require("../middleware/auth.middleware");


router.get(
    "/weekly",
    authMiddleware,
    challengeController.getWeeklyChallenges
);


router.get(
    "/my-challenges",
    authMiddleware,
    challengeController.getMyChallenges
);


router.get(
    "/stats",
    authMiddleware,
    challengeController.getChallengeStats
);
router.get(
    "/history",
    authMiddleware,
    challengeController.getChallengeHistory
);

router.put(
    "/:challengeId/progress",
    authMiddleware,
    challengeController.updateChallengeProgress
);


module.exports = router;