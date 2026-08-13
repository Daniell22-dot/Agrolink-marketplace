const express = require('express');
const router = express.Router();
const { getHealthStatus, getSecurityMetrics } = require('../controllers/statusController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/rbacMiddleware');

// Public — anyone can check service health
router.get('/health', getHealthStatus);

// Admin only — security threat metrics
router.get('/security', protect, checkRole('admin'), getSecurityMetrics);

module.exports = router;
