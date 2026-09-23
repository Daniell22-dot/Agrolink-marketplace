const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const {
    getProductVariants,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant
} = require('../controllers/variantController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/rbacMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { body } = require('express-validator');

router.route('/')
    .get(getProducts)
    .post(protect, checkRole('farmer', 'admin'), upload.array('images', 5), [
        body('name').notEmpty().withMessage('Name is required'),
        body('category').notEmpty().withMessage('Category is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('quantity').isNumeric().withMessage('Quantity must be a number')
    ], createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, checkRole('farmer', 'admin'), upload.array('images', 5), updateProduct)
    .delete(protect, checkRole('farmer', 'admin'), deleteProduct);

router.route('/:productId/variants')
    .get(getProductVariants)
    .post(protect, checkRole('farmer', 'admin'), [
        body('name').notEmpty().withMessage('Variant name is required'),
        body('value').notEmpty().withMessage('Variant value is required')
    ], createProductVariant);

router.route('/:productId/variants/:variantId')
    .put(protect, checkRole('farmer', 'admin'), updateProductVariant)
    .delete(protect, checkRole('farmer', 'admin'), deleteProductVariant);

module.exports = router;
