const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLike,
  toggleBookmarkArticle,
  getCategories,
} = require("../controllers/articleController");

router.get("/", getArticles);
router.get("/categories", getCategories);
router.get("/:slug", getArticleBySlug);
router.post("/", protect, adminOnly, upload.single("thumbnail"), createArticle);
router.put("/:id", protect, adminOnly, updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/bookmark", protect, toggleBookmarkArticle);

module.exports = router;
