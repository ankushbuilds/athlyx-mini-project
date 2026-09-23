const express = require("express");
const multer = require("multer");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createOpportunity,
  getAllOpportunities,
  getAcademyOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyToOpportunity,
  getApplicationStatus,
  getMyApplications,
  getOpportunityApplicants,
  updateApplicationStatus
} = require("../controllers/opportunity.controller");

// ======================================================
// MULTER CONFIG
// Resume frontend se PDF ke form me memory me receive hoga
// ======================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(
        new Error("Only PDF resume files are allowed.")
      );
    }

    cb(null, true);
  }
});

// ======================================================
// GET ALL ACTIVE OPPORTUNITIES
// ======================================================

router.get(
  "/",
  authMiddleware,
  getAllOpportunities
);

// ======================================================
// GET CURRENT ATHLETE APPLICATIONS
// ======================================================

router.get(
  "/applications/mine",
  authMiddleware,
  getMyApplications
);

// ======================================================
// GET ACADEMY OPPORTUNITIES
// ======================================================

router.get(
  "/academy",
  authMiddleware,
  getAcademyOpportunities
);

// ======================================================
// CREATE OPPORTUNITY
// ======================================================

router.post(
  "/",
  authMiddleware,
  createOpportunity
);

// ======================================================
// GET APPLICATION STATUS
// ======================================================

router.get(
  "/:id/application-status",
  authMiddleware,
  getApplicationStatus
);

// ======================================================
// APPLY TO OPPORTUNITY
// Resume PDF required
// ======================================================

router.post(
  "/:id/apply",
  authMiddleware,
  upload.single("resume"),
  applyToOpportunity
);

// ======================================================
// GET OPPORTUNITY APPLICANTS
// ======================================================

router.get(
  "/:id/applicants",
  authMiddleware,
  getOpportunityApplicants
);

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

router.patch(
  "/applications/:applicationId/status",
  authMiddleware,
  updateApplicationStatus
);

// ======================================================
// GET SINGLE OPPORTUNITY
// ======================================================

router.get(
  "/:id",
  authMiddleware,
  getOpportunityById
);

// ======================================================
// UPDATE OPPORTUNITY
// ======================================================

router.put(
  "/:id",
  authMiddleware,
  updateOpportunity
);

// ======================================================
// DELETE OPPORTUNITY
// ======================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteOpportunity
);

// ======================================================
// MULTER ERROR HANDLER
// ======================================================

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Resume file must be smaller than 5 MB."
      });
    }

    return res.status(400).json({
      message: error.message
    });
  }

  if (
    error &&
    error.message ===
      "Only PDF resume files are allowed."
  ) {
    return res.status(400).json({
      message: error.message
    });
  }

  next(error);
});

module.exports = router;