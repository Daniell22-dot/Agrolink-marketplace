const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getRecentActivity,
    getAllUsers,
    updateUser,
    sendNotificationToUser,
    deleteUser,
    getAllProducts,
    updateProductStatus,
    getAllOrders,
    getOrderDetail,
    getChartData
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/rbacMiddleware');

router.use(protect);
router.use(checkRole('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activity', getRecentActivity);
router.get('/dashboard/chart/:type', getChartData);
router.get('/users', getAllUsers);
router.put('/users/:id/update', updateUser);
router.post('/users/:id/notify', sendNotificationToUser);
router.delete('/users/:id', deleteUser);
router.get('/products', getAllProducts);
router.put('/products/:id/:action', updateProductStatus);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetail);

module.exports = router;
