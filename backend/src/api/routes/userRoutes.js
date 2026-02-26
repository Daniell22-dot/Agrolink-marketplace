const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getMyProducts,
    getMyOrders
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/profile')
    .get(getUserProfile)
    .put(updateUserProfile);

router.put('/password', changePassword);
router.get('/my-products', getMyProducts);
router.get('/my-orders', getMyOrders);

module.exports = router;
