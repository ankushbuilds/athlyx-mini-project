
const express = require("express");
const router = express.Router();

const {
    // Coach ↔ Athlete
    sendConnectionRequest,
    sendAthleteConnectionRequest,
    getCoachConnectionStatus,
    getAthleteConnectionStatus,
    getAthleteConnectionRequests,
    getCoachConnectionRequests,

    // Academy ↔ Athlete
    sendAcademyConnectionRequest,
    sendAthleteAcademyConnectionRequest,
    getAcademyConnectionStatus,
    getAthleteAcademyConnectionStatus,
    getAcademyConnectionRequests,
    getAthleteAcademyConnectionRequests,

    // Academy ↔ Coach
    sendAcademyCoachConnectionRequest,
    sendCoachAcademyConnectionRequest,
    getAcademyCoachConnectionStatus,
    getCoachAcademyConnectionStatus,
    getCoachAcademyConnectionRequests,

    // Scout ↔ Athlete
    sendScoutConnectionRequest,
    getScoutConnectionStatus,
    getScoutConnectionRequests,
    getAthleteScoutConnectionRequests,

    // Connected lists
    getCoachConnectedAthletes,
    getAthleteConnectedCoaches,
    getAcademyConnectedAthletes,
    getAcademyConnectedCoaches,
    getAthleteConnectedAcademies,
    getCoachConnectedAcademies,
    getScoutConnectedAthletes,
    getAthleteConnectedScouts,

    // Common
    respondToConnectionRequest,
    disconnectConnection
} = require("../controllers/connection.controller");

const authMiddleware = require("../middleware/auth.middleware");


// =====================================================
// COACH → ATHLETE
// =====================================================

router.post(
    "/send/:athleteId",
    authMiddleware,
    sendConnectionRequest
);

router.get(
    "/status/:athleteId",
    authMiddleware,
    getCoachConnectionStatus
);


// =====================================================
// ATHLETE → COACH
// =====================================================

// Frontend-compatible routes
router.post(
    "/send/coach/:coachId",
    authMiddleware,
    sendAthleteConnectionRequest
);

router.get(
    "/status/coach/:coachId",
    authMiddleware,
    getAthleteConnectionStatus
);

// Original routes preserved
router.post(
    "/athlete/send/coach/:coachId",
    authMiddleware,
    sendAthleteConnectionRequest
);

router.get(
    "/athlete/status/coach/:coachId",
    authMiddleware,
    getAthleteConnectionStatus
);


// =====================================================
// ATHLETE CONNECTION REQUESTS
// =====================================================

router.get(
    "/athlete/requests",
    authMiddleware,
    getAthleteConnectionRequests
);

router.get(
    "/coach/requests",
    authMiddleware,
    getCoachConnectionRequests
);


// =====================================================
// ACADEMY → ATHLETE
// =====================================================

router.post(
    "/academy/send/:athleteId",
    authMiddleware,
    sendAcademyConnectionRequest
);

router.get(
    "/academy/status/:athleteId",
    authMiddleware,
    getAcademyConnectionStatus
);


// =====================================================
// ATHLETE → ACADEMY
// =====================================================

router.post(
    "/athlete/send/academy/:academyId",
    authMiddleware,
    sendAthleteAcademyConnectionRequest
);

router.get(
    "/athlete/status/academy/:academyId",
    authMiddleware,
    getAthleteAcademyConnectionStatus
);


// =====================================================
// ACADEMY CONNECTION REQUESTS
// =====================================================

router.get(
    "/academy/requests",
    authMiddleware,
    getAcademyConnectionRequests
);

router.get(
    "/athlete/academy-requests",
    authMiddleware,
    getAthleteAcademyConnectionRequests
);


// =====================================================
// ACADEMY ↔ COACH
// =====================================================

router.post(
    "/academy/send/coach/:coachId",
    authMiddleware,
    sendAcademyCoachConnectionRequest
);

router.post(
    "/coach/send/academy/:academyId",
    authMiddleware,
    sendCoachAcademyConnectionRequest
);

router.get(
    "/academy/status/coach/:coachId",
    authMiddleware,
    getAcademyCoachConnectionStatus
);

router.get(
    "/coach/status/academy/:academyId",
    authMiddleware,
    getCoachAcademyConnectionStatus
);

router.get(
    "/coach/academy-requests",
    authMiddleware,
    getCoachAcademyConnectionRequests
);


// =====================================================
// SCOUT → ATHLETE
// =====================================================

router.post(
    "/scout/send/:athleteId",
    authMiddleware,
    sendScoutConnectionRequest
);

router.get(
    "/scout/status/:athleteId",
    authMiddleware,
    getScoutConnectionStatus
);

router.get(
    "/scout/requests",
    authMiddleware,
    getScoutConnectionRequests
);


// =====================================================
// ATHLETE ← SCOUT REQUESTS
// =====================================================

router.get(
    "/athlete/scout-requests",
    authMiddleware,
    getAthleteScoutConnectionRequests
);


// =====================================================
// CONNECTED USERS
// =====================================================

router.get(
    "/coach/connected-athletes",
    authMiddleware,
    getCoachConnectedAthletes
);

router.get(
    "/athlete/connected-coaches",
    authMiddleware,
    getAthleteConnectedCoaches
);

router.get(
    "/academy/connected-athletes",
    authMiddleware,
    getAcademyConnectedAthletes
);

router.get(
    "/academy/connected-coaches",
    authMiddleware,
    getAcademyConnectedCoaches
);

router.get(
    "/athlete/connected-academies",
    authMiddleware,
    getAthleteConnectedAcademies
);

router.get(
    "/coach/connected-academies",
    authMiddleware,
    getCoachConnectedAcademies
);

router.get(
    "/scout/connected-athletes",
    authMiddleware,
    getScoutConnectedAthletes
);

router.get(
    "/athlete/connected-scouts",
    authMiddleware,
    getAthleteConnectedScouts
);


// =====================================================
// COMMON REQUEST RESPONSE
// =====================================================

// Original route preserved
router.put(
    "/respond/:connectionId",
    authMiddleware,
    respondToConnectionRequest
);

// Coach frontend-compatible route
router.put(
    "/coach/respond/:connectionId",
    authMiddleware,
    respondToConnectionRequest
);


// =====================================================
// DISCONNECT
// =====================================================

router.delete(
    "/:connectionId",
    authMiddleware,
    disconnectConnection
);


module.exports = router;
