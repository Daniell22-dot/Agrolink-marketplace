const ProductVariant = require('../../models/ProductVariant');
const Product = require('../../models/Product');

// @desc    Get product variants
// @route   GET /api/products/:productId/variants
// @access  Public
exports.getProductVariants = async (req, res, next) => {
    try {
        const variants = await ProductVariant.findAll({
            where: { productId: req.params.productId }
        });

        res.json({
            success: true,
            data: variants
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product variant
// @route   POST /api/products/:productId/variants
// @access  Private/Seller
exports.createProductVariant = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.farmerId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const variant = await ProductVariant.create({
            productId: req.params.productId,
            name: req.body.name,
            value: req.body.value,
            priceDelta: req.body.priceDelta || 0,
            stockQty: req.body.stockQty || 0,
            sku: req.body.sku || null
        });

        res.status(201).json({
            success: true,
            data: variant
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product variant
// @route   PUT /api/products/:productId/variants/:variantId
// @access  Private/Seller
exports.updateProductVariant = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.farmerId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const variant = await ProductVariant.findOne({
            where: {
                id: req.params.variantId,
                productId: req.params.productId
            }
        });

        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        const updated = await variant.update({
            name: req.body.name ?? variant.name,
            value: req.body.value ?? variant.value,
            priceDelta: req.body.priceDelta ?? variant.priceDelta,
            stockQty: req.body.stockQty ?? variant.stockQty,
            sku: req.body.sku ?? variant.sku
        });

        res.json({
            success: true,
            data: updated
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product variant
// @route   DELETE /api/products/:productId/variants/:variantId
// @access  Private/Seller
exports.deleteProductVariant = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.farmerId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const variant = await ProductVariant.findOne({
            where: {
                id: req.params.variantId,
                productId: req.params.productId
            }
        });

        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        await variant.destroy();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
