const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');
const { sendSMS } = require('./smsService');
const { emitToUser } = require('../config/socket');

// Create Notification
exports.createNotification = async ({ userId, type, title, message, referenceId }) => {
    try {
        const notification = await Notification.create({
            userId,
            type,
            title,
            message,
            referenceId
        });

        // Emit real-time notification via socket
        emitToUser(userId, 'notification', notification);

        return notification;
    } catch (error) {
        console.error('Create Notification Error:', error);
        throw error;
    }
};

// Send Order Notification
exports.sendOrderNotification = async (order, user) => {
    // Create in-app notification
    await this.createNotification({
        userId: user.id,
        type: 'order_status',
        title: 'Order Update',
        message: `Your order #${order.id} status: ${order.status}`,
        referenceId: order.id
    });

    // Send Email
    try {
        await sendEmail({
            email: user.email,
            template: 'orderConfirmation',
            data: {
                name: user.name,
                orderId: order.id,
                total: order.totalAmount
            }
        });
    } catch (error) {
        console.error('Email send failed:', error);
    }

    // Send SMS
    if (user.phone) {
        try {
            await sendSMS(
                user.phone,
                `AgroLink: Your order #${order.id} is ${order.status}. Total: KES ${order.totalAmount}`
            );
        } catch (error) {
            console.error('SMS send failed:', error);
        }
    }
};

// Send Payment Notification
exports.sendPaymentNotification = async (payment, user) => {
    await this.createNotification({
        userId: user.id,
        type: 'payment',
        title: 'Payment Confirmation',
        message: `Payment of KES ${payment.amount} received. Receipt: ${payment.mpesaReceiptNumber}`,
        referenceId: payment.id
    });

    if (user.phone) {
        await sendSMS(
            user.phone,
            `AgroLink: Payment received. KES ${payment.amount}. Receipt: ${payment.mpesaReceiptNumber}`
        );
    }
};

module.exports = exports;
