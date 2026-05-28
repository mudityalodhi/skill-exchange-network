const Article = require("../models/Article");
const User = require("../models/User");

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res) => {
  const {
    category,
    search,
    featured,
    trending,
    page = 1,
    limit = 9,
    sort = "-createdAt",
  } = req.query;

  const query = { isPublished: true, status: "published" };

  if (category) query.category = category;
  if (featured === "true") query.isFeatured = true;
  if (trending === "true") query.isTrending = true;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Article.countDocuments(query);

  const articles = await Article.find(query)
    .populate("author", "name profileImage")
    .select("-content")
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success: true,
    articles,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
};

// @desc    Get article by slug
// @route   GET /api/articles/:slug
// @access  Public
const getArticleBySlug = async (req, res) => {
  const article = await Article.findOne({
    slug: req.params.slug,
    isPublished: true,
  }).populate("author", "name profileImage bio");

  if (!article) {
    return res
      .status(404)
      .json({ success: false, message: "Article not found." });
  }

  // Increment views
  article.views += 1;
  await article.save();

  // Get related articles
  const related = await Article.find({
    category: article.category,
    _id: { $ne: article._id },
    isPublished: true,
  })
    .select("title thumbnail category readTime slug")
    .limit(3);

  res.json({ success: true, article, related });
};

// @desc    Create article (Admin)
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = async (req, res) => {
  const { title, category, excerpt, content, tags, isFeatured, isTrending } =
    req.body;

  const article = await Article.create({
    title,
    category,
    excerpt,
    content,
    tags: tags ? JSON.parse(tags) : [],
    isFeatured: isFeatured === "true",
    isTrending: isTrending === "true",
    author: req.user._id,
  });

  if (req.file) {
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const { uploadToCloudinary } = require("../config/cloudinary");
        const result = await uploadToCloudinary(req.file.path, "sen/articles");
        article.thumbnail = result.secure_url;
        article.thumbnailCloudId = result.public_id;
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
      } catch (err) {
        article.thumbnail = `/uploads/${req.file.filename}`;
      }
    } else {
      article.thumbnail = `/uploads/${req.file.filename}`;
    }
    await article.save();
  }

  res.status(201).json({ success: true, message: "Article created!", article });
};

// @desc    Update article (Admin)
// @route   PUT /api/articles/:id
// @access  Private/Admin
const updateArticle = async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("author", "name profileImage");

  if (!article) {
    return res
      .status(404)
      .json({ success: false, message: "Article not found." });
  }

  res.json({ success: true, message: "Article updated.", article });
};

// @desc    Delete article (Admin)
// @route   DELETE /api/articles/:id
// @access  Private/Admin
const deleteArticle = async (req, res) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) {
    return res
      .status(404)
      .json({ success: false, message: "Article not found." });
  }
  res.json({ success: true, message: "Article deleted." });
};

// @desc    Like / Unlike article
// @route   POST /api/articles/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res
      .status(404)
      .json({ success: false, message: "Article not found." });
  }

  const isLiked = article.likes.includes(req.user._id);
  if (isLiked) {
    article.likes.pull(req.user._id);
  } else {
    article.likes.push(req.user._id);
  }
  await article.save();

  res.json({
    success: true,
    isLiked: !isLiked,
    likesCount: article.likesCount,
  });
};

// @desc    Bookmark / unbookmark article
// @route   POST /api/articles/:id/bookmark
// @access  Private
const toggleBookmarkArticle = async (req, res) => {
  const articleId = req.params.id;
  const user = req.user;

  const isBookmarked = user.bookmarkedArticles.includes(articleId);

  await User.findByIdAndUpdate(
    user._id,
    isBookmarked
      ? { $pull: { bookmarkedArticles: articleId } }
      : { $addToSet: { bookmarkedArticles: articleId } },
  );

  res.json({
    success: true,
    isBookmarked: !isBookmarked,
    message: isBookmarked ? "Removed from bookmarks." : "Article bookmarked.",
  });
};

// @desc    Get article categories with counts
// @route   GET /api/articles/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Article.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({ success: true, categories });
};

module.exports = {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLike,
  toggleBookmarkArticle,
  getCategories,
};
