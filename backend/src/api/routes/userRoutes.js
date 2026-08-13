const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getMyProducts,
    getMyOrders,
    updatePreferences,
    deleteAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes are protected
router.use(protect);

router.route('/profile')
    .get(getUserProfile)
    .put(upload.single('avatar'), updateUserProfile);

router.put('/password', changePassword);
router.put('/preferences', updatePreferences);
router.delete('/account', deleteAccount);
router.get('/my-products', getMyProducts);
router.get('/my-orders', getMyOrders);

module.exports = router;
