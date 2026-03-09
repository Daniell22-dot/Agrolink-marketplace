const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

// Create Escrow Transaction
exports.createEscrow = async (orderId, userId, amount) => {
    const transaction = await Transaction.create({
        orderId,
        userId,
        amount,
        paymentMethod: 'escrow',
        status: 'pending',
        metadata: {
            escrowStatus: 'held',
            releaseCondition: 'delivery_confirmed'
        }
    });

    return transaction;
};

// Release Escrow Funds
exports.releaseEscrow = async (transactionId) => {
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction || transaction.paymentMethod !== 'escrow') {
        throw new Error('Invalid escrow transaction');
    }

    if (transaction.status !== 'pending') {
        throw new Error('Escrow already released or refunded');
    }

    const order = await Order.findByPk(transaction.orderId);

    if (order.status !== 'delivered') {
        throw new Error('Cannot release escrow before delivery confirmation');
    }

    transaction.status = 'completed';
    transaction.metadata = {
        ...transaction.metadata,
        escrowStatus: 'released',
        releasedAt: new Date()
    };
    await transaction.save();

    return transaction;
};

// Refund Escrow
exports.refundEscrow = async (transactionId, reason) => {
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction || transaction.paymentMethod !== 'escrow') {
        throw new Error('Invalid escrow transaction');
    }

    transaction.status = 'refunded';
    transaction.metadata = {
        ...transaction.metadata,
        escrowStatus: 'refunded',
        refundReason: reason,
        refundedAt: new Date()
    };
    await transaction.save();

    return transaction;
};

module.exports = exports;