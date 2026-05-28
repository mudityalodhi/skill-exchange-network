const User = require("../models/User");
const Review = require("../models/Review");
const Exchange = require("../models/Exchange");
const path = require("path");
const fs = require("fs");

// @desc    Get all users (with filters)
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  const {
    search,
    skill,
    availability,
    sort = "-createdAt",
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { bio: { $regex: search, $options: "i" } },
      { "skillsOffered.skill": { $regex: search, $options: "i" } },
    ];
  }

  if (skill) {
    query["skillsOffered.skill"] = { $regex: skill, $options: "i" };
  }

  if (availability) {
    query.availability = availability;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .select(
      "name profileImage bio skillsOffered skillsWanted credits averageRating totalReviews availability location lastSeen",
    )
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success: true,
    users,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user || !user.isActive) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const reviews = await Review.find({ reviewee: user._id, isVisible: true })
    .populate("reviewer", "name profileImage")
    .sort("-createdAt")
    .limit(10);

  res.json({ success: true, user, reviews });
};

// @desc    Update profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  const allowedFields = [
    "name",
    "bio",
    "skillsOffered",
    "skillsWanted",
    "availability",
    "location",
    "socialLinks",
    "portfolioLinks",
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.json({ success: true, message: "Profile updated successfully.", user });
};

// @desc    Upload profile image
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Please upload an image." });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  // Try Cloudinary if configured
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const {
        uploadToCloudinary,
        deleteFromCloudinary,
      } = require("../config/cloudinary");
      const result = await uploadToCloudinary(req.file.path, "sen/avatars");

      // Delete old image
      const oldUser = await User.findById(req.user._id);
      if (oldUser.cloudinaryId) {
        await deleteFromCloudinary(oldUser.cloudinaryId);
      }

      // Delete local file
      fs.unlinkSync(req.file.path);

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profileImage: result.secure_url, cloudinaryId: result.public_id },
        { new: true },
      ).select("-password");

      return res.json({ success: true, message: "Avatar updated.", user });
    } catch (err) {
      console.error(
        "Cloudinary upload failed, using local storage:",
        err.message,
      );
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profileImage: imageUrl },
    { new: true },
  ).select("-password");

  res.json({ success: true, message: "Avatar updated.", user });
};

// @desc    Bookmark / unbookmark user
// @route   POST /api/users/:id/bookmark
// @access  Private
const toggleBookmarkUser = async (req, res) => {
  const targetId = req.params.id;
  const currentUser = req.user;

  if (targetId === currentUser._id.toString()) {
    return res
      .status(400)
      .json({ success: false, message: "Cannot bookmark yourself." });
  }

  const isBookmarked = currentUser.bookmarkedUsers.includes(targetId);

  const user = await User.findByIdAndUpdate(
    currentUser._id,
    isBookmarked
      ? { $pull: { bookmarkedUsers: targetId } }
      : { $addToSet: { bookmarkedUsers: targetId } },
    { new: true },
  ).select("-password");

  res.json({
    success: true,
    message: isBookmarked ? "Removed from bookmarks." : "Added to bookmarks.",
    isBookmarked: !isBookmarked,
    user,
  });
};

// @desc    Get AI-based matched users
// @route   GET /api/users/matches
// @access  Private
const getMatches = async (req, res) => {
  const currentUser = await User.findById(req.user._id);

  const wantedSkills = currentUser.skillsWanted || [];
  const offeredSkills = currentUser.skillsOffered.map((s) => s.skill) || [];

  // Find users who offer what current user wants AND want what current user offers
  const matches = await User.find({
    _id: { $ne: req.user._id },
    isActive: true,
    $or: [
      { "skillsOffered.skill": { $in: wantedSkills } },
      { skillsWanted: { $in: offeredSkills } },
    ],
  })
    .select(
      "name profileImage bio skillsOffered skillsWanted averageRating availability location",
    )
    .limit(12);

  // Score matches
  const scored = matches.map((user) => {
    let score = 0;
    user.skillsOffered.forEach((s) => {
      if (wantedSkills.includes(s.skill)) score += 3;
    });
    user.skillsWanted.forEach((s) => {
      if (offeredSkills.includes(s)) score += 2;
    });
    return { ...user.toObject(), matchScore: score };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);

  res.json({ success: true, matches: scored });
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  const userId = req.user._id;

  const [sentExchanges, receivedExchanges, reviews] = await Promise.all([
    Exchange.find({ sender: userId })
      .populate("receiver", "name profileImage")
      .sort("-createdAt")
      .limit(5),
    Exchange.find({ receiver: userId })
      .populate("sender", "name profileImage")
      .sort("-createdAt")
      .limit(5),
    Review.find({ reviewee: userId })
      .populate("reviewer", "name profileImage")
      .sort("-createdAt")
      .limit(5),
  ]);

  const stats = {
    totalExchanges: await Exchange.countDocuments({
      $or: [{ sender: userId }, { receiver: userId }],
      status: "completed",
    }),
    pendingRequests: await Exchange.countDocuments({
      receiver: userId,
      status: "pending",
    }),
    credits: req.user.credits,
    averageRating: req.user.averageRating,
    totalReviews: req.user.totalReviews,
  };

  res.json({
    success: true,
    stats,
    sentExchanges,
    receivedExchanges,
    reviews,
  });
};

module.exports = {
  getUsers,
  getUserById,
  updateProfile,
  uploadAvatar,
  toggleBookmarkUser,
  getMatches,
  getDashboard,
};
