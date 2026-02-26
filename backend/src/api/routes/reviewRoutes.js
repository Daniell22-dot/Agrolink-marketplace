const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to access productId if nested
const {
    getProductReviews,
    addReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addReview);

// If mounted at /api/reviews, this handles /api/reviews/product/:productId
router.route('/product/:productId')
    .get(getProductReviews);

module.exports = router;
