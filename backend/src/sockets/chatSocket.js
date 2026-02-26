const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.query.token || socket.handshake.headers['authorization'];
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = await User.findByPk(decoded.id);
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.name}`);

        // Join user specific room for notifications
        socket.join(`user_${socket.user.id}`);

        socket.on('joinChat', (chatId) => {
            socket.join(`chat_${chatId}`);
            console.log(`User ${socket.user.id} joined chat ${chatId}`);
        });

        socket.on('leaveChat', (chatId) => {
            socket.leave(`chat_${chatId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
