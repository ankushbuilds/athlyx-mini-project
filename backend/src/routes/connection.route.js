const express = require("express");

const router = express.Router();

const connectionController = require("../controllers/connection.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post(
    "/send/:athleteId",
    authMiddleware,
    connectionController.sendConnectionRequest
);

router.get(
    "/status/:athleteId",
    authMiddleware,
    connectionController.getCoachConnectionStatus
);

router.get(
    "/athlete/requests",
    authMiddleware,
    connectionController.getAthleteConnectionRequests
);

router.put(
    "/athlete/respond/:connectionId",
    authMiddleware,
    connectionController.respondToConnectionRequest
);

router.get(
    "/coach/athletes",
    authMiddleware,
    connectionController.getCoachConnectedAthletes
);

module.exports = router;