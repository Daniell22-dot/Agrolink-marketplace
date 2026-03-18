const redis = require('../../config/redis');
const Product = require('../../models/Product');

// Helper to get cart key
const getCartKey = (userId) => `cart:${userId}`;

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
    try {
        const key = getCartKey(req.user.id);
        const cart = await redis.get(key);

        res.json({
            success: true,
            data: cart ? JSON.parse(cart) : { items: [] }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const key = getCartKey(req.user.id);

        // Validate product
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        let cart = await redis.get(key);
        cart = cart ? JSON.parse(cart) : { items: [] };

        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += parseInt(quantity);
        } else {
            // Add new item
            cart.items.push({
                productId,
                name: product.name,
                price: parseFloat(product.price),
                image: product.images ? product.images[0] : null,
                quantity: parseInt(quantity)
            });
        }

        // Calculate total
        cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Save to Redis (expire in 7 days)
        await redis.set(key, JSON.stringify(cart), 'EX', 60 * 60 * 24 * 7);

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItemQuantity = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const key = getCartKey(req.user.id);

        let cart = await redis.get(key);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart = JSON.parse(cart);
        const itemIndex = cart.items.findIndex(item => item.productId === parseInt(productId));

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = parseInt(quantity);
            cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await redis.set(key, JSON.stringify(cart), 'EX', 60 * 60 * 24 * 7);
            res.json({ success: true, data: cart });
        } else {
            return res.status(404).json({ message: 'Item not in cart' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const key = getCartKey(req.user.id);

        let cart = await redis.get(key);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart = JSON.parse(cart);
        cart.items = cart.items.filter(item => item.productId !== parseInt(productId));

        // Recalculate total
        cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        await redis.set(key, JSON.stringify(cart), 'EX', 60 * 60 * 24 * 7);

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
    try {
        const key = getCartKey(req.user.id);
        await redis.del(key);

        res.json({
            success: true,
            data: { items: [], total: 0 }
        });
    } catch (error) {
        next(error);
    }
};
