const express = require("express");

const router = express.Router();

const connectionController = require("../controllers/connection.controller");

const authMiddleware = require("../middleware/auth.middleware");

// ======================================================
// COACH → ATHLETE
// ======================================================

// Send connection request to athlete
router.post(
    "/send/:athleteId",
    authMiddleware,
    connectionController.sendConnectionRequest
);

// Check connection status with athlete
router.get(
    "/status/:athleteId",
    authMiddleware,
    connectionController.getCoachConnectionStatus
);

// ======================================================
// ATHLETE → COACH
// ======================================================

// Send connection request to coach
router.post(
    "/send/coach/:coachId",
    authMiddleware,
    connectionController.sendAthleteConnectionRequest
);

// Check connection status with coach
router.get(
    "/status/coach/:coachId",
    authMiddleware,
    connectionController.getAthleteConnectionStatus
);

// ======================================================
// ATHLETE REQUESTS
// ======================================================

// Get requests received by athlete
router.get(
    "/athlete/requests",
    authMiddleware,
    connectionController.getAthleteConnectionRequests
);

// Athlete accepts/rejects coach request
router.put(
    "/athlete/respond/:connectionId",
    authMiddleware,
    connectionController.respondToConnectionRequest
);

// ======================================================
// COACH REQUESTS
// ======================================================

// Get requests received by coach
router.get(
    "/coach/requests",
    authMiddleware,
    connectionController.getCoachConnectionRequests
);

// Coach accepts/rejects athlete request
router.put(
    "/coach/respond/:connectionId",
    authMiddleware,
    connectionController.respondToConnectionRequest
);

// ======================================================
// CONNECTED ATHLETES
// ======================================================

router.get(
    "/coach/athletes",
    authMiddleware,
    connectionController.getCoachConnectedAthletes
);
router.get(
    "/athlete/coaches",
    authMiddleware,
    connectionController.getAthleteConnectedCoaches
);
router.delete(
    "/disconnect/:connectionId",
    authMiddleware,
    connectionController.disconnectConnection
);

module.exports = router;