const express = require('express');
const router = express.Router();

// In-memory store for support messages (replace with database in production)
let supportMessages = [];

// @desc    Submit support message
// @route   POST /api/support/contact
// @access  Public
router.post('/contact', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and message'
            });
        }

        const supportMessage = {
            id: Date.now(),
            name,
            email,
            subject: subject || 'Support Request',
            message,
            status: 'open',
            createdAt: new Date()
        };

        supportMessages.push(supportMessage);

        // In production, you would:
        // 1. Store in database
        // 2. Send email notification to support team
        // 3. Create a notification for admin

        console.log('New support message:', supportMessage);

        res.json({
            success: true,
            message: 'Thank you for contacting us! We will get back to you within 24 hours.',
            data: supportMessage
        });
    } catch (error) {
        console.error('Support contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// @desc    Get all support messages (admin only - add auth middleware in production)
// @route   GET /api/support/messages
// @access  Private/Admin
router.get('/messages', (req, res) => {
    try {
        res.json({
            success: true,
            data: supportMessages
        });
    } catch (error) {
        console.error('Error fetching support messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages'
        });
    }
});

module.exports = router;
