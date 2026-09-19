const Connection = require("../models/connection.model");
const User = require("../models/user.model");
const Athlete = require("../models/athlete.model");

const coachFields =
    "name email role profilePic sport specialization experience organization";

const athleteFields =
    "name email role profilePic";

const academyFields =
    "name email role profilePic";


// ======================================================
// HELPER: POPULATE CONNECTION
// ======================================================

function populateConnection(query) {
    return query
        .populate("coach", coachFields)
        .populate("academy", academyFields)
        .populate("athlete", athleteFields);
}


// ======================================================
// COACH → ATHLETE : SEND REQUEST
// ======================================================

async function sendConnectionRequest(req, res) {
    try {
        const coachId = req.user.id;
        const athleteProfileId = req.params.athleteId;

        if (req.user.role !== "coach" && 
            req.user.role !== "academy"
        ) {
            return res.status(403).json({
                message: "Only coaches can send connection requests"
            });
        }

        const coach = await User.findById(coachId);

       if (
    !coach ||
    (coach.role !== "coach" && coach.role !== "academy")
) {
    return res.status(403).json({
        message: "Coach or academy account not found"
    });
}

        const athlete = await Athlete.findById(athleteProfileId);

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

        let connection = await Connection.findOne({
            coach: coachId,
            athlete: athleteUser._id
        });

        if (connection) {
            if (connection.status === "pending") {
                return res.status(400).json({
                    message: "Connection request already sent",
                    status: "pending"
                });
            }

            if (connection.status === "accepted") {
                return res.status(400).json({
                    message: "You are already connected with this athlete",
                    status: "accepted"
                });
            }

            if (
                connection.status === "rejected" ||
                connection.status === "cancelled"
            ) {
                connection.requestedBy = "coach";
                connection.status = "pending";

                await connection.save();

                return res.status(200).json({
                    message: "Connection request sent successfully",
                    status: "pending",
                    connection: await populateConnection(
                        Connection.findById(connection._id)
                    )
                });
            }
        }

        connection = await Connection.create({
            coach: coachId,
            athlete: athleteUser._id,
            requestedBy: "coach",
            status: "pending"
        });

        return res.status(201).json({
            message: "Connection request sent successfully",
            status: "pending",
            connection: await populateConnection(
                Connection.findById(connection._id)
            )
        });
    } catch (error) {
        console.error("Send connection request error:", error);

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


// ======================================================
// ATHLETE → COACH : SEND REQUEST
// ======================================================

async function sendAthleteConnectionRequest(req, res) {
    try {
        const athleteId = req.user.id;
        const coachId = req.params.coachId;

        if (req.user.role !== "athlete") {
            return res.status(403).json({
                message: "Only athletes can send connection requests"
            });
        }

        const athlete = await User.findById(athleteId);

        if (!athlete || athlete.role !== "athlete") {
            return res.status(403).json({
                message: "Athlete account not found"
            });
        }

        const coach = await User.findById(coachId);

        if (!coach || coach.role !== "coach") {
            return res.status(404).json({
                message: "Coach not found"
            });
        }

        if (athleteId === coachId) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        let connection = await Connection.findOne({
            coach: coachId,
            athlete: athleteId
        });

        if (connection) {
            if (connection.status === "pending") {
                return res.status(400).json({
                    message: "Connection request already sent",
                    status: "pending"
                });
            }

            if (connection.status === "accepted") {
                return res.status(400).json({
                    message: "You are already connected with this coach",
                    status: "accepted"
                });
            }

            if (
                connection.status === "rejected" ||
                connection.status === "cancelled"
            ) {
                connection.requestedBy = "athlete";
                connection.status = "pending";

                await connection.save();

                return res.status(200).json({
                    message: "Connection request sent successfully",
                    status: "pending",
                    connection: await populateConnection(
                        Connection.findById(connection._id)
                    )
                });
            }
        }

        connection = await Connection.create({
            coach: coachId,
            athlete: athleteId,
            requestedBy: "athlete",
            status: "pending"
        });

        return res.status(201).json({
            message: "Connection request sent successfully",
            status: "pending",
            connection: await populateConnection(
                Connection.findById(connection._id)
            )
        });
    } catch (error) {
        console.error(
            "Send athlete connection request error:",
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


// ======================================================
// COACH : CHECK ATHLETE CONNECTION STATUS
// ======================================================

async function getCoachConnectionStatus(req, res) {
    try {
        const coachId = req.user.id;
        const athleteProfileId = req.params.athleteId;

        if (req.user.role !== "coach") {
            return res.status(403).json({
                message: "Only coaches can check connection status"
            });
        }

        const athlete = await Athlete.findById(athleteProfileId);

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


// ======================================================
// ATHLETE : CHECK COACH CONNECTION STATUS
// ======================================================

async function getAthleteConnectionStatus(req, res) {
    try {
        const athleteId = req.user.id;
        const coachId = req.params.coachId;

        if (req.user.role !== "athlete") {
            return res.status(403).json({
                message: "Only athletes can check connection status"
            });
        }

        const coach = await User.findById(coachId);

        if (!coach || coach.role !== "coach") {
            return res.status(404).json({
                message: "Coach not found"
            });
        }

        const connection = await Connection.findOne({
            coach: coachId,
            athlete: athleteId
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
            "Get athlete connection status error:",
            error
        );

        return res.status(500).json({
            message: "Failed to get connection status",
            error: error.message
        });
    }
}


// ======================================================
// ATHLETE : GET INCOMING COACH REQUESTS
// ======================================================

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
            requestedBy: "coach",
            status: "pending"
        })
            .populate("coach", coachFields)
            .sort({ createdAt: -1 });

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


// ======================================================
// COACH : GET INCOMING ATHLETE REQUESTS
// ======================================================

async function getCoachConnectionRequests(req, res) {
    try {
        const coachId = req.user.id;

        if (req.user.role !== "coach") {
            return res.status(403).json({
                message: "Only coaches can view connection requests"
            });
        }

        const requests = await Connection.find({
            coach: coachId,
            requestedBy: "athlete",
            status: "pending"
        })
            .populate("athlete", athleteFields)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error(
            "Get coach connection requests error:",
            error
        );

        return res.status(500).json({
            message: "Error fetching connection requests",
            error: error.message
        });
    }
}


// ======================================================
// ACADEMY → ATHLETE : SEND REQUEST
// ======================================================

async function sendAcademyConnectionRequest(req, res) {
    try {
        const academyId = req.user.id;
        const athleteId = req.params.athleteId;

        if (req.user.role !== "academy") {
            return res.status(403).json({
                message: "Only academies can send connection requests"
            });
        }

        const academy = await User.findById(academyId);

        if (!academy || academy.role !== "academy") {
            return res.status(403).json({
                message: "Academy account not found"
            });
        }

        const athlete = await User.findById(athleteId);

        if (!athlete || athlete.role !== "athlete") {
            return res.status(404).json({
                message: "Athlete not found"
            });
        }

        if (academyId === athleteId) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        let connection = await Connection.findOne({
            academy: academyId,
            athlete: athleteId
        });

        if (connection) {
            if (connection.status === "pending") {
                return res.status(400).json({
                    message: "Connection request already sent",
                    status: "pending"
                });
            }

            if (connection.status === "accepted") {
                return res.status(400).json({
                    message: "You are already connected with this athlete",
                    status: "accepted"
                });
            }

            if (
                connection.status === "rejected" ||
                connection.status === "cancelled"
            ) {
                connection.requestedBy = "academy";
                connection.status = "pending";

                await connection.save();

                return res.status(200).json({
                    message: "Connection request sent successfully",
                    status: "pending",
                    connection: await populateConnection(
                        Connection.findById(connection._id)
                    )
                });
            }
        }

        connection = await Connection.create({
            academy: academyId,
            athlete: athleteId,
            requestedBy: "academy",
            status: "pending"
        });

        return res.status(201).json({
            message: "Connection request sent successfully",
            status: "pending",
            connection: await populateConnection(
                Connection.findById(connection._id)
            )
        });
    } catch (error) {
        console.error(
            "Send academy connection request error:",
            error
        );

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Connection request already exists"
            });
        }

        return res.status(500).json({
            message: "Error sending academy connection request",
            error: error.message
        });
    }
}


// ======================================================
// ATHLETE → ACADEMY : SEND REQUEST
// ======================================================

async function sendAthleteAcademyConnectionRequest(req, res) {
    try {
        const athleteId = req.user.id;
        const academyId = req.params.academyId;

        if (req.user.role !== "athlete") {
            return res.status(403).json({
                message: "Only athletes can send connection requests"
            });
        }

        const academy = await User.findById(academyId);

        if (!academy || academy.role !== "academy") {
            return res.status(404).json({
                message: "Academy not found"
            });
        }

        if (athleteId === academyId) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        let connection = await Connection.findOne({
            academy: academyId,
            athlete: athleteId
        });

        if (connection) {
            if (connection.status === "pending") {
                return res.status(400).json({
                    message: "Connection request already sent",
                    status: "pending"
                });
            }

            if (connection.status === "accepted") {
                return res.status(400).json({
                    message: "You are already connected with this academy",
                    status: "accepted"
                });
            }

            if (
                connection.status === "rejected" ||
                connection.status === "cancelled"
            ) {
                connection.requestedBy = "athlete";
                connection.status = "pending";

                await connection.save();

                return res.status(200).json({
                    message: "Connection request sent successfully",
                    status: "pending",
                    connection: await populateConnection(
                        Connection.findById(connection._id)
                    )
                });
            }
        }

        connection = await Connection.create({
            academy: academyId,
            athlete: athleteId,
            requestedBy: "athlete",
            status: "pending"
        });

        return res.status(201).json({
            message: "Connection request sent successfully",
            status: "pending",
            connection: await populateConnection(
                Connection.findById(connection._id)
            )
        });
    } catch (error) {
        console.error(
            "Send athlete academy connection request error:",
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


// ======================================================
// ACADEMY : CHECK ATHLETE CONNECTION STATUS
// ======================================================

async function getAcademyConnectionStatus(req, res) {
    try {
        const academyId = req.user.id;
        const athleteId = req.params.athleteId;

        if (req.user.role !== "academy") {
            return res.status(403).json({
                message: "Only academies can check connection status"
            });
        }

        const athlete = await User.findById(athleteId);

        if (!athlete || athlete.role !== "athlete") {
            return res.status(404).json({
                message: "Athlete not found"
            });
        }

        const connection = await Connection.findOne({
            academy: academyId,
            athlete: athleteId
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
            "Get academy athlete connection status error:",
            error
        );

        return res.status(500).json({
            message: "Failed to get connection status",
            error: error.message
        });
    }
}


// ======================================================
// ATHLETE : CHECK ACADEMY CONNECTION STATUS
// ======================================================

async function getAthleteAcademyConnectionStatus(req, res) {
    try {
        const athleteId = req.user.id;
        const academyId = req.params.academyId;

        if (req.user.role !== "athlete") {
            return res.status(403).json({
                message: "Only athletes can check connection status"
            });
        }

        const academy = await User.findById(academyId);

        if (!academy || academy.role !== "academy") {
            return res.status(404).json({
                message: "Academy not found"
            });
        }

        const connection = await Connection.findOne({
            academy: academyId,
            athlete: athleteId
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
            "Get athlete academy connection status error:",
            error
        );

        return res.status(500).json({
            message: "Failed to get connection status",
            error: error.message
        });
    }
}


// ======================================================
// ACADEMY → COACH : SEND REQUEST
// ======================================================

async function sendAcademyCoachConnectionRequest(req, res) {
    try {
        const academyId = req.user.id;
        const coachId = req.params.coachId;

        if (req.user.role !== "academy") {
            return res.status(403).json({
                message: "Only academies can send connection requests"
            });
        }

        const academy = await User.findById(academyId);

        if (!academy || academy.role !== "academy") {
            return res.status(403).json({
                message: "Academy account not found"
            });
        }

        const coach = await User.findById(coachId);

        if (!coach || coach.role !== "coach") {
            return res.status(404).json({
                message: "Coach not found"
            });
        }

        if (academyId === coachId) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        let connection = await Connection.findOne({
            academy: academyId,
            coach: coachId
        });

        if (connection) {
            if (connection.status === "pending") {
                return res.status(400).json({
                    message: "Connection request already sent",
                    status: "pending"
                });
            }

            if (connection.status === "accepted") {
                return res.status(400).json({
                    message: "You are already connected with this coach",
                    status: "accepted"
                });
            }

            if (
                connection.status === "rejected" ||
                connection.status === "cancelled"
            ) {
                connection.requestedBy = "academy";
                connection.status = "pending";

                await connection.save();

                return res.status(200).json({
                    message: "Connection request sent successfully",
                    status: "pending",
                    connection: await populateConnection(
                        Connection.findById(connection._id)
                    )
                });
            }
        }

        connection = await Connection.create({
            academy: academyId,
            coach: coachId,
            requestedBy: "academy",
            status: "pending"
        });

        return res.status(201).json({
            message: "Connection request sent successfully",
            status: "pending",
            connection: await populateConnection(
                Connection.findById(connection._id)
            )
        });
    } catch (error) {
        console.error(
            "Send academy coach connection request error:",
            error
        );

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Connection request already exists"
            });
        }

        return res.status(500).json({
            message: "Error sending academy coach connection request",
            error: error.message
        });
    }
}


// ======================================================
// COACH → ACADEMY : SEND REQUEST
// ======================================================

async function sendCoachAcademyConnectionRequest(req, res) {
    try {
        const coachId = req.user.id;
        const academyId = req.params.academyId;

        if (req.user.role !== "coach") {
            return res.status(403).json({
                message: "Only coaches can send connection requests"
            });
        }

        const academy = await User.findById(academyId);

        if (!academy || academy.role !== "academy") {
            return res.status(404).json({
                message: "Academy not found"
            });
        }

        if (coachId === academyId) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        let connection = await Connection.findOne({
            academy: academyId,
            coach: coachId
        });

        if (connection) {
            if (connection.status === "pending") {
                return res.status(400).json({
                    message: "Connection request already sent",
                    status: "pending"
                });
            }

            if (connection.status === "accepted") {
                return res.status(400).json({
                    message: "You are already connected with this academy",
                    status: "accepted"
                });
            }

            if (
                connection.status === "rejected" ||
                connection.status === "cancelled"
            ) {
                connection.requestedBy = "coach";
                connection.status = "pending";

                await connection.save();

                return res.status(200).json({
                    message: "Connection request sent successfully",
                    status: "pending",
                    connection: await populateConnection(
                        Connection.findById(connection._id)
                    )
                });
            }
        }

        connection = await Connection.create({
            academy: academyId,
            coach: coachId,
            requestedBy: "coach",
            status: "pending"
        });

        return res.status(201).json({
            message: "Connection request sent successfully",
            status: "pending",
            connection: await populateConnection(
                Connection.findById(connection._id)
            )
        });
    } catch (error) {
        console.error(
            "Send coach academy connection request error:",
            error
        );

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Connection request already exists"
            });
        }

        return res.status(500).json({
            message: "Error sending coach academy connection request",
            error: error.message
        });
    }
}


// ======================================================
// ACADEMY : CHECK COACH CONNECTION STATUS
// ======================================================

async function getAcademyCoachConnectionStatus(req, res) {
    try {
        const academyId = req.user.id;
        const coachId = req.params.coachId;

        if (req.user.role !== "academy") {
            return res.status(403).json({
                message: "Only academies can check connection status"
            });
        }

        const coach = await User.findById(coachId);

        if (!coach || coach.role !== "coach") {
            return res.status(404).json({
                message: "Coach not found"
            });
        }

        const connection = await Connection.findOne({
            academy: academyId,
            coach: coachId
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
            "Get academy coach connection status error:",
            error
        );

        return res.status(500).json({
            message: "Failed to get connection status",
            error: error.message
        });
    }
}


// ======================================================
// COACH : CHECK ACADEMY CONNECTION STATUS
// ======================================================

async function getCoachAcademyConnectionStatus(req, res) {
    try {
        const coachId = req.user.id;
        const academyId = req.params.academyId;

        if (req.user.role !== "coach") {
            return res.status(403).json({
                message: "Only coaches can check connection status"
            });
        }

        const academy = await User.findById(academyId);

        if (!academy || academy.role !== "academy") {
            return res.status(404).json({
                message: "Academy not found"
            });
        }

        const connection = await Connection.findOne({
            academy: academyId,
            coach: coachId
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
            "Get coach academy connection status error:",
            error
        );

        return res.status(500).json({
            message: "Failed to get connection status",
            error: error.message
        });
    }
}


// ======================================================
// ACADEMY : GET INCOMING REQUESTS
// ======================================================

async function getAcademyConnectionRequests(req, res) {
    try {
        const academyId = req.user.id;

        if (req.user.role !== "academy") {
            return res.status(403).json({
                message: "Only academies can view connection requests"
            });
        }

        const requests = await Connection.find({
            academy: academyId,
            requestedBy: {
                $in: ["athlete", "coach"]
            },
            status: "pending"
        })
            .populate("athlete", athleteFields)
            .populate("coach", coachFields)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error(
            "Get academy connection requests error:",
            error
        );

        return res.status(500).json({
            message: "Error fetching academy requests",
            error: error.message
        });
    }
}


// ======================================================
// ATHLETE : GET INCOMING ACADEMY REQUESTS
// ======================================================

async function getAthleteAcademyConnectionRequests(req, res) {
    try {
        const athleteId = req.user.id;

        if (req.user.role !== "athlete") {
            return res.status(403).json({
                message: "Only athletes can view academy requests"
            });
        }

        const requests = await Connection.find({
            athlete: athleteId,
            academy: { $ne: null },
            requestedBy: "academy",
            status: "pending"
        })
            .populate("academy", academyFields)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error(
            "Get athlete academy requests error:",
            error
        );

        return res.status(500).json({
            message: "Error fetching academy requests",
            error: error.message
        });
    }
}


// ======================================================
// COACH : GET INCOMING ACADEMY REQUESTS
// ======================================================

async function getCoachAcademyConnectionRequests(req, res) {
    try {
        const coachId = req.user.id;

        if (req.user.role !== "coach") {
            return res.status(403).json({
                message: "Only coaches can view academy requests"
            });
        }

        const requests = await Connection.find({
            coach: coachId,
            academy: { $ne: null },
            requestedBy: "academy",
            status: "pending"
        })
            .populate("academy", academyFields)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error(
            "Get coach academy requests error:",
            error
        );

        return res.status(500).json({
            message: "Error fetching academy requests",
            error: error.message
        });
    }
}


// ======================================================
// RESPOND TO CONNECTION REQUEST
// ======================================================

async function respondToConnectionRequest(req, res) {
    try {
        const userId = req.user.id;
        const connectionId = req.params.connectionId;
        const { action } = req.body;

        if (!["accepted", "rejected"].includes(action)) {
            return res.status(400).json({
                message: "Invalid action"
            });
        }

        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({
                message: "Connection request not found"
            });
        }

        if (connection.status !== "pending") {
            return res.status(400).json({
                message: "This request is no longer pending"
            });
        }

        const isAthleteResponding =
            req.user.role === "athlete" &&
            connection.athlete &&
            connection.athlete.toString() === userId &&
            ["coach", "academy"].includes(connection.requestedBy);

        const isCoachResponding =
            req.user.role === "coach" &&
            connection.coach &&
            connection.coach.toString() === userId &&
            ["athlete", "academy"].includes(connection.requestedBy);

        const isAcademyResponding =
            req.user.role === "academy" &&
            connection.academy &&
            connection.academy.toString() === userId &&
            ["athlete", "coach"].includes(connection.requestedBy);

        if (
            !isAthleteResponding &&
            !isCoachResponding &&
            !isAcademyResponding
        ) {
            return res.status(403).json({
                message:
                    "You are not authorized to respond to this request"
            });
        }

        connection.status = action;

        await connection.save();

        const updatedConnection = await populateConnection(
            Connection.findById(connection._id)
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


// ======================================================
// COACH : GET CONNECTED ATHLETES
// ======================================================

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
            athlete: { $ne: null },
            status: "accepted"
        })
            .populate("athlete", athleteFields)
            .sort({ updatedAt: -1 });

        const athletes = await Promise.all(
            connections
                .filter(connection => connection.athlete)
                .map(async connection => {
                    const athleteUser = connection.athlete;

                    const athleteProfile = await Athlete.findOne({
                        user: athleteUser._id
                    });

                    if (!athleteProfile) {
                        return null;
                    }

                    return {
                        ...athleteProfile.toObject(),

                        connectionId: connection._id,

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

        const validAthletes = athletes.filter(Boolean);

        return res.status(200).json({
            count: validAthletes.length,
            athletes: validAthletes
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


// ======================================================
// ATHLETE : GET CONNECTED COACHES
// ======================================================

async function getAthleteConnectedCoaches(req, res) {
    try {
        const athleteId = req.user.id;

        if (req.user.role !== "athlete") {
            return res.status(403).json({
                message: "Only athletes can view connected coaches"
            });
        }

        const connections = await Connection.find({
            athlete: athleteId,
            coach: { $ne: null },
            status: "accepted"
        })
            .populate("coach", coachFields)
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            count: connections.length,
            connections
        });
    } catch (error) {
        console.error(
            "Get athlete connected coaches error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch connected coaches",
            error: error.message
        });
    }
}


// ======================================================
// ACADEMY : GET CONNECTED ATHLETES
// ======================================================

async function getAcademyConnectedAthletes(req, res) {
    try {
        const academyId = req.user.id;

        if (req.user.role !== "academy") {
            return res.status(403).json({
                message: "Only academies can view connected athletes"
            });
        }

        const connections = await Connection.find({
            academy: academyId,
            athlete: { $ne: null },
            status: "accepted"
        })
            .populate("athlete", athleteFields)
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            count: connections.length,
            connections
        });
    } catch (error) {
        console.error(
            "Get academy connected athletes error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch connected athletes",
            error: error.message
        });
    }
}


// ======================================================
// ACADEMY : GET CONNECTED COACHES
// ======================================================

async function getAcademyConnectedCoaches(req, res) {
    try {
        const academyId = req.user.id;

        if (req.user.role !== "academy") {
            return res.status(403).json({
                message: "Only academies can view connected coaches"
            });
        }

        const connections = await Connection.find({
            academy: academyId,
            coach: { $ne: null },
            status: "accepted"
        })
            .populate("coach", coachFields)
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            count: connections.length,
            connections
        });
    } catch (error) {
        console.error(
            "Get academy connected coaches error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch connected coaches",
            error: error.message
        });
    }
}


// ======================================================
// ATHLETE : GET CONNECTED ACADEMIES
// ======================================================

async function getAthleteConnectedAcademies(req, res) {
    try {
        const athleteId = req.user.id;

        if (req.user.role !== "athlete") {
            return res.status(403).json({
                message: "Only athletes can view connected academies"
            });
        }

        const connections = await Connection.find({
            athlete: athleteId,
            academy: { $ne: null },
            status: "accepted"
        })
            .populate("academy", academyFields)
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            count: connections.length,
            connections
        });
    } catch (error) {
        console.error(
            "Get athlete connected academies error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch connected academies",
            error: error.message
        });
    }
}


// ======================================================
// COACH : GET CONNECTED ACADEMIES
// ======================================================

async function getCoachConnectedAcademies(req, res) {
    try {
        const coachId = req.user.id;

        if (req.user.role !== "coach") {
            return res.status(403).json({
                message: "Only coaches can view connected academies"
            });
        }

        const connections = await Connection.find({
            coach: coachId,
            academy: { $ne: null },
            status: "accepted"
        })
            .populate("academy", academyFields)
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            count: connections.length,
            connections
        });
    } catch (error) {
        console.error(
            "Get coach connected academies error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch connected academies",
            error: error.message
        });
    }
}


// ======================================================
// DISCONNECT CONNECTION
// ======================================================

async function disconnectConnection(req, res) {
    try {
        const userId = req.user.id;
        const connectionId = req.params.connectionId;

        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({
                message: "Connection not found"
            });
        }

        const isCoach =
            req.user.role === "coach" &&
            connection.coach &&
            connection.coach.toString() === userId;

        const isAthlete =
            req.user.role === "athlete" &&
            connection.athlete &&
            connection.athlete.toString() === userId;

        const isAcademy =
            req.user.role === "academy" &&
            connection.academy &&
            connection.academy.toString() === userId;

        if (!isCoach && !isAthlete && !isAcademy) {
            return res.status(403).json({
                message:
                    "You are not authorized to disconnect this connection"
            });
        }

        if (connection.status !== "accepted") {
            return res.status(400).json({
                message:
                    "Only an accepted connection can be disconnected",
                status: connection.status
            });
        }

        connection.status = "cancelled";

        await connection.save();

        return res.status(200).json({
            message: "Connection disconnected successfully",
            status: "cancelled",
            connection
        });
    } catch (error) {
        console.error("Disconnect connection error:", error);

        return res.status(500).json({
            message: "Error disconnecting connection",
            error: error.message
        });
    }
}


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    // Coach ↔ Athlete
    sendConnectionRequest,
    sendAthleteConnectionRequest,
    getCoachConnectionStatus,
    getAthleteConnectionStatus,
    getAthleteConnectionRequests,
    getCoachConnectionRequests,
    getCoachConnectedAthletes,
    getAthleteConnectedCoaches,

    // Academy ↔ Athlete
    sendAcademyConnectionRequest,
    sendAthleteAcademyConnectionRequest,
    getAcademyConnectionStatus,
    getAthleteAcademyConnectionStatus,
    getAthleteAcademyConnectionRequests,
    getAcademyConnectedAthletes,
    getAthleteConnectedAcademies,

    // Academy ↔ Coach
    sendAcademyCoachConnectionRequest,
    sendCoachAcademyConnectionRequest,
    getAcademyCoachConnectionStatus,
    getCoachAcademyConnectionStatus,
    getCoachAcademyConnectionRequests,
    getAcademyConnectedCoaches,
    getCoachConnectedAcademies,

    // Academy requests
    getAcademyConnectionRequests,

    // Common
    respondToConnectionRequest,
    disconnectConnection
};