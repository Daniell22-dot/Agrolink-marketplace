const pythonApiClient = require('../../services/pythonApiClient');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/analytics/dashboard
 * @access  Private (Admin)
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        const stats = await pythonApiClient.getDashboardStats(startDate, endDate);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get sales report for date range
 * @route   POST /api/analytics/sales-report
 * @access  Private (Admin)
 */
exports.getSalesReport = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'startDate and endDate are required'
            });
        }

        const report = await pythonApiClient.getSalesReport(startDate, endDate);

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user analytics (purchase history, spending, etc.)
 * @route   GET /api/analytics/user/:userId
 * @access  Private (Admin or User viewing own data)
 */
exports.getUserAnalytics = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Authorization: users can only view their own analytics, admins can view all
        if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this user analytics'
            });
        }

        const analytics = await pythonApiClient.getUserAnalytics(userId);

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get top products by revenue, units, or ratings
 * @route   GET /api/analytics/top-products
 * @access  Private (Admin)
 */
exports.getTopProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const days = parseInt(req.query.days) || 30;

        const products = await pythonApiClient.getTopProducts(limit, days);

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};
