const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  uploadAvatar,
  toggleBookmarkUser,
  getMatches,
  getDashboard,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getUsers);
router.get("/dashboard", protect, getDashboard);
router.get("/matches", protect, getMatches);
router.get("/:id", getUserById);
router.put("/profile", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);
router.post("/:id/bookmark", protect, toggleBookmarkUser);

module.exports = router;
