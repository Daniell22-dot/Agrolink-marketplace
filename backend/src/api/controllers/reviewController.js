const Review = require('../../models/Review');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const OrderItem = require('../../models/OrderItem');
const User = require('../../models/User');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews (handled by route structure)
// @access  Public
exports.getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.findAll({
            where: { productId },
            include: [
                { model: User, attributes: ['id', 'fullName', 'avatar'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;

        // Check verification - Did user buy this product?
        const orderItem = await OrderItem.findOne({
            where: { productId },
            include: [{
                model: Order,
                where: {
                    userId: req.user.id,
                    status: 'delivered' // Only review if delivered
                }
            }]
        });

        const isVerifiedPurchase = !!orderItem;

        if (!isVerifiedPurchase) {
            // Optional: Bloack review if not purchased? Or just mark as unverified?
            // Requirement says "Verified Reviews System", implies blocking or marking.
            // Let's block for strictness or just allow tagging.
            // For now, let's block non-purchasers to prevent spam, or make it a requirement.
            return res.status(403).json({ message: 'You can only review products you have purchased and received.' });
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({
            where: { userId: req.user.id, productId }
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = await Review.create({
            userId: req.user.id,
            productId,
            orderId: orderItem.Order.id,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        next(error);
    }
};
// @desc    Get latest reviews (for homepage)
// @route   GET /api/reviews/latest
// @access  Public
exports.getLatestReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            limit: 10,
            include: [
                { model: User, attributes: ['fullName', 'county'] },
                { model: Product, attributes: ['name', 'imageUrl'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};
