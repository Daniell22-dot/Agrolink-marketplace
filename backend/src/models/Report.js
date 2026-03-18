const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reporterId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reportedUserId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    reportedProductId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('user', 'product', 'order', 'other'),
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'investigating', 'resolved', 'dismissed'),
        allowNull: true,
        defaultValue: 'pending'
    },
    adminNotes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resolvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'reports',
    underscored: true,
    timestamps: true
});

module.exports = Report;
