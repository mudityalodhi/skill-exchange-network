const { Conversation, Message } = require("../models/Chat");
const { emitToUser } = require("../sockets/socketManager");

// @desc    Get or create conversation
// @route   POST /api/chat/conversations
// @access  Private
const getOrCreateConversation = async (req, res) => {
  const { participantId } = req.body;
  const userId = req.user._id;

  let conversation = await Conversation.findOne({
    participants: { $all: [userId, participantId] },
  })
    .populate("participants", "name profileImage lastSeen")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "name" },
    });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, participantId],
    });
    await conversation.populate("participants", "name profileImage lastSeen");
  }

  res.json({ success: true, conversation });
};

// @desc    Get all conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate("participants", "name profileImage lastSeen isActive")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "name" },
    })
    .sort("-lastMessageAt");

  res.json({ success: true, conversations });
};

// @desc    Get messages in a conversation
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
const getMessages = async (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    return res
      .status(404)
      .json({ success: false, message: "Conversation not found." });
  }

  if (!conversation.participants.includes(req.user._id)) {
    return res.status(403).json({ success: false, message: "Not authorized." });
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Message.countDocuments({ conversation: req.params.id });

  const messages = await Message.find({ conversation: req.params.id })
    .populate("sender", "name profileImage")
    .sort("-createdAt")
    .skip(skip)
    .limit(parseInt(limit));

  // Mark messages as read
  await Message.updateMany(
    {
      conversation: req.params.id,
      sender: { $ne: req.user._id },
      isRead: false,
    },
    { isRead: true, readAt: new Date() },
  );

  res.json({
    success: true,
    messages: messages.reverse(),
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
};

// @desc    Send a message
// @route   POST /api/chat/conversations/:id/messages
// @access  Private
const sendMessage = async (req, res) => {
  const { content } = req.body;
  const conversationId = req.params.id;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation || !conversation.participants.includes(req.user._id)) {
    return res.status(403).json({ success: false, message: "Not authorized." });
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    content,
  });

  await message.populate("sender", "name profileImage");

  // Update conversation
  conversation.lastMessage = message._id;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  // Emit to other participant
  const otherId = conversation.participants.find(
    (p) => p.toString() !== req.user._id.toString(),
  );
  emitToUser(otherId.toString(), "new_message", { message, conversationId });

  res.status(201).json({ success: true, message });
};

module.exports = {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
};
