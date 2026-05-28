const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications, markNotificationsRead, deleteNotification,
} = require('../controllers/reviewNotificationController');

router.get('/', protect, getNotifications);
router.put('/read', protect, markNotificationsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
