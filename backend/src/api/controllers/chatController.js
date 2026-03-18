const Chat = require('../../models/Chat');
const Message = require('../../models/Message');
const User = require('../../models/User');
const { Op } = require('sequelize');

// @desc    Get user conversations
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
    try {
        const conversations = await Chat.findAll({
            where: {
                [Op.or]: [{ buyerId: req.user.id }, { farmerId: req.user.id }]
            },
            include: [
                { model: User, as: 'Buyer', attributes: ['id', 'fullName', 'avatar'] },
                { model: User, as: 'Farmer', attributes: ['id', 'fullName', 'avatar'] }
            ],
            order: [['updatedAt', 'DESC']]
        });

        res.json({
            success: true,
            data: conversations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:chatId
// @access  Private
exports.getMessages = async (req, res, next) => {
    try {
        const messages = await Message.findAll({
            where: { chatId: req.params.chatId },
            include: [
                { model: User, as: 'Sender', attributes: ['id', 'fullName'] }
            ],
            order: [['createdAt', 'ASC']]
        });

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send a message
// @route   POST /api/chat/message
// @access  Private
exports.sendMessage = async (req, res, next) => {
    try {
        const { recipientId, productId, content } = req.body;
        let chatId = req.body.chatId;

        // If no chatId, find or create chat
        if (!chatId) {
            // Check existing chat
            let chat = await Chat.findOne({
                where: {
                    [Op.or]: [
                        { buyerId: req.user.id, farmerId: recipientId },
                        { buyerId: recipientId, farmerId: req.user.id }
                    ],
                    // Optional: limit by productId if you want separate chats per product
                    // productId: productId || null 
                }
            });

            if (!chat) {
                // Determine roles (simplified logic)
                const isBuyer = req.user.role === 'buyer';
                chat = await Chat.create({
                    buyerId: isBuyer ? req.user.id : recipientId,
                    farmerId: isBuyer ? recipientId : req.user.id,
                    productId: productId || null,
                    lastMessage: content
                });
            }
            chatId = chat.id;
        }

        const message = await Message.create({
            chatId,
            senderId: req.user.id,
            content
        });

        // Update Chat last message
        await Chat.update({ lastMessage: content, updatedAt: new Date() }, { where: { id: chatId } });

        // Emit Socket Event (if socket.io is set up globally)
        const io = req.app.get('io');
        if (io) {
            io.to(`chat_${chatId}`).emit('newMessage', message);
            io.to(`user_${recipientId}`).emit('notification', { type: 'message', content });
        }

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        next(error);
    }
};
