const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const { initiateStkPush, queryTransaction } = require('./mpesaService');

// Create Payment
exports.createPayment = async (orderId, userId, amount, method, phoneNumber) => {
    const payment = await Payment.create({
        orderId,
        userId,
        amount,
        method,
        phoneNumber,
        status: 'pending'
    });

    return payment;
};

// Initiate M-Pesa Payment
exports.initiateMpesaPayment = async (order, phoneNumber) => {
    try {
        const payment = await this.createPayment(
            order.id,
            order.userId,
            order.totalAmount,
            'mpesa',
            phoneNumber
        );

        const stkResponse = await initiateStkPush({
            phoneNumber,
            amount: order.totalAmount,
            accountReference: `ORDER${order.id}`,
            transactionDesc: `Payment for Order #${order.id}`
        });

        // Update payment with M-Pesa details
        payment.checkoutRequestId = stkResponse.CheckoutRequestID;
        payment.merchantRequestId = stkResponse.MerchantRequestID;
        payment.status = 'processing';
        await payment.save();

        return {
            payment,
            stkResponse
        };
    } catch (error) {
        console.error('M-Pesa Payment Error:', error);
        throw error;
    }
};

// Process Payment Callback
exports.processPaymentCallback = async (callbackData) => {
    try {
        const { Body } = callbackData;
        const { stkCallback } = Body;
        const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

        const payment = await Payment.findOne({
            where: { checkoutRequestId: CheckoutRequestID }
        });

        if (!payment) {
            console.error('Payment not found for CheckoutRequestID:', CheckoutRequestID);
            return;
        }

        if (ResultCode === 0) {
            // Success
            const metadata = {};
            stkCallback.CallbackMetadata?.Item?.forEach(item => {
                metadata[item.Name] = item.Value;
            });

            payment.status = 'completed';
            payment.mpesaReceiptNumber = metadata.MpesaReceiptNumber;
            payment.metadata = metadata;
            await payment.save();

            // Create transaction record
            await Transaction.create({
                orderId: payment.orderId,
                userId: payment.userId,
                amount: payment.amount,
                paymentMethod: 'mpesa',
                transactionId: metadata.MpesaReceiptNumber,
                mpesaReceiptNumber: metadata.MpesaReceiptNumber,
                phoneNumber: metadata.PhoneNumber,
                status: 'completed',
                metadata
            });

            // Update order payment status
            const order = await Order.findByPk(payment.orderId);
            if (order) {
                order.paymentStatus = 'completed';
                order.status = 'approved';
                await order.save();
            }
        } else {
            // Failed
            payment.status = 'failed';
            payment.metadata = { ResultDesc };
            await payment.save();
        }

        return payment;
    } catch (error) {
        console.error('Callback Processing Error:', error);
        throw error;
    }
};

// Check Payment Status
exports.checkPaymentStatus = async (checkoutRequestId) => {
    const mpesaStatus = await queryTransaction(checkoutRequestId);

    const payment = await Payment.findOne({
        where: { checkoutRequestId }
    });

    if (payment) {
        return {
            payment,
            mpesaStatus
        };
    }

    return { mpesaStatus };
};

module.exports = exports;
