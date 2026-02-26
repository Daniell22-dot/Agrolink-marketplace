const cron = require('node-cron');
const { Op } = require('sequelize');
const Order = require('../models/Order');

// Run daily at midnight to cleanup old pending orders
const cleanupOldOrders = cron.schedule('0 0 * * *', async () => {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const result = await Order.update(
            { status: 'cancelled' },
            {
                where: {
                    status: 'pending',
                    paymentStatus: 'pending',
                    createdAt: {
                        [Op.lt]: threeDaysAgo
                    }
                }
            }
        );

        console.log(`Cleaned up ${result[0]} old pending orders`);
    } catch (error) {
        console.error('Order cleanup error:', error);
    }
});

module.exports = cleanupOldOrders;
