const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered.' });
  }

  const user = await User.create({ name, email, password });

  // Welcome notification
  await Notification.create({
    recipient: user._id,
    type: 'system',
    title: 'Welcome to SEN! 🎉',
    message: `Welcome ${name}! You have 50 starter credits. Start by listing skills you can teach.`,
    link: '/profile',
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully!',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      credits: user.credits,
      role: user.role,
    },
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  if (!user.isActive) {
    return res.status(401).json({ success: false, message: 'Your account has been deactivated.' });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Logged in successfully!',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      credits: user.credits,
      role: user.role,
    },
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('bookmarkedUsers', 'name profileImage averageRating skillsOffered')
    .populate('bookmarkedArticles', 'title thumbnail category');

  res.json({ success: true, user });
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully.' });
};

module.exports = { register, login, getMe, updatePassword };
