const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics/stats
router.get('/stats', analyticsController.stats);

// GET /api/analytics/top-content
router.get('/top-content', analyticsController.topContent);

// GET /api/analytics/active-users
router.get('/active-users', analyticsController.activeUsers);

// GET /api/analytics/views-over-time
router.get('/views-over-time', analyticsController.viewsOverTime);

// Mock data endpoints for demo
router.get('/mock-users', analyticsController.getMockUsers);
router.get('/mock-content', analyticsController.getMockContent);

module.exports = router;
