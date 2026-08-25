const express = require("express");

const {
    sendAthleteRequest,
    getMyAthletes,
    getAthleteRequests,
    acceptAthleteRequest,
    rejectAthleteRequest
} = require("../controllers/coachAthlete.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/send-request",
    authMiddleware,
    sendAthleteRequest
);

router.get(
    "/my-athletes",
    authMiddleware,
    getMyAthletes
);

router.get(
    "/requests",
    authMiddleware,
    getAthleteRequests
);

router.put(
    "/requests/:requestId/accept",
    authMiddleware,
    acceptAthleteRequest
);

router.put(
    "/requests/:requestId/reject",
    authMiddleware,
    rejectAthleteRequest
);

module.exports = router;