const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    paymentMethod: {
        type: DataTypes.ENUM('mpesa', 'card', 'escrow'),
        allowNull: false
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
    },
    shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactPhone: {
        type: DataTypes.STRING
    }
}, {
    underscored: true,
    timestamps: true
});

module.exports = Order;
