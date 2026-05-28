const Review = require("../models/Review");
const Exchange = require("../models/Exchange");
const Notification = require("../models/Notification");

// ==================== REVIEW CONTROLLER ====================

const createReview = async (req, res) => {
  const { revieweeId, exchangeId, rating, comment, skillTaught } = req.body;

  const exchange = await Exchange.findById(exchangeId);
  if (!exchange || exchange.status !== "completed") {
    return res
      .status(400)
      .json({
        success: false,
        message: "Can only review completed exchanges.",
      });
  }

  const isParticipant = [
    exchange.sender.toString(),
    exchange.receiver.toString(),
  ].includes(req.user._id.toString());
  if (!isParticipant) {
    return res.status(403).json({ success: false, message: "Not authorized." });
  }

  const existing = await Review.findOne({
    reviewer: req.user._id,
    exchange: exchangeId,
  });
  if (existing) {
    return res
      .status(400)
      .json({ success: false, message: "Already reviewed this exchange." });
  }

  const review = await Review.create({
    reviewer: req.user._id,
    reviewee: revieweeId,
    exchange: exchangeId,
    rating,
    comment,
    skillTaught,
  });

  // Mark exchange as reviewed
  const isSender = exchange.sender.toString() === req.user._id.toString();
  if (isSender) exchange.senderReviewed = true;
  else exchange.receiverReviewed = true;
  await exchange.save();

  await review.populate("reviewer", "name profileImage");

  await Notification.create({
    recipient: revieweeId,
    sender: req.user._id,
    type: "new_review",
    title: "You received a new review! ⭐",
    message: `${req.user.name} gave you ${rating}/5 stars.`,
    link: `/profile/${revieweeId}`,
  });

  res.status(201).json({ success: true, message: "Review submitted!", review });
};

const getUserReviews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Review.countDocuments({
    reviewee: req.params.userId,
    isVisible: true,
  });

  const reviews = await Review.find({
    reviewee: req.params.userId,
    isVisible: true,
  })
    .populate("reviewer", "name profileImage")
    .sort("-createdAt")
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success: true,
    reviews,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
};

// ==================== NOTIFICATION CONTROLLER ====================

const getNotifications = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Notification.countDocuments({ recipient: req.user._id });

  const notifications = await Notification.find({ recipient: req.user._id })
    .populate("sender", "name profileImage")
    .sort("-createdAt")
    .skip(skip)
    .limit(parseInt(limit));

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  res.json({
    success: true,
    notifications,
    unreadCount,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
};

const markNotificationsRead = async (req, res) => {
  const { ids } = req.body;

  if (ids && ids.length > 0) {
    await Notification.updateMany(
      { _id: { $in: ids }, recipient: req.user._id },
      { isRead: true },
    );
  } else {
    await Notification.updateMany(
      { recipient: req.user._id },
      { isRead: true },
    );
  }

  res.json({ success: true, message: "Notifications marked as read." });
};

const deleteNotification = async (req, res) => {
  await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });
  res.json({ success: true, message: "Notification deleted." });
};

module.exports = {
  createReview,
  getUserReviews,
  getNotifications,
  markNotificationsRead,
  deleteNotification,
};
