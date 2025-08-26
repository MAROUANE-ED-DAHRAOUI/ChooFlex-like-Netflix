const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// GET /api/settings/profile
router.get('/profile', settingsController.profile);

// PUT /api/settings/profile
router.put('/profile', settingsController.updateProfile);

// PUT /api/settings/password
router.put('/password', settingsController.changePassword);

// GET /api/settings/notifications
router.get('/notifications', settingsController.notifications);

// PUT /api/settings/notifications/:id/read
router.put('/notifications/:id/read', settingsController.markNotificationRead);

// PUT /api/settings/notifications/read-all
router.put('/notifications/read-all', settingsController.markAllNotificationsRead);

// DELETE /api/settings/notifications/:id
router.delete('/notifications/:id', settingsController.deleteNotification);

module.exports = router;
