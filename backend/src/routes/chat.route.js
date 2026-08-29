const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chat.controller");

const authMiddleware = require("../middleware/auth.middleware");

// ======================================================
// CHAT / CONVERSATIONS
// ======================================================

// Create or get conversation with a connected user
router.post(
    "/conversation/:userId",
    authMiddleware,
    chatController.getOrCreateConversation
);

// Get all conversations of logged-in user
router.get(
    "/conversations",
    authMiddleware,
    chatController.getMyConversations
);

// ======================================================
// MESSAGES
// ======================================================

// Get messages of a conversation
router.get(
    "/:conversationId/messages",
    authMiddleware,
    chatController.getConversationMessages
);

// Send message
router.post(
    "/:conversationId/message",
    authMiddleware,
    chatController.sendMessage
);

// Mark received messages as read
router.put(
    "/:conversationId/read",
    authMiddleware,
    chatController.markMessagesAsRead
);

module.exports = router;