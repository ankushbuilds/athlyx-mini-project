const Connection = require("../models/connection.model");
const User = require("../models/user.model");
const Athlete = require("../models/athlete.model");

async function sendConnectionRequest(req, res) {
    try {
        const coachId = req.user.id;
        const athleteId = req.params.athleteId;

        if (req.user.role !== "coach") {
            return res.status(403).json({
                message: "Only coaches can send connection requests"
            });
        }

        const coach = await User.findById(coachId);

        if (!coach || coach.role !== "coach") {
            return res.status(403).json({
                message: "Coach account not found"
            });
        }

        const athlete = await Athlete.findById(athleteId);

        if (!athlete) {
            return res.status(404).json({
                message: "Athlete not found"
            });
        }

        const athleteUser = await User.findById(athlete.user);

        if (!athleteUser || athleteUser.role !== "athlete") {
            return res.status(404).json({
                message: "Athlete user not found"
            });
        }

        if (coachId === athleteUser._id.toString()) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        const existingConnection = await Connection.findOne({
            coach: coachId,
            athlete: athleteUser._id
        });

        if (existingConnection) {
            if (existingConnection.status === "pending") {
                return res.status(400).json({
                    message: "Connection request already sent",
                    status: "pending"
                });
            }

            if (existingConnection.status === "accepted") {
                return res.status(400).json({
                    message: "You are already connected with this athlete",
                    status: "accepted"
                });
            }

            if (existingConnection.status === "rejected") {
                return res.status(400).json({
                    message: "Connection request was rejected",
                    status: "rejected"
                });
            }

            if (existingConnection.status === "cancelled") {
                existingConnection.status = "pending";
                await existingConnection.save();

                return res.status(200).json({
                    message: "Connection request sent successfully",
                    status: "pending",
                    connection: existingConnection
                });
            }
        }

        const connection = await Connection.create({
            coach: coachId,
            athlete: athleteUser._id,
            status: "pending"
        });

        const populatedConnection = await Connection.findById(
            connection._id
        )
            .populate(
                "coach",
                "name email role profilePic"
            )
            .populate(
                "athlete",
                "name email role profilePic"
            );

        return res.status(201).json({
            message: "Connection request sent successfully",
            status: "pending",
            connection: populatedConnection
        });
    } catch (error) {
        console.error(
            "Send connection request error:",
            error
        );

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Connection request already exists"
            });
        }

        return res.status(500).json({
            message: "Error sending connection request",
            error: error.message
        });
    }
}

async function getCoachConnectionStatus(req, res) {
    try {
        const coachId = req.user.id;
        const athleteProfileId = req.params.athleteId;

        if (req.user.role !== "coach") {
            return res.status(403).json({
                message: "Only coaches can check connection status"
            });
        }

        const athlete = await Athlete.findById(
            athleteProfileId
        );

        if (!athlete) {
            return res.status(404).json({
                message: "Athlete not found"
            });
        }

        const connection = await Connection.findOne({
            coach: coachId,
            athlete: athlete.user
        });

        if (!connection) {
            return res.status(200).json({
                connected: false,
                status: "none"
            });
        }

        return res.status(200).json({
            connected: connection.status === "accepted",
            status: connection.status,
            connectionId: connection._id
        });
    } catch (error) {
        console.error(
            "Get coach connection status error:",
            error
        );

        return res.status(500).json({
            message: "Failed to get connection status",
            error: error.message
        });
    }
}

async function getAthleteConnectionRequests(req, res) {
    try {
        const athleteId = req.user.id;

        if (req.user.role !== "athlete") {
            return res.status(403).json({
                message: "Only athletes can view connection requests"
            });
        }

        const requests = await Connection.find({
            athlete: athleteId,
            status: "pending"
        })
            .populate(
                "coach",
                "name email role profilePic sport specialization experience organization"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error(
            "Get athlete connection requests error:",
            error
        );

        return res.status(500).json({
            message: "Error fetching connection requests",
            error: error.message
        });
    }
}

async function respondToConnectionRequest(req, res) {
    try {
        const athleteId = req.user.id;
        const connectionId = req.params.connectionId;
        const { action } = req.body;

        if (req.user.role !== "athlete") {
            return res.status(403).json({
                message: "Only athletes can respond to connection requests"
            });
        }

        if (!["accepted", "rejected"].includes(action)) {
            return res.status(400).json({
                message: "Invalid action"
            });
        }

        const connection = await Connection.findOne({
            _id: connectionId,
            athlete: athleteId,
            status: "pending"
        });

        if (!connection) {
            return res.status(404).json({
                message: "Connection request not found"
            });
        }

        connection.status = action;

        await connection.save();

        const updatedConnection = await Connection.findById(
            connection._id
        )
            .populate(
                "coach",
                "name email role profilePic sport specialization experience organization"
            )
            .populate(
                "athlete",
                "name email role profilePic"
            );

        return res.status(200).json({
            message:
                action === "accepted"
                    ? "Connection request accepted"
                    : "Connection request rejected",
            status: action,
            connection: updatedConnection
        });
    } catch (error) {
        console.error(
            "Respond to connection request error:",
            error
        );

        return res.status(500).json({
            message: "Error responding to connection request",
            error: error.message
        });
    }
}

async function getCoachConnectedAthletes(req, res) {
    try {
        const coachId = req.user.id;

        if (req.user.role !== "coach") {
            return res.status(403).json({
                message: "Only coaches can view connected athletes"
            });
        }

        const connections = await Connection.find({
            coach: coachId,
            status: "accepted"
        })
            .populate(
                "athlete",
                "name email role profilePic"
            )
            .sort({
                updatedAt: -1
            });

        const athletes = await Promise.all(
            connections
                .filter((connection) => connection.athlete)
                .map(async (connection) => {
                    const athleteUser = connection.athlete;

                    const athleteProfile =
                        await Athlete.findOne({
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
            count: athletes.filter(Boolean).length,
            athletes: athletes.filter(Boolean)
        });
    } catch (error) {
        console.error(
            "Get coach connected athletes error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch connected athletes",
            error: error.message
        });
    }
}

module.exports = {
    sendConnectionRequest,
    getCoachConnectionStatus,
    getAthleteConnectionRequests,
    respondToConnectionRequest,
    getCoachConnectedAthletes
};