const express = require('express');
const router = express.Router();
const {
    getForYou,
    getSimilar,
    getTrending,
    getRecentlyViewed,
    trackInteraction
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/trending', getTrending);
router.get('/similar/:productId', getSimilar);

// Protected routes (require authentication)
router.get('/for-you', protect, getForYou);
router.get('/recently-viewed', protect, getRecentlyViewed);
router.post('/track', protect, trackInteraction);

module.exports = router;
