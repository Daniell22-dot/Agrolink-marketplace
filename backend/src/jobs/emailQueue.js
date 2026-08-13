const Queue = require('bull');
const { sendEmail } = require('../services/emailService');

let emailQueue;

if (process.env.USE_REDIS === 'false') {
    console.log(' Redis is disabled. emailQueue running in mockup mode (immediate async delivery).');
    emailQueue = {
        process(handler) {
            this.handler = handler;
        },
        async add(data, options) {
            if (this.handler) {
                setTimeout(async () => {
                    try {
                        await this.handler({ data });
                    } catch (err) {
                        console.error('Email mock queue execution error:', err);
                    }
                }, 0);
            }
            return { id: 'mock-job-id', data };
        }
    };
} else {
    emailQueue = new Queue('email', {
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            username: process.env.REDIS_USER_NAME || undefined
        }
    });
}

// Process email jobs
emailQueue.process(async (job) => {
    const { email, template, data } = job.data;

    try {
        await sendEmail({ email, template, data });
        console.log(`Email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('Email queue error:', error);
        throw error;
    }
});

// Add email to queue
exports.queueEmail = async (emailData) => {
    await emailQueue.add(emailData, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        }
    });
};

module.exports = emailQueue;

