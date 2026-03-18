const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
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
    paymentMethod: {
        type: DataTypes.ENUM('mpesa', 'card', 'escrow'),
        allowNull: false
    },
    transactionId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    mpesaReceiptNumber: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        allowNull: true,
        defaultValue: 'pending'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'transactions',
    underscored: true,
    timestamps: true,
    updatedAt: false
});

module.exports = Transaction;
