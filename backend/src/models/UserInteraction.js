const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserInteraction = sequelize.define('UserInteraction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' }
    },
    interactionType: {
        type: DataTypes.ENUM('view', 'purchase', 'cart_add', 'search', 'wishlist'),
        allowNull: false
    },
    metadata: {
        type: DataTypes.JSON,
        defaultValue: null
    }
}, {
    tableName: 'user_interactions',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [
        { fields: ['userId', 'interactionType'] },
        { fields: ['productId', 'interactionType'] },
        { fields: ['createdAt'] },
        { fields: ['userId', 'productId'] }
    ]
});

module.exports = UserInteraction;
