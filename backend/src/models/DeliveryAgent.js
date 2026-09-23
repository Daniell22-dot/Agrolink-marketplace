const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliveryAgent = sequelize.define('DeliveryAgent', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    vehicleType: {
        type: DataTypes.ENUM('motorcycle', 'bicycle', 'van', 'truck', 'foot'),
        allowNull: false,
        defaultValue: 'motorcycle'
    },
    licensePlate: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('available', 'busy', 'offline'),
        allowNull: false,
        defaultValue: 'offline'
    },
    currentLocation: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 5.0
    },
    totalDeliveries: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    }
}, {
    tableName: 'delivery_agents',
    underscored: true,
    timestamps: true
});

module.exports = DeliveryAgent;
