const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const Connection = require("../models/connection.model");
const User = require("../models/user.model");

// ======================================================
// HELPER: CHECK ATHLETE ↔ COACH ACCEPTED CONNECTION
// ======================================================

async function checkAcceptedConnection(userId, otherUserId) {
    const user = await User.findById(userId);
    const otherUser = await User.findById(otherUserId);

    if (!user || !otherUser) {
        return {
            allowed: false,
            message: "User not found"
        };
    }

    // Only athlete ↔ coach chat is allowed
    const validPair =
        (user.role === "athlete" && otherUser.role === "coach") ||
        (user.role === "coach" && otherUser.role === "athlete");

    if (!validPair) {
        return {
            allowed: false,
            message: "Chat is only available between athletes and coaches"
        };
    }

    const coachId =
        user.role === "coach"
            ? user._id
            : otherUser._id;

    const athleteId =
        user.role === "athlete"
            ? user._id
            : otherUser._id;

    const connection = await Connection.findOne({
        coach: coachId,
        athlete: athleteId,
        status: "accepted"
    });

    if (!connection) {
        return {
            allowed: false,
            message: "You can only chat with an accepted connection"
        };
    }

    return {
        allowed: true,
        user,
        otherUser,
        connection
    };
}


// ======================================================
// CREATE / GET CONVERSATION
// ======================================================

async function getOrCreateConversation(req, res) {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.userId;

        if (userId === otherUserId) {
            return res.status(400).json({
                message: "You cannot start a conversation with yourself"
            });
        }

        const connectionCheck =
            await checkAcceptedConnection(
                userId,
                otherUserId
            );

        if (!connectionCheck.allowed) {
            return res.status(403).json({
                message: connectionCheck.message
            });
        }

        // Create deterministic key so A ↔ B
        // and B ↔ A always use the same conversation
        const participantIds = [
            userId.toString(),
            otherUserId.toString()
        ].sort();

        const participantKey =
            participantIds.join("_");

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

        // Create conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [
                    participantIds[0],
                    participantIds[1]
                ],
                participantKey
            });

            conversation =
                await Conversation.findById(
                    conversation._id
                )
                .populate(
                    "participants",
                    "name email role profilePic"
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
            message: "Failed to get conversation",
            error: error.message
        });
    }
}




// ======================================================
// GET MY CONVERSATIONS
// ======================================================

async function getMyConversations(req, res) {
    try {
        const userId = req.user.id;

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
        // ADD UNREAD COUNT FOR CURRENT USER
        // ==================================================

        const conversationsWithUnreadCount =
            await Promise.all(
                conversations.map(async conversation => {

                    const unreadCount =
                        await Message.countDocuments({
                            conversation: conversation._id,
                            receiver: userId,
                            read: false
                        });

                    return {
                        ...conversation.toObject(),
                        unreadCount
                    };
                })
            );

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

        const conversation =
            await Conversation.findById(
                conversationId
            );

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        }

        // Make sure logged-in user belongs
        // to this conversation
        const isParticipant =
            conversation.participants.some(
                participant =>
                    participant.toString() === userId
            );

        if (!isParticipant) {
            return res.status(403).json({
                message:
                    "You are not authorized to view this conversation"
            });
        }

        const messages =
            await Message.find({
                conversation: conversationId
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
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error(
            "Get conversation messages error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch messages",
            error: error.message
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

        // Validate message
        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Message cannot be empty"
            });
        }

        const conversation =
            await Conversation.findById(
                conversationId
            );

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        }

        // Check sender belongs to conversation
        const isParticipant =
            conversation.participants.some(
                participant =>
                    participant.toString() === senderId
            );

        if (!isParticipant) {
            return res.status(403).json({
                message:
                    "You are not authorized to send messages in this conversation"
            });
        }

        // Find receiver
        const receiverId =
            conversation.participants.find(
                participant =>
                    participant.toString() !== senderId
            );

        if (!receiverId) {
            return res.status(400).json({
                message: "Receiver not found"
            });
        }

        // IMPORTANT:
        // Check connection is still accepted
        const connectionCheck =
            await checkAcceptedConnection(
                senderId,
                receiverId.toString()
            );

        if (!connectionCheck.allowed) {
            return res.status(403).json({
                message: connectionCheck.message
            });
        }

        // Create message
        const message =
            await Message.create({
                conversation: conversationId,
                sender: senderId,
                receiver: receiverId,
                text: text.trim()
            });

        // Update conversation
        conversation.lastMessage =
            message._id;

        conversation.lastMessageAt =
            message.createdAt;

        await conversation.save();

        // Return populated message
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
            message: "Failed to send message",
            error: error.message
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

        const conversation =
            await Conversation.findById(
                conversationId
            );

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found"
            });
        }

        const isParticipant =
            conversation.participants.some(
                participant =>
                    participant.toString() === userId
            );

        if (!isParticipant) {
            return res.status(403).json({
                message:
                    "You are not authorized to access this conversation"
            });
        }

        await Message.updateMany(
            {
                conversation: conversationId,
                receiver: userId,
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
            error: error.message
        });
    }
}
// ======================================================
// GET TOTAL UNREAD MESSAGE COUNT
// ======================================================

async function getUnreadMessageCount(req, res) {
    try {
        const userId = req.user.id;

        const unreadCount = await Message.countDocuments({
            receiver: userId,
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
            message: "Failed to get unread message count",
            error: error.message
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