const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    method: {
        type: DataTypes.ENUM('mpesa', 'card', 'bank_transfer'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
    },
    checkoutRequestId: {
        type: DataTypes.STRING
    },
    merchantRequestId: {
        type: DataTypes.STRING
    },
    mpesaReceiptNumber: {
        type: DataTypes.STRING
    },
    phoneNumber: {
        type: DataTypes.STRING
    },
    metadata: {
        type: DataTypes.JSON
    }
}, {
    underscored: true,
    timestamps: true
});

module.exports = Payment;
