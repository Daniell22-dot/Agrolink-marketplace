const { body, param, query, validationResult } = require('express-validator');

// Validation rules
exports.registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('phone').isMobilePhone().withMessage('Valid phone number is required'),
    body('role').isIn(['farmer', 'buyer']).withMessage('Invalid role')
];

exports.loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

exports.productValidation = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('category')
        .isIn(['vegetables', 'fruits', 'grains', 'livestock', 'dairy', 'other'])
        .withMessage('Invalid category'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('unit').isIn(['kg', 'liters', 'pieces', 'bags']).withMessage('Invalid unit')
];

exports.orderValidation = [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('contactPhone').isMobilePhone().withMessage('Valid phone number is required')
];

exports.reviewValidation = [
    body('productId').isInt().withMessage('Valid product ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Review comment is required')
];

// Validation result handler
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};
