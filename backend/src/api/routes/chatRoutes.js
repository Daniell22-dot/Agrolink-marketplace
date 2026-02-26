const express = require('express');
const router = express.Router();
const {
    getConversations,
    getMessages,
    sendMessage
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/conversations', getConversations);
router.get('/messages/:chatId', getMessages);
router.post('/message', sendMessage);

module.exports = router;
