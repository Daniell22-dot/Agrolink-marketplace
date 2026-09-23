const Delivery = require('../../models/Delivery');
const DeliveryAgent = require('../../models/DeliveryAgent');
const Order = require('../../models/Order');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get available deliveries for agent
// @route   GET /api/deliveries/available
// @access  Private/Agent
exports.getAvailableDeliveries = async (req, res, next) => {
    try {
        const deliveries = await Delivery.findAll({
            where: { status: 'pending', agentId: null },
            include: [{ model: Order, include: [] }],
            order: [['createdAt', 'ASC']]
        });

        res.json({ success: true, data: deliveries });
    } catch (error) {
        next(error);
    }
};

// @desc    Get agent's assigned deliveries
// @route   GET /api/deliveries/my-jobs
// @access  Private/Agent
exports.getMyDeliveries = async (req, res, next) => {
    try {
        const deliveries = await Delivery.findAll({
            where: { agentId: req.user.id },
            include: [{ model: Order, include: [] }],
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, data: deliveries });
    } catch (error) {
        next(error);
    }
};

// @desc    Accept delivery job
// @route   POST /api/deliveries/:id/accept
// @access  Private/Agent
exports.acceptDelivery = async (req, res, next) => {
    try {
        const delivery = await Delivery.findByPk(req.params.id);

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        if (delivery.status !== 'pending' || delivery.agentId !== null) {
            return res.status(400).json({ message: 'Delivery already assigned' });
        }

        const agent = await DeliveryAgent.findOne({ where: { userId: req.user.id } });
        if (!agent) {
            return res.status(404).json({ message: 'Agent profile not found' });
        }

        if (agent.status !== 'available') {
            return res.status(400).json({ message: 'You are not available for deliveries' });
        }

        delivery.agentId = agent.id;
        delivery.status = 'assigned';
        delivery.estimatedPickupTime = new Date(Date.now() + 30 * 60 * 1000); // 30 mins from now
        await delivery.save();

        // Update agent status
        agent.status = 'busy';
        await agent.save();

        // Update order if needed
        await Order.update({ status: 'approved' }, { where: { id: delivery.orderId } });

        res.json({ success: true, data: delivery });
    } catch (error) {
        next(error);
    }
};

// @desc    Update delivery status
// @route   PUT /api/deliveries/:id/status
// @access  Private/Agent
exports.updateDeliveryStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const delivery = await Delivery.findByPk(req.params.id, {
            include: [{ model: Order }]
        });

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        if (delivery.agentId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const allowedTransitions = {
            'assigned': ['picked_up'],
            'picked_up': ['in_transit'],
            'in_transit': ['delivered', 'failed'],
            'delivered': [],
            'failed': []
        };

        if (!allowedTransitions[delivery.status]?.includes(status)) {
            return res.status(400).json({ message: `Cannot transition from ${delivery.status} to ${status}` });
        }

        delivery.status = status;

        if (status === 'picked_up') {
            delivery.pickedUpAt = new Date();
        } else if (status === 'delivered') {
            delivery.deliveredAt = new Date();
            // Release escrow
            const order = delivery.Order;
            if (order) {
                order.status = 'delivered';
                await order.save();
            }
        }

        await delivery.save();

        res.json({ success: true, data: delivery });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit proof of delivery
// @route   POST /api/deliveries/:id/proof
// @access  Private/Agent
exports.submitProofOfDelivery = async (req, res, next) => {
    try {
        const { proofOfDelivery, recipientName, recipientSignature } = req.body;
        const delivery = await Delivery.findByPk(req.params.id);

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        if (delivery.agentId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        delivery.proofOfDelivery = proofOfDelivery;
        delivery.recipientName = recipientName;
        delivery.recipientSignature = recipientSignature;
        delivery.status = 'delivered';
        delivery.deliveredAt = new Date();
        await delivery.save();

        // Update agent status back to available
        const agent = await DeliveryAgent.findOne({ where: { userId: delivery.agentId } });
        if (agent) {
            agent.status = 'available';
            agent.totalDeliveries += 1;
            await agent.save();
        }

        // Update order status
        const order = await Order.findByPk(delivery.orderId);
        if (order) {
            order.status = 'delivered';
            await order.save();
        }

        res.json({ success: true, data: delivery });
    } catch (error) {
        next(error);
    }
};

// @desc    Register as delivery agent
// @route   POST /api/deliveries/register-agent
// @access  Private
exports.registerAgent = async (req, res, next) => {
    try {
        const { phone, vehicleType, licensePlate } = req.body;

        const existing = await DeliveryAgent.findOne({ where: { userId: req.user.id } });
        if (existing) {
            return res.status(400).json({ message: 'Agent profile already exists' });
        }

        const agent = await DeliveryAgent.create({
            userId: req.user.id,
            phone: phone || req.user.phone,
            vehicleType: vehicleType || 'motorcycle',
            licensePlate: licensePlate || null,
            status: 'available'
        });

        res.status(201).json({ success: true, data: agent });
    } catch (error) {
        next(error);
    }
};

// @desc    Get agent profile
// @route   GET /api/deliveries/me
// @access  Private/Agent
exports.getMyAgentProfile = async (req, res, next) => {
    try {
        const agent = await DeliveryAgent.findOne({ where: { userId: req.user.id } });
        if (!agent) {
            return res.status(404).json({ message: 'Agent profile not found' });
        }

        res.json({ success: true, data: agent });
    } catch (error) {
        next(error);
    }
};
