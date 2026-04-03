const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const {
    predictPrice,
    getPriceTrends,
    getOptimalPrice,
    trainPriceModel
} = require('../controllers/pricingController');

const router = express.Router();

/**
 * @route   POST /api/pricing/predict
 * @desc    Predict product price based on market conditions
 * @access  Private (Farmer)
 */
router.post('/predict', authenticate, authorize('farmer', 'admin'), predictPrice);

/**
 * @route   GET /api/pricing/trends/:category
 * @desc    Get price trends for a category
 * @access  Public
 */
router.get('/trends/:category', getPriceTrends);

/**
 * @route   GET /api/pricing/optimal/:productId
 * @desc    Get optimal price recommendation for a product
 * @access  Private (Farmer or Admin)
 */
router.get('/optimal/:productId', authenticate, authorize('farmer', 'admin'), getOptimalPrice);

/**
 * @route   POST /api/pricing/train-model
 * @desc    Retrain price prediction model
 * @access  Private (Admin only)
 */
router.post('/train-model', authenticate, authorize('admin'), trainPriceModel);

module.exports = router;
