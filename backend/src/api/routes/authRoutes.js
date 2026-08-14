const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  googleAuth,
  getMe,
  refreshToken,
  enable2FA,
  verify2FA,
  disable2FA,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter, authLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/register', authLimiter, [
  body('fullName').notEmpty().withMessage('Full Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone').notEmpty().withMessage('Phone required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters')
], register);

router.post('/login', loginLimiter, [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], login);

router.post('/google', authLimiter, googleAuth);

router.post('/refresh-token', authLimiter, refreshToken);
router.post('/logout', authLimiter, logout);

// 2FA Routes
router.post('/2fa/enable', protect, enable2FA);
router.post('/2fa/verify', verify2FA);
router.post('/2fa/disable', protect, disable2FA);

router.get('/me', protect, getMe);

module.exports = router;