const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

router.post("/conversations", protect, getOrCreateConversation);
router.get("/conversations", protect, getConversations);
router.get("/conversations/:id/messages", protect, getMessages);
router.post("/conversations/:id/messages", protect, sendMessage);

module.exports = router;
