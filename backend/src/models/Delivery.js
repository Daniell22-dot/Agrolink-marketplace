const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');
const DeliveryAgent = require('./DeliveryAgent');

const Delivery = sequelize.define('Delivery', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    agentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
    },
    pickupAddress: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    deliveryAddress: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    deliveryPhone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    deliveryInstructions: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estimatedPickupTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    estimatedDeliveryTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    pickedUpAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    proofOfDelivery: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    deliveryFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    recipientName: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    recipientSignature: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
}, {
    tableName: 'deliveries',
    underscored: true,
    timestamps: true
});

// Associations
Delivery.belongsTo(Order, { foreignKey: 'orderId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Delivery.belongsTo(DeliveryAgent, { foreignKey: 'agentId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Order.hasOne(Delivery, { foreignKey: 'orderId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Delivery;
