const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Agent routes
router.post('/register-agent', protect, deliveryController.registerAgent);
router.get('/me', protect, authorize('agent'), deliveryController.getMyAgentProfile);
router.get('/available', protect, authorize('agent'), deliveryController.getAvailableDeliveries);
router.get('/my-jobs', protect, authorize('agent'), deliveryController.getMyDeliveries);
router.post('/:id/accept', protect, authorize('agent'), deliveryController.acceptDelivery);
router.put('/:id/status', protect, authorize('agent'), deliveryController.updateDeliveryStatus);
router.post('/:id/proof', protect, authorize('agent'), deliveryController.submitProofOfDelivery);

module.exports = router;
