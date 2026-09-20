
const mongoose = require("mongoose");

const Opportunity = require("../models/opportunity.model");
const OpportunityApplication = require("../models/opportunityApplication.model");

// ======================================================
// CREATE OPPORTUNITY / EVENT
// ======================================================
const createOpportunity = async (req, res) => {
  try {
    // --------------------------------------------------
    // CHECK LOGIN
    // --------------------------------------------------
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // --------------------------------------------------
    // ONLY ACADEMY CAN CREATE EVENTS
    // --------------------------------------------------
    if (req.user.role !== "academy") {
      return res.status(403).json({
        message: "Only academies can create events"
      });
    }

    // --------------------------------------------------
    // GET DATA
    // --------------------------------------------------
    const {
      title,
      type,
      sport,
      date,
      registrationDeadline,
      location,
      description,
      eligibility
    } = req.body;

    // --------------------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------------------
    if (
      !title?.trim() ||
      !type ||
      !sport?.trim() ||
      !date ||
      !registrationDeadline ||
      !location?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        message: "Please fill all required fields."
      });
    }

    // --------------------------------------------------
    // CHECK DATES
    // --------------------------------------------------
    const eventDate = new Date(date);
    const registrationDate = new Date(registrationDeadline);

    if (
      Number.isNaN(eventDate.getTime()) ||
      Number.isNaN(registrationDate.getTime())
    ) {
      return res.status(400).json({
        message: "Please enter valid dates."
      });
    }

    if (registrationDate > eventDate) {
      return res.status(400).json({
        message:
          "Registration deadline cannot be after the event date."
      });
    }

    // --------------------------------------------------
    // ACADEMY USER ID
    // --------------------------------------------------
    const academyId = req.user._id || req.user.id;

    if (!academyId) {
      console.error(
        "Academy ID missing from req.user:",
        req.user
      );

      return res.status(401).json({
        message:
          "Academy user ID not found. Please login again."
      });
    }

    // --------------------------------------------------
    // CREATE EVENT
    // --------------------------------------------------
    const opportunity = await Opportunity.create({
      academy: academyId,

      title: title.trim(),
      type,
      sport: sport.trim(),

      date: eventDate,
      registrationDeadline: registrationDate,

      location: location.trim(),
      description: description.trim(),

      eligibility: eligibility?.trim() || "",

      status: "active"
    });

    // --------------------------------------------------
    // POPULATE ACADEMY
    // --------------------------------------------------
    await opportunity.populate(
      "academy",
      "name email role profilePic"
    );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------
    return res.status(201).json({
      message: "Event created successfully",
      opportunity
    });

  } catch (error) {
    console.error(
      "Create Opportunity Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to create event",
      error: error.message
    });
  }
};


// ======================================================
// GET ALL ACTIVE OPPORTUNITIES
// ======================================================
const getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      status: "active"
    })
      .populate(
        "academy",
        "name email role profilePic"
      )
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      opportunities
    });

  } catch (error) {
    console.error(
      "Get All Opportunities Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch opportunities",
      error: error.message
    });
  }
};


// ======================================================
// GET ACADEMY'S OWN OPPORTUNITIES
// ======================================================
const getAcademyOpportunities = async (req, res) => {
  try {
    // --------------------------------------------------
    // CHECK LOGIN
    // --------------------------------------------------
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // --------------------------------------------------
    // ONLY ACADEMY
    // --------------------------------------------------
    if (req.user.role !== "academy") {
      return res.status(403).json({
        message:
          "Only academies can access their events"
      });
    }

    const academyId = req.user._id || req.user.id;

    if (!academyId) {
      return res.status(401).json({
        message:
          "Academy user ID not found. Please login again."
      });
    }

    // --------------------------------------------------
    // GET EVENTS
    // --------------------------------------------------
    const opportunities = await Opportunity.find({
      academy: academyId
    })
      .populate(
        "academy",
        "name email role profilePic"
      )
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      opportunities
    });

  } catch (error) {
    console.error(
      "Get Academy Opportunities Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch academy events",
      error: error.message
    });
  }
};


// ======================================================
// GET SINGLE OPPORTUNITY
// ======================================================
const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------
    // VALIDATE OBJECT ID
    // --------------------------------------------------
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    // --------------------------------------------------
    // FIND EVENT
    // --------------------------------------------------
    const opportunity = await Opportunity.findById(id)
      .populate(
        "academy",
        "name email role profilePic"
      );

    if (!opportunity) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    return res.status(200).json({
      opportunity
    });

  } catch (error) {
    console.error(
      "Get Opportunity By ID Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch event",
      error: error.message
    });
  }
};


// ======================================================
// UPDATE OPPORTUNITY
// ======================================================
const updateOpportunity = async (req, res) => {
  try {
    // --------------------------------------------------
    // CHECK LOGIN
    // --------------------------------------------------
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // --------------------------------------------------
    // ONLY ACADEMY
    // --------------------------------------------------
    if (req.user.role !== "academy") {
      return res.status(403).json({
        message: "Only academies can update events"
      });
    }

    const academyId = req.user._id || req.user.id;

    if (!academyId) {
      return res.status(401).json({
        message:
          "Academy user ID not found. Please login again."
      });
    }

    // --------------------------------------------------
    // VALIDATE EVENT ID
    // --------------------------------------------------
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    // --------------------------------------------------
    // FIND EVENT
    // --------------------------------------------------
    const opportunity = await Opportunity.findById(
      req.params.id
    );

    if (!opportunity) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // --------------------------------------------------
    // CHECK OWNERSHIP
    // --------------------------------------------------
    if (
      opportunity.academy.toString() !==
      academyId.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only update your own events"
      });
    }

    // --------------------------------------------------
    // GET DATA
    // --------------------------------------------------
    const {
      title,
      type,
      sport,
      date,
      registrationDeadline,
      location,
      description,
      eligibility,
      status
    } = req.body;

    // --------------------------------------------------
    // UPDATE FIELDS
    // --------------------------------------------------
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Title cannot be empty"
        });
      }

      opportunity.title = title.trim();
    }

    if (type !== undefined) {
      opportunity.type = type;
    }

    if (sport !== undefined) {
      if (!sport.trim()) {
        return res.status(400).json({
          message: "Sport cannot be empty"
        });
      }

      opportunity.sport = sport.trim();
    }

    if (date !== undefined) {
      const updatedDate = new Date(date);

      if (Number.isNaN(updatedDate.getTime())) {
        return res.status(400).json({
          message: "Please enter a valid event date."
        });
      }

      opportunity.date = updatedDate;
    }

    if (registrationDeadline !== undefined) {
      const updatedDeadline =
        new Date(registrationDeadline);

      if (Number.isNaN(updatedDeadline.getTime())) {
        return res.status(400).json({
          message:
            "Please enter a valid registration deadline."
        });
      }

      opportunity.registrationDeadline =
        updatedDeadline;
    }

    if (location !== undefined) {
      if (!location.trim()) {
        return res.status(400).json({
          message: "Location cannot be empty"
        });
      }

      opportunity.location = location.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          message: "Description cannot be empty"
        });
      }

      opportunity.description =
        description.trim();
    }

    if (eligibility !== undefined) {
      opportunity.eligibility =
        eligibility.trim();
    }

    if (status !== undefined) {
      opportunity.status = status;
    }

    // --------------------------------------------------
    // CHECK DATES AGAIN
    // --------------------------------------------------
    if (
      opportunity.registrationDeadline >
      opportunity.date
    ) {
      return res.status(400).json({
        message:
          "Registration deadline cannot be after the event date."
      });
    }

    // --------------------------------------------------
    // SAVE
    // --------------------------------------------------
    await opportunity.save();

    // --------------------------------------------------
    // POPULATE ACADEMY
    // --------------------------------------------------
    await opportunity.populate(
      "academy",
      "name email role profilePic"
    );

    return res.status(200).json({
      message: "Event updated successfully",
      opportunity
    });

  } catch (error) {
    console.error(
      "Update Opportunity Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to update event",
      error: error.message
    });
  }
};


// ======================================================
// DELETE OPPORTUNITY
// ======================================================
const deleteOpportunity = async (req, res) => {
  try {
    // --------------------------------------------------
    // CHECK LOGIN
    // --------------------------------------------------
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // --------------------------------------------------
    // ONLY ACADEMY
    // --------------------------------------------------
    if (req.user.role !== "academy") {
      return res.status(403).json({
        message: "Only academies can delete events"
      });
    }

    const academyId = req.user._id || req.user.id;

    if (!academyId) {
      return res.status(401).json({
        message:
          "Academy user ID not found. Please login again."
      });
    }

    // --------------------------------------------------
    // VALIDATE EVENT ID
    // --------------------------------------------------
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    // --------------------------------------------------
    // FIND EVENT
    // --------------------------------------------------
    const opportunity = await Opportunity.findById(
      req.params.id
    );

    if (!opportunity) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // --------------------------------------------------
    // CHECK OWNERSHIP
    // --------------------------------------------------
    if (
      opportunity.academy.toString() !==
      academyId.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own events"
      });
    }

    // --------------------------------------------------
    // DELETE APPLICATIONS FIRST
    // --------------------------------------------------
    await OpportunityApplication.deleteMany({
      opportunity: opportunity._id
    });

    // --------------------------------------------------
    // DELETE EVENT
    // --------------------------------------------------
    await opportunity.deleteOne();

    return res.status(200).json({
      message: "Event deleted successfully"
    });

  } catch (error) {
    console.error(
      "Delete Opportunity Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete event",
      error: error.message
    });
  }
};


// ======================================================
// APPLY TO OPPORTUNITY
// ======================================================
const applyToOpportunity = async (req, res) => {
  try {
    // --------------------------------------------------
    // CHECK LOGIN
    // --------------------------------------------------
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // --------------------------------------------------
    // ONLY ATHLETE CAN APPLY
    // --------------------------------------------------
    if (req.user.role !== "athlete") {
      return res.status(403).json({
        message:
          "Only athletes can apply to opportunities"
      });
    }

    const athleteId = req.user._id || req.user.id;
    const { id } = req.params;

    if (!athleteId) {
      return res.status(401).json({
        message:
          "Athlete user ID not found. Please login again."
      });
    }

    // --------------------------------------------------
    // VALIDATE EVENT ID
    // --------------------------------------------------
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    // --------------------------------------------------
    // FIND EVENT
    // --------------------------------------------------
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // --------------------------------------------------
    // EVENT MUST BE ACTIVE
    // --------------------------------------------------
    if (opportunity.status !== "active") {
      return res.status(400).json({
        message:
          "Applications are not open for this event."
      });
    }

    // --------------------------------------------------
    // CHECK REGISTRATION DEADLINE
    // --------------------------------------------------
    const now = new Date();

    if (
      opportunity.registrationDeadline &&
      now > opportunity.registrationDeadline
    ) {
      return res.status(400).json({
        message:
          "The registration deadline for this event has passed."
      });
    }

    // --------------------------------------------------
    // CHECK EXISTING APPLICATION
    // --------------------------------------------------
    const existingApplication =
      await OpportunityApplication.findOne({
        opportunity: opportunity._id,
        athlete: athleteId
      });

    if (existingApplication) {
      return res.status(409).json({
        message:
          "You have already applied to this event.",
        application: existingApplication
      });
    }

    // --------------------------------------------------
    // CREATE APPLICATION
    // --------------------------------------------------
    const application =
      await OpportunityApplication.create({
        opportunity: opportunity._id,
        athlete: athleteId,
        status: "pending"
      });

    // --------------------------------------------------
    // POPULATE APPLICATION
    // --------------------------------------------------
    await application.populate([
      {
        path: "athlete",
        select: "name email role profilePic"
      },
      {
        path: "opportunity",
        select:
          "title type sport date registrationDeadline location status academy"
      }
    ]);

    return res.status(201).json({
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    // --------------------------------------------------
    // DUPLICATE APPLICATION
    // --------------------------------------------------
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "You have already applied to this event."
      });
    }

    console.error(
      "Apply To Opportunity Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to submit application",
      error: error.message
    });
  }
};


// ======================================================
// GET APPLICATION STATUS FOR ONE OPPORTUNITY
// ======================================================
const getApplicationStatus = async (req, res) => {
  try {
    // --------------------------------------------------
    // CHECK LOGIN
    // --------------------------------------------------
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // --------------------------------------------------
    // ONLY ATHLETE
    // --------------------------------------------------
    if (req.user.role !== "athlete") {
      return res.status(403).json({
        message:
          "Only athletes can check application status"
      });
    }

    const athleteId = req.user._id || req.user.id;
    const { id } = req.params;

    // --------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    // --------------------------------------------------
    // FIND APPLICATION
    // --------------------------------------------------
    const application =
      await OpportunityApplication.findOne({
        opportunity: id,
        athlete: athleteId
      }).populate(
        "opportunity",
        "title type sport date registrationDeadline location status"
      );

    // --------------------------------------------------
    // NOT APPLIED
    // --------------------------------------------------
    if (!application) {
      return res.status(200).json({
        applied: false,
        application: null
      });
    }

    // --------------------------------------------------
    // APPLIED
    // --------------------------------------------------
    return res.status(200).json({
      applied: true,
      application
    });

  } catch (error) {
    console.error(
      "Get Application Status Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch application status",
      error: error.message
    });
  }
};


// ======================================================
// GET CURRENT ATHLETE'S APPLICATIONS
// ======================================================
const getMyApplications = async (req, res) => {
  try {
    // --------------------------------------------------
    // CHECK LOGIN
    // --------------------------------------------------
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // --------------------------------------------------
    // ONLY ATHLETE
    // --------------------------------------------------
    if (req.user.role !== "athlete") {
      return res.status(403).json({
        message:
          "Only athletes can access their applications"
      });
    }

    const athleteId = req.user._id || req.user.id;

    if (!athleteId) {
      return res.status(401).json({
        message:
          "Athlete user ID not found. Please login again."
      });
    }

    // --------------------------------------------------
    // GET APPLICATIONS
    // --------------------------------------------------
    const applications =
      await OpportunityApplication.find({
        athlete: athleteId
      })
        .populate({
          path: "opportunity",
          populate: {
            path: "academy",
            select: "name email role profilePic"
          }
        })
        .sort({
          createdAt: -1
        });

    return res.status(200).json({
      applications
    });

  } catch (error) {
    console.error(
      "Get My Applications Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch your applications",
      error: error.message
    });
  }
};
// ======================================================
// GET APPLICANTS FOR ACADEMY EVENT
// ======================================================
const getOpportunityApplicants = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    if (req.user.role !== "academy") {
      return res.status(403).json({
        message: "Only academies can view applicants"
      });
    }

    const academyId = req.user._id || req.user.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Only event owner can see applicants
    if (
      opportunity.academy.toString() !==
      academyId.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only view applicants for your own events"
      });
    }

    const applications =
      await OpportunityApplication.find({
        opportunity: opportunity._id
      })
        .populate(
          "athlete",
          "name email role profilePic sport position experience achievements skills"
        )
        .populate(
          "opportunity",
          "title type sport date registrationDeadline location status"
        )
        .sort({
          createdAt: -1
        });

    return res.status(200).json({
      applications
    });

  } catch (error) {
    console.error(
      "Get Opportunity Applicants Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch applicants",
      error: error.message
    });
  }
};


// ======================================================
// UPDATE APPLICATION STATUS
// ACCEPT / REJECT ATHLETE
// ======================================================
const updateApplicationStatus = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    if (req.user.role !== "academy") {
      return res.status(403).json({
        message:
          "Only academies can update applications"
      });
    }

    const academyId = req.user._id || req.user.id;
    const { applicationId } = req.params;
    const { status } = req.body;

    // --------------------------------------------------
    // VALIDATE APPLICATION ID
    // --------------------------------------------------
    if (
      !mongoose.Types.ObjectId.isValid(applicationId)
    ) {
      return res.status(400).json({
        message: "Invalid application ID"
      });
    }

    // --------------------------------------------------
    // VALIDATE STATUS
    // --------------------------------------------------
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message:
          "Status must be either accepted or rejected"
      });
    }

    // --------------------------------------------------
    // FIND APPLICATION
    // --------------------------------------------------
    const application =
      await OpportunityApplication.findById(
        applicationId
      ).populate("opportunity");

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    // --------------------------------------------------
    // CHECK EVENT OWNERSHIP
    // --------------------------------------------------
    if (
      application.opportunity.academy.toString() !==
      academyId.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only manage applications for your own events"
      });
    }

    // --------------------------------------------------
    // UPDATE STATUS
    // --------------------------------------------------
    application.status = status;

    await application.save();

    // --------------------------------------------------
    // POPULATE RESPONSE
    // --------------------------------------------------
    await application.populate([
      {
        path: "athlete",
        select:
          "name email role profilePic sport position experience achievements skills"
      },
      {
        path: "opportunity",
        select:
          "title type sport date registrationDeadline location status academy"
      }
    ]);

    return res.status(200).json({
      message:
        `Application ${status} successfully`,
      application
    });

  } catch (error) {
    console.error(
      "Update Application Status Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update application status",
      error: error.message
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================
module.exports = {
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
};

