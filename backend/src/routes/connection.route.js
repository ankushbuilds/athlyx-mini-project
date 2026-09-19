const express = require("express");

const router = express.Router();

const connectionController = require("../controllers/connection.controller");

const authMiddleware = require("../middleware/auth.middleware");


// ======================================================
// ACADEMY → ATHLETE
// ======================================================

// IMPORTANT:
// Specific routes MUST come before /send/:athleteId

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
// ATHLETE → COACH
// ======================================================

// Athlete sends connection request to coach
router.post(
    "/send/coach/:coachId",
    authMiddleware,
    connectionController.sendAthleteConnectionRequest
);


// ======================================================
// COACH → ATHLETE
// ======================================================

// IMPORTANT:
// Keep this generic route AFTER all specific /send/... routes

// Coach sends connection request to athlete
router.post(
    "/send/:athleteId",
    authMiddleware,
    connectionController.sendConnectionRequest
);


// ======================================================
// CONNECTION STATUS
// ======================================================

// IMPORTANT:
// Specific status routes MUST come before
// /status/:athleteId


// Academy → Athlete status
router.get(
    "/status/academy/:athleteId",
    authMiddleware,
    connectionController.getAcademyConnectionStatus
);


// Athlete → Academy status
router.get(
    "/status/athlete/academy/:academyId",
    authMiddleware,
    connectionController.getAthleteAcademyConnectionStatus
);


// Academy → Coach status
router.get(
    "/status/academy/coach/:coachId",
    authMiddleware,
    connectionController.getAcademyCoachConnectionStatus
);


// Coach → Academy status
router.get(
    "/status/coach/academy/:academyId",
    authMiddleware,
    connectionController.getCoachAcademyConnectionStatus
);


// Athlete → Coach status
router.get(
    "/status/coach/:coachId",
    authMiddleware,
    connectionController.getAthleteConnectionStatus
);


// Coach → Athlete status
router.get(
    "/status/:athleteId",
    authMiddleware,
    connectionController.getCoachConnectionStatus
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
// CONNECTED ATHLETES / COACHES / ACADEMIES
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