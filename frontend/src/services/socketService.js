import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        this.socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
            auth: { token },
            transports: ['websocket']
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    // Chat methods
    joinChat(chatId) {
        if (this.socket) {
            this.socket.emit('joinChat', chatId);
        }
    }

    leaveChat(chatId) {
        if (this.socket) {
            this.socket.emit('leaveChat', chatId);
        }
    }

    sendMessage(chatId, message) {
        if (this.socket) {
            this.socket.emit('sendMessage', { chatId, message });
        }
    }

    onMessage(callback) {
        if (this.socket) {
            this.socket.on('newMessage', callback);
        }
    }

    onNotification(callback) {
        if (this.socket) {
            this.socket.on('notification', callback);
        }
    }

    typing(chatId, isTyping) {
        if (this.socket) {
            this.socket.emit('typing', { chatId, isTyping });
        }
    }

    onTyping(callback) {
        if (this.socket) {
            this.socket.on('userTyping', callback);
        }
    }
}

export default new SocketService();
