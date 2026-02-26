const { body, param, validationResult } = require('express-validator');

// Create product validation
exports.createProductValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Product name must be between 3 and 200 characters'),

    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['vegetables', 'fruits', 'grains', 'livestock', 'dairy', 'poultry', 'fish', 'other'])
        .withMessage('Invalid category'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),

    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 1 })
        .withMessage('Price must be a positive number greater than 0'),

    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),

    body('unit')
        .notEmpty()
        .withMessage('Unit is required')
        .isIn(['kg', 'liters', 'pieces', 'bags', 'crates', 'bunches'])
        .withMessage('Invalid unit'),

    body('location')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Location must not exceed 200 characters'),

    body('harvestDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid harvest date format')
];

// Update product validation
exports.updateProductValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid product ID'),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Product name must be between 3 and 200 characters'),

    body('category')
        .optional()
        .isIn(['vegetables', 'fruits', 'grains', 'livestock', 'dairy', 'poultry', 'fish', 'other'])
        .withMessage('Invalid category'),

    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),

    body('price')
        .optional()
        .isFloat({ min: 1 })
        .withMessage('Price must be a positive number greater than 0'),

    body('quantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Quantity must be 0 or greater'),

    body('unit')
        .optional()
        .isIn(['kg', 'liters', 'pieces', 'bags', 'crates', 'bunches'])
        .withMessage('Invalid unit')
];

// Get product by ID validation
exports.getProductValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid product ID')
];

// Delete product validation
exports.deleteProductValidation = [
    param('id')
        .isInt()
        .withMessage('Invalid product ID')
];

// Add review validation
exports.addReviewValidation = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isInt()
        .withMessage('Invalid product ID'),

    body('rating')
        .notEmpty()
        .withMessage('Rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),

    body('comment')
        .trim()
        .notEmpty()
        .withMessage('Review comment is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Comment must be between 10 and 1000 characters')
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
