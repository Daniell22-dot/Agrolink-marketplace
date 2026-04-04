const recommendationService = require('../../services/recommendationService');
const { validationResult } = require('express-validator');

/**
 * @desc    Get personalized "For You" recommendations
 * @route   GET /api/recommendations/for-you
 * @access  Private
 */
exports.getForYou = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        // Pass user county so personalized feed boosts nearby products
        const county = req.user.county || req.user.location || null;
        const products = await recommendationService.getPersonalizedFeed(req.user.id, limit, county);

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get similar products (content-based + collaborative)
 * @route   GET /api/recommendations/similar/:productId
 * @access  Public
 */
exports.getSimilar = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const products = await recommendationService.getCombinedSimilar(
            parseInt(productId),
            limit
        );

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get trending products
 * @route   GET /api/recommendations/trending
 * @access  Public
 */
exports.getTrending = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const days = parseInt(req.query.days) || 7;
        const products = await recommendationService.getTrendingProducts(limit, days);

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user's recently viewed products
 * @route   GET /api/recommendations/recently-viewed
 * @access  Private
 */
exports.getRecentlyViewed = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const products = await recommendationService.getRecentlyViewed(req.user.id, limit);

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Track a user interaction (view, purchase, cart_add, etc.)
 * @route   POST /api/recommendations/track
 * @access  Private
 */
exports.trackInteraction = async (req, res, next) => {
    try {
        const { productId, interactionType, metadata } = req.body;

        if (!productId || !interactionType) {
            return res.status(400).json({
                success: false,
                message: 'productId and interactionType are required'
            });
        }

        const validTypes = ['view', 'purchase', 'cart_add', 'search', 'wishlist'];
        if (!validTypes.includes(interactionType)) {
            return res.status(400).json({
                success: false,
                message: `interactionType must be one of: ${validTypes.join(', ')}`
            });
        }

        const interaction = await recommendationService.trackInteraction(
            req.user.id,
            parseInt(productId),
            interactionType,
            metadata
        );

        res.status(201).json({
            success: true,
            data: interaction
        });
    } catch (error) {
        next(error);
    }
};
