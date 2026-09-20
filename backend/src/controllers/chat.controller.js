const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const Connection = require("../models/connection.model");
const User = require("../models/user.model");

// ======================================================
// HELPER: CHECK ACCEPTED CONNECTION
// ======================================================
//
// Allowed:
//
// 1. Athlete ↔ Coach
// 2. Athlete ↔ Academy
//
// Only accepted connections can chat.
// ======================================================

async function checkAcceptedConnection(userId, otherUserId) {
    try {
        const user = await User.findById(userId);
        const otherUser = await User.findById(otherUserId);

        if (!user || !otherUser) {
            return {
                allowed: false,
                message: "User not found"
            };
        }

        // ==================================================
        // ATHLETE ↔ COACH
        // ==================================================

        const athleteCoachPair =
            (user.role === "athlete" &&
                otherUser.role === "coach") ||
            (user.role === "coach" &&
                otherUser.role === "athlete");

        if (athleteCoachPair) {
            const coachId =
                user.role === "coach"
                    ? user._id
                    : otherUser._id;

            const athleteId =
                user.role === "athlete"
                    ? user._id
                    : otherUser._id;

            const connection =
                await Connection.findOne({
                    coach: coachId,
                    athlete: athleteId,
                    status: "accepted"
                });

            if (!connection) {
                return {
                    allowed: false,
                    message:
                        "You can only chat with an accepted connection"
                };
            }

            return {
                allowed: true,
                user,
                otherUser,
                connection
            };
        }

        // ==================================================
        // ATHLETE ↔ ACADEMY
        // ==================================================

        const athleteAcademyPair =
            (user.role === "athlete" &&
                otherUser.role === "academy") ||
            (user.role === "academy" &&
                otherUser.role === "athlete");

        if (athleteAcademyPair) {
            const academyId =
                user.role === "academy"
                    ? user._id
                    : otherUser._id;

            const athleteId =
                user.role === "athlete"
                    ? user._id
                    : otherUser._id;

            const connection =
                await Connection.findOne({
                    academy: academyId,
                    athlete: athleteId,
                    status: "accepted"
                });

            if (!connection) {
                return {
                    allowed: false,
                    message:
                        "You can only chat with an accepted connection"
                };
            }

            return {
                allowed: true,
                user,
                otherUser,
                connection
            };
        }

        // ==================================================
        // INVALID CHAT PAIR
        // ==================================================

        return {
            allowed: false,
            message:
                "Chat is only available between connected athletes, coaches and academies"
        };

    } catch (error) {
        console.error(
            "Check accepted connection error:",
            error
        );

        return {
            allowed: false,
            message: "Failed to check connection"
        };
    }
}


// ======================================================
// HELPER: CREATE DETERMINISTIC PARTICIPANT KEY
// ======================================================

function createParticipantKey(userId, otherUserId) {
    const participantIds = [
        userId.toString(),
        otherUserId.toString()
    ].sort();

    return {
        participantIds,
        participantKey: participantIds.join("_")
    };
}


// ======================================================
// CREATE / GET CONVERSATION
// ======================================================

async function getOrCreateConversation(req, res) {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.userId;

        // ==================================================
        // SELF CHAT CHECK
        // ==================================================

        if (
            userId.toString() ===
            otherUserId.toString()
        ) {
            return res.status(400).json({
                message:
                    "You cannot start a conversation with yourself"
            });
        }

        // ==================================================
        // CHECK ACCEPTED CONNECTION
        // ==================================================

        const connectionCheck =
            await checkAcceptedConnection(
                userId,
                otherUserId
            );

        if (!connectionCheck.allowed) {
            return res.status(403).json({
                message:
                    connectionCheck.message
            });
        }

        // ==================================================
        // CREATE PARTICIPANT KEY
        // ==================================================

        const {
            participantIds,
            participantKey
        } = createParticipantKey(
            userId,
            otherUserId
        );

        // ==================================================
        // FIND EXISTING CONVERSATION
        // ==================================================

        let conversation =
            await Conversation.findOne({
                participantKey
            })
                .populate(
                    "participants",
                    "name email role profilePic"
                )
                .populate(
                    "lastMessage",
                    "sender receiver text read createdAt"
                );

        // ==================================================
        // CREATE IF NOT EXISTS
        // ==================================================

        if (!conversation) {
            try {
                conversation =
                    await Conversation.create({
                        participants:
                            participantIds,
                        participantKey
                    });
            } catch (createError) {

                // Another request may have created the
                // same conversation at the same time.

                if (createError.code !== 11000) {
                    throw createError;
                }

                conversation =
                    await Conversation.findOne({
                        participantKey
                    });
            }

            // Populate newly created conversation
            conversation =
                await Conversation.findById(
                    conversation._id
                )
                    .populate(
                        "participants",
                        "name email role profilePic"
                    )
                    .populate(
                        "lastMessage",
                        "sender receiver text read createdAt"
                    );
        }

        return res.status(200).json({
            conversation
        });

    } catch (error) {
        console.error(
            "Get/Create conversation error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to get conversation",
            error:
                error.message
        });
    }
}


// ======================================================
// GET MY CONVERSATIONS
// ======================================================
//
// Athlete:
//     Connected Coaches
//     +
//     Connected Academies
//
// Coach:
//     Connected Athletes
//
// Academy:
//     Connected Athletes
//
// Only ACCEPTED connections are shown.
// ======================================================

async function getMyConversations(req, res) {
    try {
        const userId = req.user.id;

        // ==================================================
        // GET CURRENT USER
        // ==================================================

        const currentUser =
            await User.findById(userId);

        if (!currentUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // ==================================================
        // GET ACCEPTED CONNECTIONS
        // ==================================================

        let connections = [];

        // ==================================================
        // COACH
        // ==================================================

        if (currentUser.role === "coach") {
            connections =
                await Connection.find({
                    coach: userId,
                    status: "accepted",
                    athlete: {
                        $ne: null
                    }
                }).select(
                    "athlete"
                );
        }

        // ==================================================
        // ATHLETE
        // ==================================================
        //
        // Athlete can have:
        //
        // coach connections
        // academy connections
        //
        // So we use TWO queries.
        // ==================================================

        else if (currentUser.role === "athlete") {

            const coachConnections =
                await Connection.find({
                    athlete: userId,
                    coach: {
                        $ne: null
                    },
                    status: "accepted"
                }).select(
                    "coach"
                );

            const academyConnections =
                await Connection.find({
                    athlete: userId,
                    academy: {
                        $ne: null
                    },
                    status: "accepted"
                }).select(
                    "academy"
                );

            connections = [
                ...coachConnections.map(
                    connection => ({
                        connectedUser:
                            connection.coach
                    })
                ),

                ...academyConnections.map(
                    connection => ({
                        connectedUser:
                            connection.academy
                    })
                )
            ];
        }

        // ==================================================
        // ACADEMY
        // ==================================================

        else if (currentUser.role === "academy") {
            connections =
                await Connection.find({
                    academy: userId,
                    status: "accepted",
                    athlete: {
                        $ne: null
                    }
                }).select(
                    "athlete"
                );
        }

        // ==================================================
        // OTHER ROLES
        // ==================================================

        else {
            return res.status(200).json({
                count: 0,
                conversations: []
            });
        }

        // ==================================================
        // GET CONNECTED USER IDS
        // ==================================================

        let connectedUserIds = [];

        if (currentUser.role === "athlete") {

            connectedUserIds =
                connections
                    .map(
                        connection =>
                            connection.connectedUser
                    )
                    .filter(Boolean);
        }

        else if (currentUser.role === "coach") {

            connectedUserIds =
                connections
                    .map(
                        connection =>
                            connection.athlete
                    )
                    .filter(Boolean);
        }

        else if (currentUser.role === "academy") {

            connectedUserIds =
                connections
                    .map(
                        connection =>
                            connection.athlete
                    )
                    .filter(Boolean);
        }

        // ==================================================
        // REMOVE DUPLICATES
        // ==================================================

        const uniqueConnectedUserIds = [
            ...new Set(
                connectedUserIds.map(
                    id => id.toString()
                )
            )
        ];

        // ==================================================
        // CREATE CONVERSATION FOR EACH CONNECTION
        // ==================================================

        for (
            const connectedUserId
            of uniqueConnectedUserIds
        ) {
            try {

                // Make sure connected user still exists
                const connectedUser =
                    await User.findById(
                        connectedUserId
                    ).select(
                        "_id role"
                    );

                if (!connectedUser) {
                    continue;
                }

                // ==================================================
                // VERIFY CHAT PAIR
                // ==================================================

                const connectionCheck =
                    await checkAcceptedConnection(
                        userId,
                        connectedUserId
                    );

                if (!connectionCheck.allowed) {
                    continue;
                }

                // ==================================================
                // PARTICIPANT KEY
                // ==================================================

                const {
                    participantIds,
                    participantKey
                } = createParticipantKey(
                    userId,
                    connectedUserId
                );

                // ==================================================
                // CHECK EXISTING CONVERSATION
                // ==================================================

                const existingConversation =
                    await Conversation.findOne({
                        participantKey
                    });

                // ==================================================
                // CREATE CONVERSATION
                // ==================================================

                if (!existingConversation) {
                    try {

                        await Conversation.create({
                            participants:
                                participantIds,

                            participantKey
                        });

                    } catch (createError) {

                        // Ignore duplicate key caused
                        // by simultaneous requests.

                        if (
                            createError.code !==
                            11000
                        ) {
                            console.error(
                                "Conversation create error:",
                                createError
                            );
                        }
                    }
                }

            } catch (conversationError) {

                console.error(
                    "Conversation processing error:",
                    conversationError
                );

                // Don't break the whole Messages page
                // because of one bad connection.
                continue;
            }
        }

        // ==================================================
        // GET ALL CONVERSATIONS
        // ==================================================

        const conversations =
            await Conversation.find({
                participants: userId
            })
                .populate(
                    "participants",
                    "name email role profilePic"
                )
                .populate(
                    "lastMessage",
                    "sender receiver text read createdAt"
                )
                .sort({
                    lastMessageAt: -1,
                    updatedAt: -1
                });

        // ==================================================
        // ADD UNREAD COUNT
        // ==================================================

        const conversationsWithUnreadCount =
            await Promise.all(
                conversations.map(
                    async conversation => {

                        const unreadCount =
                            await Message.countDocuments({
                                conversation:
                                    conversation._id,

                                receiver:
                                    userId,

                                read: false
                            });

                        return {
                            ...conversation.toObject(),

                            unreadCount
                        };
                    }
                )
            );

        // ==================================================
        // RETURN
        // ==================================================

        return res.status(200).json({
            count:
                conversationsWithUnreadCount.length,

            conversations:
                conversationsWithUnreadCount
        });

    } catch (error) {

        console.error(
            "Get conversations error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch conversations",

            error:
                error.message
        });
    }
}


// ======================================================
// GET CONVERSATION MESSAGES
// ======================================================

async function getConversationMessages(req, res) {
    try {
        const userId = req.user.id;

        const conversationId =
            req.params.conversationId;

        // ==================================================
        // FIND CONVERSATION
        // ==================================================

        const conversation =
            await Conversation.findById(
                conversationId
            );

        if (!conversation) {
            return res.status(404).json({
                message:
                    "Conversation not found"
            });
        }

        // ==================================================
        // CHECK PARTICIPANT
        // ==================================================

        const isParticipant =
            conversation.participants.some(
                participant =>
                    participant.toString() ===
                    userId.toString()
            );

        if (!isParticipant) {
            return res.status(403).json({
                message:
                    "You are not authorized to view this conversation"
            });
        }

        // ==================================================
        // GET MESSAGES
        // ==================================================

        const messages =
            await Message.find({
                conversation:
                    conversationId
            })
                .populate(
                    "sender",
                    "name role profilePic"
                )
                .populate(
                    "receiver",
                    "name role profilePic"
                )
                .sort({
                    createdAt: 1
                });

        return res.status(200).json({
            count:
                messages.length,

            messages
        });

    } catch (error) {

        console.error(
            "Get conversation messages error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch messages",

            error:
                error.message
        });
    }
}


// ======================================================
// SEND MESSAGE
// ======================================================

async function sendMessage(req, res) {
    try {
        const senderId = req.user.id;

        const conversationId =
            req.params.conversationId;

        const { text } = req.body;

        // ==================================================
        // VALIDATE TEXT
        // ==================================================

        if (
            !text ||
            !text.trim()
        ) {
            return res.status(400).json({
                message:
                    "Message cannot be empty"
            });
        }

        // ==================================================
        // FIND CONVERSATION
        // ==================================================

        const conversation =
            await Conversation.findById(
                conversationId
            );

        if (!conversation) {
            return res.status(404).json({
                message:
                    "Conversation not found"
            });
        }

        // ==================================================
        // CHECK SENDER
        // ==================================================

        const isParticipant =
            conversation.participants.some(
                participant =>
                    participant.toString() ===
                    senderId.toString()
            );

        if (!isParticipant) {
            return res.status(403).json({
                message:
                    "You are not authorized to send messages in this conversation"
            });
        }

        // ==================================================
        // FIND RECEIVER
        // ==================================================

        const receiverId =
            conversation.participants.find(
                participant =>
                    participant.toString() !==
                    senderId.toString()
            );

        if (!receiverId) {
            return res.status(400).json({
                message:
                    "Receiver not found"
            });
        }

        // ==================================================
        // CHECK ACCEPTED CONNECTION
        // ==================================================

        const connectionCheck =
            await checkAcceptedConnection(
                senderId,
                receiverId.toString()
            );

        if (!connectionCheck.allowed) {
            return res.status(403).json({
                message:
                    connectionCheck.message
            });
        }

        // ==================================================
        // CREATE MESSAGE
        // ==================================================

        const message =
            await Message.create({
                conversation:
                    conversationId,

                sender:
                    senderId,

                receiver:
                    receiverId,

                text:
                    text.trim()
            });

        // ==================================================
        // UPDATE CONVERSATION
        // ==================================================

        conversation.lastMessage =
            message._id;

        conversation.lastMessageAt =
            message.createdAt;

        await conversation.save();

        // ==================================================
        // POPULATE MESSAGE
        // ==================================================

        const populatedMessage =
            await Message.findById(
                message._id
            )
                .populate(
                    "sender",
                    "name role profilePic"
                )
                .populate(
                    "receiver",
                    "name role profilePic"
                );

        return res.status(201).json({
            message:
                populatedMessage
        });

    } catch (error) {

        console.error(
            "Send message error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to send message",

            error:
                error.message
        });
    }
}


// ======================================================
// MARK MESSAGES AS READ
// ======================================================

async function markMessagesAsRead(req, res) {
    try {
        const userId = req.user.id;

        const conversationId =
            req.params.conversationId;

        // ==================================================
        // FIND CONVERSATION
        // ==================================================

        const conversation =
            await Conversation.findById(
                conversationId
            );

        if (!conversation) {
            return res.status(404).json({
                message:
                    "Conversation not found"
            });
        }

        // ==================================================
        // CHECK PARTICIPANT
        // ==================================================

        const isParticipant =
            conversation.participants.some(
                participant =>
                    participant.toString() ===
                    userId.toString()
            );

        if (!isParticipant) {
            return res.status(403).json({
                message:
                    "You are not authorized to access this conversation"
            });
        }

        // ==================================================
        // MARK RECEIVED MESSAGES AS READ
        // ==================================================

        await Message.updateMany(
            {
                conversation:
                    conversationId,

                receiver:
                    userId,

                read: false
            },
            {
                $set: {
                    read: true
                }
            }
        );

        return res.status(200).json({
            message:
                "Messages marked as read"
        });

    } catch (error) {

        console.error(
            "Mark messages as read error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to mark messages as read",

            error:
                error.message
        });
    }
}


// ======================================================
// GET TOTAL UNREAD MESSAGE COUNT
// ======================================================

async function getUnreadMessageCount(req, res) {
    try {
        const userId = req.user.id;

        const unreadCount =
            await Message.countDocuments({
                receiver:
                    userId,

                read: false
            });

        return res.status(200).json({
            success: true,

            unreadCount
        });

    } catch (error) {

        console.error(
            "Get unread message count error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to get unread message count",

            error:
                error.message
        });
    }
}


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    getOrCreateConversation,
    getMyConversations,
    getConversationMessages,
    sendMessage,
    markMessagesAsRead,
    getUnreadMessageCount
};