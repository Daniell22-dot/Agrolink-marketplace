const express = require('express');
const router = express.Router();
const {
    initiateMpesaPayment,
    handleMpesaCallback,
    checkPaymentStatus,
    getPaymentHistory
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/mpesa/initiate', protect, initiateMpesaPayment);
router.post('/callback', handleMpesaCallback); // M-Pesa callback (no auth)
router.get('/status/:checkoutRequestId', protect, checkPaymentStatus);
router.get('/history', protect, getPaymentHistory);

module.exports = router;
