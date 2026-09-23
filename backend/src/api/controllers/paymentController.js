const Order = require('../../models/Order');
const Payment = require('../../models/Payment');
const { initiateMpesaPayment, processPaymentCallback } = require('../../services/paymentService');
const { securityEvents, CATEGORIES } = require('../../services/securityEventService');

// @desc    Initiate M-Pesa payment
// @route   POST /api/payments/mpesa/initiate
// @access  Private
exports.initiateMpesaPayment = async (req, res, next) => {
    try {
        const { orderId, phoneNumber } = req.body;

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.userId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const result = await initiateMpesaPayment(order, phoneNumber);

        res.json({
            success: true,
            message: 'STK Push initiated. Please enter your M-Pesa PIN.',
            data: {
                checkoutRequestId: result.payment.checkoutRequestId,
                merchantRequestId: result.payment.merchantRequestId
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    M-Pesa callback handler
// @route   POST /api/payments/callback
// @access  Public (M-Pesa webhook)
exports.handleMpesaCallback = async (req, res, next) => {
    try {
        if (!req.body || !req.body.Body || !req.body.Body.stkCallback) {
            // Record webhook rejection event
            securityEvents.record(CATEGORIES.WEBHOOK_REJECTION, {
                ip: req.ip || req.connection?.remoteAddress || 'unknown',
                payload: JSON.stringify(req.body || {}).slice(0, 500),
                userAgent: req.get('User-Agent'),
            });
            return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid Callback Payload' });
        }
        await processPaymentCallback(req.body);
        res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
    } catch (error) {
        console.error('Callback error:', error);
        res.status(200).json({ ResultCode: 1, ResultDesc: 'Failed' });
    }
};

// @desc    Check payment status
// @route   GET /api/payments/status/:checkoutRequestId
// @access  Private
exports.checkPaymentStatus = async (req, res, next) => {
    try {
        const { checkPaymentStatus } = require('../../services/paymentService');
        const result = await checkPaymentStatus(req.params.checkoutRequestId);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res, next) => {
    try {
        const payments = await Payment.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Paystack webhook handler
// @route   POST /api/webhooks/paystack
// @access  Public (Paystack)
exports.handlePaystackWebhook = async (req, res, next) => {
    try {
        const signature = req.headers['x-paystack-signature'];
        const secret = process.env.PAYSTACK_SECRET_KEY;

        if (!signature || !secret) {
            return res.status(400).json({ message: 'Missing signature or secret' });
        }

        // Basic event logging
        const event = req.body;
        console.log('Paystack webhook event:', event.event || 'unknown');

        // TODO: verify Paystack HMAC signature with crypto
        // const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('base64');
        // if (hash !== signature) return res.status(401).json({ message: 'Invalid signature' });

        // Handle subscription events
        if (event.event === 'subscription.create' || event.event === 'subscription.enable') {
            // TODO: mark user/farmer as subscribed / extend plan
        }

        if (event.event === 'subscription.disable' || event.event === 'subscription.expire') {
            // TODO: downgrade or limit user/farmer features
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Paystack webhook error:', error);
        res.status(200).json({ received: true });
    }
};
