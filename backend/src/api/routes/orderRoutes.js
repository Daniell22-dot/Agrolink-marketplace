const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus
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
    .put(checkRole('admin', 'farmer'), updateOrderStatus); // Farmer might update their own order parts? For now admin/farmer

module.exports = router;
