const express = require('express');
const router = express.Router();
const { getHealthStatus, getSecurityMetrics } = require('../controllers/statusController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole, require2FA } = require('../middleware/rbacMiddleware');

// Public — anyone can check service health
router.get('/health', getHealthStatus);

// Restricted — security threat metrics (SUPER_ADMIN / SECURITY_AUDITOR with mandatory 2FA)
router.get('/security', protect, require2FA, checkRole('super_admin', 'security_auditor'), getSecurityMetrics);

module.exports = router;
