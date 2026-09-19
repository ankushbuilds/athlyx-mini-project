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

// Athlete accepts/rejects request
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

// Coach accepts/rejects request
router.put(
    "/coach/respond/:connectionId",
    authMiddleware,
    connectionController.respondToConnectionRequest
);


// ======================================================
// ACADEMY → ATHLETE
// ======================================================

// Academy sends request to athlete
router.post(
    "/send/academy/:athleteId",
    authMiddleware,
    connectionController.sendAcademyConnectionRequest
);

// Athlete sends request to academy
router.post(
    "/send/athlete/academy/:academyId",
    authMiddleware,
    connectionController.sendAthleteAcademyConnectionRequest
);

// Athlete checks academy connection status
router.get(
    "/status/academy/:academyId",
    authMiddleware,
    connectionController.getAthleteAcademyConnectionRequests
);


// ======================================================
// ACADEMY → COACH
// ======================================================

// Academy sends request to coach
router.post(
    "/send/academy/coach/:coachId",
    authMiddleware,
    connectionController.sendAcademyCoachConnectionRequest
);

// Coach sends request to academy
router.post(
    "/send/coach/academy/:academyId",
    authMiddleware,
    connectionController.sendCoachAcademyConnectionRequest
);


// ======================================================
// ACADEMY REQUESTS
// ======================================================

// Academy receives requests from athletes/coaches
router.get(
    "/academy/requests",
    authMiddleware,
    connectionController.getAcademyConnectionRequests
);

// Academy accepts/rejects request
router.put(
    "/academy/respond/:connectionId",
    authMiddleware,
    connectionController.respondToConnectionRequest
);


// ======================================================
// ATHLETE : ACADEMY REQUESTS
// ======================================================

// Athlete receives requests from academies
router.get(
    "/athlete/academy-requests",
    authMiddleware,
    connectionController.getAthleteAcademyConnectionRequests
);


// ======================================================
// COACH : ACADEMY REQUESTS
// ======================================================

// Coach receives requests from academies
router.get(
    "/coach/academy-requests",
    authMiddleware,
    connectionController.getCoachAcademyConnectionRequests
);


// ======================================================
// CONNECTED ATHLETES / COACHES
// ======================================================

// Coach → connected athletes
router.get(
    "/coach/athletes",
    authMiddleware,
    connectionController.getCoachConnectedAthletes
);

// Athlete → connected coaches
router.get(
    "/athlete/coaches",
    authMiddleware,
    connectionController.getAthleteConnectedCoaches
);

// Academy → connected athletes
router.get(
    "/academy/athletes",
    authMiddleware,
    connectionController.getAcademyConnectedAthletes
);

// Academy → connected coaches
router.get(
    "/academy/coaches",
    authMiddleware,
    connectionController.getAcademyConnectedCoaches
);

// Athlete → connected academies
router.get(
    "/athlete/academies",
    authMiddleware,
    connectionController.getAthleteConnectedAcademies
);

// Coach → connected academies
router.get(
    "/coach/academies",
    authMiddleware,
    connectionController.getCoachConnectedAcademies
);


// ======================================================
// DISCONNECT
// ======================================================

router.delete(
    "/disconnect/:connectionId",
    authMiddleware,
    connectionController.disconnectConnection
);


module.exports = router;