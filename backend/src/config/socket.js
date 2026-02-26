const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

exports.init = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Socket Authentication Middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.query.token;

            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            socket.userRole = decoded.role;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);

        // Join user's personal room for notifications
        socket.join(`user_${socket.userId}`);

        // Join chat room
        socket.on('joinChat', (chatId) => {
            socket.join(`chat_${chatId}`);
            console.log(`User ${socket.userId} joined chat ${chatId}`);
        });

        // Leave chat room
        socket.on('leaveChat', (chatId) => {
            socket.leave(`chat_${chatId}`);
            console.log(`User ${socket.userId} left chat ${chatId}`);
        });

        // Typing indicator
        socket.on('typing', ({ chatId, isTyping }) => {
            socket.to(`chat_${chatId}`).emit('userTyping', {
                userId: socket.userId,
                isTyping
            });
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });

    return io;
};

exports.getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

// Emit to specific user
exports.emitToUser = (userId, event, data) => {
    if (io) {
        io.to(`user_${userId}`).emit(event, data);
    }
};

// Emit to chat room
exports.emitToChat = (chatId, event, data) => {
    if (io) {
        io.to(`chat_${chatId}`).emit(event, data);
    }
};

module.exports = exports;
