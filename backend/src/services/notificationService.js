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
    const prefs = user.preferences || { emailNotifications: true, smsAlerts: true, orderUpdates: true };

    // Create in-app notification
    await this.createNotification({
        userId: user.id,
        type: 'order_status',
        title: 'Order Update',
        message: `Your order #${order.id} status: ${order.status}`,
        referenceId: order.id
    });

    // Send Email (if enabled in user preferences)
    if (prefs.emailNotifications !== false && prefs.orderUpdates !== false && user.email) {
        try {
            await sendEmail({
                email: user.email,
                subject: `AgroLink Order #${order.id} Update: ${order.status}`,
                template: 'orderConfirmation',
                data: {
                    fullName: user.fullName,
                    orderId: order.id,
                    total: order.totalAmount
                }
            });
        } catch (error) {
            console.error('Email send failed:', error);
        }
    }

    // Send SMS (if enabled in user preferences)
    if (prefs.smsAlerts !== false && user.phone) {
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
    const prefs = user.preferences || { emailNotifications: true, smsAlerts: true, orderUpdates: true };

    await this.createNotification({
        userId: user.id,
        type: 'payment',
        title: 'Payment Confirmation',
        message: `Payment of KES ${payment.amount} received. Receipt: ${payment.mpesaReceiptNumber}`,
        referenceId: payment.id
    });

    if (prefs.smsAlerts !== false && user.phone) {
        try {
            await sendSMS(
                user.phone,
                `AgroLink: Payment received. KES ${payment.amount}. Receipt: ${payment.mpesaReceiptNumber}`
            );
        } catch (error) {
            console.error('SMS send failed:', error);
        }
    }
};

module.exports = exports;
