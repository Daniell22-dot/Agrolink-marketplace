const express = require('express');
const router = express.Router();
const { handleMpesaCallback } = require('../controllers/paymentController');

// M-Pesa webhook callback
router.post('/mpesa', handleMpesaCallback);

// Future webhooks can be added here
// router.post('/stripe', handleStripeWebhook);

module.exports = router;
