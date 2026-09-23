const express = require('express');
const router = express.Router();
const { handleMpesaCallback, handlePaystackWebhook } = require('../controllers/paymentController');

// M-Pesa webhook callback
router.post('/mpesa', handleMpesaCallback);

// Paystack subscription/webhook callback
router.post('/paystack', handlePaystackWebhook);

module.exports = router;
