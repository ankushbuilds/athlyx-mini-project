const CoachAthlete = require("../models/coachAthlete.model");
const User = require("../models/user.model");

// ==========================================
// SEND REQUEST
// ==========================================

const sendAthleteRequest = async (req, res) => {
    try {
        const coachId = req.user.id;
        const { athleteId } = req.body;

        if (!athleteId) {
            return res.status(400).json({
                message: "Athlete ID is required"
            });
        }

        const coach = await User.findById(coachId);

        if (!coach || coach.role !== "coach") {
            return res.status(403).json({
                message: "Coach account required"
            });
        }

        const athlete = await User.findById(athleteId);

        if (!athlete || athlete.role !== "athlete") {
            return res.status(404).json({
                message: "Athlete not found"
            });
        }

        const existingRequest =
            await CoachAthlete.findOne({
                coach: coachId,
                athlete: athleteId
            });

        if (existingRequest) {
            return res.status(400).json({
                message:
                    `Request already exists with status: ${existingRequest.status}`
            });
        }

        const request = await CoachAthlete.create({
            coach: coachId,
            athlete: athleteId,
            status: "pending",
            requestedBy: "coach"
        });

        return res.status(201).json({
            message: "Athlete request sent successfully",
            request
        });
    } catch (error) {
        console.error(
            "Send athlete request error:",
            error
        );

        return res.status(500).json({
            message: "Failed to send athlete request"
        });
    }
};

// ==========================================
// GET MY ATHLETES
// ==========================================

const getMyAthletes = async (req, res) => {
    try {
        const coachId = req.user.id;

        // Find accepted connections for logged-in coach
        const connections = await Connection.find({
            coach: coachId,
            status: "accepted"
        })
            .populate({
                path: "athlete",
                select: "name email role profilePic"
            })
            .sort({
                updatedAt: -1
            });

        const athletes = await Promise.all(
            connections
                .filter((connection) => connection.athlete)
                .map(async (connection) => {
                    const athleteUser = connection.athlete;

                    const athleteProfile = await Athlete.findOne({
                        user: athleteUser._id
                    });

                    if (!athleteProfile) {
                        return null;
                    }

                    return {
                        ...athleteProfile.toObject(),

                        user: {
                            _id: athleteUser._id,
                            name: athleteUser.name,
                            email: athleteUser.email,
                            role: athleteUser.role,
                            profilePic: athleteUser.profilePic
                        }
                    };
                })
        );

        return res.status(200).json({
            athletes: athletes.filter(Boolean)
        });
    } catch (error) {
        console.error(
            "Get my athletes error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch your athletes"
        });
    }
};

// ==========================================
// GET ATHLETE REQUESTS
// ==========================================

const getAthleteRequests = async (req, res) => {
    try {
        const athleteId = req.user.id;

        const requests =
            await CoachAthlete.find({
                athlete: athleteId,
                status: "pending"
            })
                .populate({
                    path: "coach",
                    select: "-password"
                })
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            requests
        });
    } catch (error) {
        console.error(
            "Get athlete requests error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch athlete requests"
        });
    }
};

// ==========================================
// ACCEPT REQUEST
// ==========================================

const acceptAthleteRequest = async (req, res) => {
    try {
        const athleteId = req.user.id;
        const { requestId } = req.params;

        const request =
            await CoachAthlete.findOne({
                _id: requestId,
                athlete: athleteId,
                status: "pending"
            });

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        request.status = "accepted";

        await request.save();

        return res.status(200).json({
            message:
                "Coach request accepted successfully",
            request
        });
    } catch (error) {
        console.error(
            "Accept athlete request error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to accept request"
        });
    }
};

// ==========================================
// REJECT REQUEST
// ==========================================

const rejectAthleteRequest = async (req, res) => {
    try {
        const athleteId = req.user.id;
        const { requestId } = req.params;

        const request =
            await CoachAthlete.findOne({
                _id: requestId,
                athlete: athleteId,
                status: "pending"
            });

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        request.status = "rejected";

        await request.save();

        return res.status(200).json({
            message:
                "Coach request rejected successfully"
        });
    } catch (error) {
        console.error(
            "Reject athlete request error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to reject request"
        });
    }
};

module.exports = {
    sendAthleteRequest,
    getMyAthletes,
    getAthleteRequests,
    acceptAthleteRequest,
    rejectAthleteRequest
};