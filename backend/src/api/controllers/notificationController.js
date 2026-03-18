const Notification = require('../../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 50
        });

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findByPk(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.userId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.json({
            success: true,
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

// Helper: Create Notification (internal use)
exports.createNotification = async ({ userId, type, title, message, referenceId }) => {
    try {
        await Notification.create({
            userId,
            type,
            title,
            message,
            referenceId
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};
