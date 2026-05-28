const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Skill = require('../models/Skill');

// Get all skills
router.get('/', async (req, res) => {
  const { category, search, page = 1, limit = 20 } = req.query;
  const query = { isApproved: true };
  if (category) query.category = category;
  if (search) query.$text = { $search: search };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [skills, total] = await Promise.all([
    Skill.find(query).sort('-usersOffering').skip(skip).limit(parseInt(limit)),
    Skill.countDocuments(query),
  ]);
  res.json({ success: true, skills, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
});

// Get popular skills
router.get('/popular', async (req, res) => {
  const skills = await Skill.find({ isApproved: true }).sort('-usersOffering').limit(12);
  res.json({ success: true, skills });
});

// Create skill (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  const skill = await Skill.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, skill });
});

module.exports = router;
