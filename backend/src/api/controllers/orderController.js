const Order = require('../../models/Order');
const OrderItem = require('../../models/OrderItem');
const Product = require('../../models/Product');
const redis = require('../../config/redis');

// Helper to get cart key
const getCartKey = (userId) => `cart:${userId}`;

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, contactPhone, paymentMethod } = req.body;
        const key = getCartKey(req.user.id);

        // Get Cart
        const cartData = await redis.get(key);
        if (!cartData) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const cart = JSON.parse(cartData);
        if (cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create Order
        const order = await Order.create({
            userId: req.user.id,
            totalAmount: cart.total,
            shippingAddress,
            contactPhone,
            paymentMethod,
            status: 'pending',
            paymentStatus: 'pending' // Should initiate payment here ideally
        });

        // Create Order Items
        const orderItems = cart.items.map(item => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name
        }));

        await OrderItem.bulkCreate(orderItems);

        // Clear Cart
        await redis.del(key);

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{ model: OrderItem }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: OrderItem, include: [Product] }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check ownership or admin
        if (order.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Seller (Admin only for status update usually, or seller for their parts)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Simple RBAC for status update
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update status' });
        }

        order.status = status;
        await order.save();

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};
