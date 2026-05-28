const Exchange = require('../models/Exchange');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { getSocketIO, emitToUser } = require('../sockets/socketManager');

// @desc    Send exchange request
// @route   POST /api/exchanges
// @access  Private
const sendExchangeRequest = async (req, res) => {
  const { receiverId, skillOffered, skillWanted, message, creditCost = 10 } = req.body;

  if (receiverId === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Cannot send request to yourself.' });
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (req.user.credits < creditCost) {
    return res.status(400).json({ success: false, message: 'Insufficient SEN credits.' });
  }

  // Check for existing pending request
  const existing = await Exchange.findOne({
    sender: req.user._id,
    receiver: receiverId,
    status: 'pending',
  });
  if (existing) {
    return res.status(400).json({ success: false, message: 'You already have a pending request with this user.' });
  }

  const exchange = await Exchange.create({
    sender: req.user._id,
    receiver: receiverId,
    skillOffered,
    skillWanted,
    message,
    creditCost,
  });

  // Notify receiver
  const notification = await Notification.create({
    recipient: receiverId,
    sender: req.user._id,
    type: 'exchange_request',
    title: 'New Exchange Request! 🔄',
    message: `${req.user.name} wants to exchange "${skillOffered}" for "${skillWanted}"`,
    link: `/exchanges/${exchange._id}`,
    data: { exchangeId: exchange._id },
  });

  emitToUser(receiverId, 'notification', notification);
  emitToUser(receiverId, 'exchange_request', { exchange, sender: req.user });

  await exchange.populate('sender receiver', 'name profileImage');

  res.status(201).json({ success: true, message: 'Exchange request sent!', exchange });
};

// @desc    Respond to exchange request (accept/reject)
// @route   PUT /api/exchanges/:id/respond
// @access  Private
const respondToExchange = async (req, res) => {
  const { action } = req.body; // 'accept' or 'reject'

  const exchange = await Exchange.findById(req.params.id)
    .populate('sender', 'name profileImage credits')
    .populate('receiver', 'name profileImage credits');

  if (!exchange) {
    return res.status(404).json({ success: false, message: 'Exchange not found.' });
  }

  if (exchange.receiver._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }

  if (exchange.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Exchange already responded to.' });
  }

  if (action === 'accept') {
    // Deduct credits from sender
    await User.findByIdAndUpdate(exchange.sender._id, { $inc: { credits: -exchange.creditCost } });

    exchange.status = 'accepted';
    await exchange.save();

    const notification = await Notification.create({
      recipient: exchange.sender._id,
      sender: req.user._id,
      type: 'exchange_accepted',
      title: 'Exchange Request Accepted! ✅',
      message: `${req.user.name} accepted your exchange request.`,
      link: `/exchanges/${exchange._id}`,
    });

    emitToUser(exchange.sender._id.toString(), 'notification', notification);
    emitToUser(exchange.sender._id.toString(), 'exchange_accepted', exchange);

  } else if (action === 'reject') {
    exchange.status = 'rejected';
    await exchange.save();

    await Notification.create({
      recipient: exchange.sender._id,
      sender: req.user._id,
      type: 'exchange_rejected',
      title: 'Exchange Request Declined',
      message: `${req.user.name} declined your exchange request.`,
      link: '/exchanges',
    });
  }

  res.json({ success: true, message: `Exchange ${action}ed.`, exchange });
};

// @desc    Mark exchange as completed
// @route   PUT /api/exchanges/:id/complete
// @access  Private
const completeExchange = async (req, res) => {
  const exchange = await Exchange.findById(req.params.id);

  if (!exchange) {
    return res.status(404).json({ success: false, message: 'Exchange not found.' });
  }

  if (![exchange.sender.toString(), exchange.receiver.toString()].includes(req.user._id.toString())) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }

  if (exchange.status !== 'accepted') {
    return res.status(400).json({ success: false, message: 'Exchange must be accepted first.' });
  }

  exchange.status = 'completed';
  exchange.completedAt = new Date();
  await exchange.save();

  // Award credits to receiver (teacher)
  await User.findByIdAndUpdate(exchange.receiver, {
    $inc: { credits: exchange.creditCost, totalTeachingSessions: 1 },
  });
  await User.findByIdAndUpdate(exchange.sender, {
    $inc: { totalLearningSessions: 1 },
  });

  // Notify both parties
  const notifications = [
    {
      recipient: exchange.receiver,
      type: 'credit_earned',
      title: `You earned ${exchange.creditCost} credits! 💰`,
      message: `Session with ${req.user.name} marked as complete.`,
      link: `/exchanges/${exchange._id}`,
    },
    {
      recipient: exchange.sender,
      type: 'exchange_completed',
      title: 'Session Completed! 🎉',
      message: 'Don\'t forget to leave a review!',
      link: `/exchanges/${exchange._id}`,
    },
  ];

  await Notification.insertMany(notifications);

  res.json({ success: true, message: 'Exchange marked as completed!', exchange });
};

// @desc    Get my exchanges
// @route   GET /api/exchanges
// @access  Private
const getMyExchanges = async (req, res) => {
  const { status, type = 'all', page = 1, limit = 10 } = req.query;
  const userId = req.user._id;

  let query = {};
  if (type === 'sent') query = { sender: userId };
  else if (type === 'received') query = { receiver: userId };
  else query = { $or: [{ sender: userId }, { receiver: userId }] };

  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Exchange.countDocuments(query);

  const exchanges = await Exchange.find(query)
    .populate('sender', 'name profileImage averageRating')
    .populate('receiver', 'name profileImage averageRating')
    .sort('-createdAt')
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success: true,
    exchanges,
    pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
  });
};

// @desc    Get exchange by ID
// @route   GET /api/exchanges/:id
// @access  Private
const getExchangeById = async (req, res) => {
  const exchange = await Exchange.findById(req.params.id)
    .populate('sender', 'name profileImage bio skillsOffered averageRating')
    .populate('receiver', 'name profileImage bio skillsOffered averageRating');

  if (!exchange) {
    return res.status(404).json({ success: false, message: 'Exchange not found.' });
  }

  const isParticipant = [exchange.sender._id.toString(), exchange.receiver._id.toString()].includes(
    req.user._id.toString()
  );

  if (!isParticipant) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }

  res.json({ success: true, exchange });
};

module.exports = {
  sendExchangeRequest,
  respondToExchange,
  completeExchange,
  getMyExchanges,
  getExchangeById,
};
