const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getDashboardStats,
    getSalesReport,
    getUserAnalytics,
    getTopProducts
} = require('../controllers/analyticsController');

const router = express.Router();

// All analytics routes require authentication
router.use(protect);

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard statistics (admin only)
 * @access  Private (Admin)
 */
router.get('/dashboard', authorize('admin'), getDashboardStats);

/**
 * @route   POST /api/analytics/sales-report
 * @desc    Get sales report for date range (admin only)
 * @access  Private (Admin)
 */
router.post('/sales-report', authorize('admin'), getSalesReport);

/**
 * @route   GET /api/analytics/user/:userId
 * @desc    Get user analytics (user can view own, admin can view all)
 * @access  Private
 */
router.get('/user/:userId', getUserAnalytics);

/**
 * @route   GET /api/analytics/top-products
 * @desc    Get top products by performance (admin only)
 * @access  Private (Admin)
 */
router.get('/top-products', authorize('admin'), getTopProducts);

module.exports = router;
