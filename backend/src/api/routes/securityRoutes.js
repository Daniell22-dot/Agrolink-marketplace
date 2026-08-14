const express = require('express');
const router = express.Router();
const {
    createInvite,
    listInvites,
    acceptInvite,
    revokeInvite,
    getMySecurityStatus
} = require('../controllers/securityInviteController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole, require2FA } = require('../middleware/rbacMiddleware');

// Current user's security access status (any authenticated user)
router.get('/status', protect, getMySecurityStatus);

// Redeem a single-use invitation token (any authenticated user with a valid token)
router.post('/invites/accept', protect, acceptInvite);

// SUPER_ADMIN only — invitation lifecycle (mandatory 2FA)
router.post('/invites', protect, require2FA, checkRole('super_admin'), createInvite);
router.get('/invites', protect, require2FA, checkRole('super_admin'), listInvites);
router.post('/invites/:id/revoke', protect, require2FA, checkRole('super_admin'), revokeInvite);

module.exports = router;
