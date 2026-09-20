
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  // Opportunity / Event
  createOpportunity,
  getAllOpportunities,
  getAcademyOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,

  // Athlete Applications
  applyToOpportunity,
  getApplicationStatus,
  getMyApplications,

  // Academy Applications
  getOpportunityApplicants,
  updateApplicationStatus
} = require("../controllers/opportunity.controller");


// ======================================================
// ATHLETE / GENERAL
// ======================================================

// Get all active events
router.get(
  "/",
  authMiddleware,
  getAllOpportunities
);


// ======================================================
// ATHLETE APPLICATIONS
// IMPORTANT:
// These routes MUST come before /:id
// ======================================================

// Get all applications of logged-in athlete
router.get(
  "/applications/mine",
  authMiddleware,
  getMyApplications
);


// ======================================================
// ACADEMY
// ======================================================

// Get academy's own events
router.get(
  "/academy",
  authMiddleware,
  getAcademyOpportunities
);


// ======================================================
// CREATE EVENT
// ======================================================

// Academy creates event
router.post(
  "/",
  authMiddleware,
  createOpportunity
);


// ======================================================
// APPLICATION STATUS
// ======================================================

// Athlete checks whether they applied to an event
router.get(
  "/:id/application-status",
  authMiddleware,
  getApplicationStatus
);


// ======================================================
// APPLY TO EVENT
// ======================================================

// Athlete applies to event
router.post(
  "/:id/apply",
  authMiddleware,
  applyToOpportunity
);


// ======================================================
// ACADEMY APPLICANTS
// ======================================================

// Academy gets applicants for its event
router.get(
  "/:id/applicants",
  authMiddleware,
  getOpportunityApplicants
);


// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

// Academy accepts/rejects an athlete
router.patch(
  "/applications/:applicationId/status",
  authMiddleware,
  updateApplicationStatus
);


// ======================================================
// SINGLE EVENT
// IMPORTANT:
// Keep /:id AFTER all specific routes
// ======================================================

// Get single event
router.get(
  "/:id",
  authMiddleware,
  getOpportunityById
);


// ======================================================
// UPDATE EVENT
// ======================================================

router.put(
  "/:id",
  authMiddleware,
  updateOpportunity
);


// ======================================================
// DELETE EVENT
// ======================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteOpportunity
);


// ======================================================
// EXPORT
// ======================================================

module.exports = router;