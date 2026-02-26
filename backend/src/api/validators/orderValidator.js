const { body, param, validationResult } = require('express-validator');

// Create order validation
exports.createOrderValidation = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),

    body('items.*.productId')
        .notEmpty()
        .withMessage('Product ID is required for each item')
        .isInt()
        .withMessage('Invalid product ID'),

    body('items.*.quantity')
        .notEmpty()
        .withMessage('Quantity is required for each item')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),

    body('items.*.price')
        .notEmpty()
        .withMessage('Price is required for each item')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),

    body('shippingAddress')
        .trim()
        .notEmpty()
        .withMessage('Shipping address is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Shipping address must be between 10 and 500 characters'),

    body('contactPhone')
        .trim()
        .notEmpty()
        .withMessage('Contact phone is required')
        .matches(/^(\+254|254|0)[17]\d{8}$/)
        .withMessage('Please provide a valid Kenyan phone number'),

    body('paymentMethod')
        .notEmpty()
        .withMessage('Payment method is required')
        .isIn(['mpesa', 'card', 'cash_on_delivery'])
        .withMessage('Invalid payment method'),

    body('deliveryNotes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Delivery notes must not exceed 1000 characters')
];

// Update order status validation
exports.updateOrderStatusValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid order ID'),

    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['pending', 'approved', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid status')
];

// Get order validation
exports.getOrderValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid order ID')
];

// Cancel order validation
exports.cancelOrderValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid order ID'),

    body('reason')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Cancellation reason must not exceed 500 characters')
];

// Add order item validation
exports.addOrderItemValidation = [
    param('orderId')
        .isInt()
        .withMessage('Invalid order ID'),

    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isInt()
        .withMessage('Invalid product ID'),

    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),

    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
];

// Rate order validation (for delivery confirmation)
exports.rateOrderValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid order ID'),

    body('rating')
        .notEmpty()
        .withMessage('Rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),

    body('feedback')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Feedback must not exceed 1000 characters')
];

// Validation result handler
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg
            }))
        });
    }
    next();
};
