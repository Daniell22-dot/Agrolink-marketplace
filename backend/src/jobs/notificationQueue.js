const Queue = require('bull');
const { createNotification } = require('../services/notificationService');

let notificationQueue;

if (process.env.USE_REDIS === 'false') {
    console.log(' Redis is disabled. notificationQueue running in mockup mode (immediate async delivery).');
    notificationQueue = {
        process(handler) {
            this.handler = handler;
        },
        async add(data, options) {
            if (this.handler) {
                setTimeout(async () => {
                    try {
                        await this.handler({ data });
                    } catch (err) {
                        console.error('Notification mock queue execution error:', err);
                    }
                }, 0);
            }
            return { id: 'mock-job-id', data };
        }
    };
} else {
    notificationQueue = new Queue('notification', {
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            username: process.env.REDIS_USER_NAME || undefined
        }
    });
}

// Process notification jobs
notificationQueue.process(async (job) => {
    const { userId, type, title, message, referenceId } = job.data;

    try {
        await createNotification({ userId, type, title, message, referenceId });
        console.log(`Notification created for user ${userId}`);
        return { success: true };
    } catch (error) {
        console.error('Notification queue error:', error);
        throw error;
    }
});

// Add notification to queue
exports.queueNotification = async (notificationData) => {
    await notificationQueue.add(notificationData, {
        attempts: 2,
        backoff: 1000
    });
};

module.exports = notificationQueue;

