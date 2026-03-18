const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/rbacMiddleware');

router.use(protect);

router.route('/')
    .post(createOrder);

router.route('/myorders')
    .get(getMyOrders);

router.route('/:id')
    .get(getOrderById);

router.route('/:id/status')
    .put(checkRole('admin', 'farmer'), updateOrderStatus);

router.route('/:id/cancel')
    .post(cancelOrder);

module.exports = router;
