const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserInteraction = sequelize.define('UserInteraction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' }
    },
    interaction_type: {
        type: DataTypes.ENUM('view', 'purchase', 'cart_add', 'search', 'wishlist'),
        allowNull: false
    },
    metadata: {
        type: DataTypes.JSON,
        defaultValue: null
    }
}, {
    tableName: 'user_interactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        { fields: ['user_id', 'interaction_type'] },
        { fields: ['product_id', 'interaction_type'] },
        { fields: ['created_at'] },
        { fields: ['user_id', 'product_id'] }
    ]
});

module.exports = UserInteraction;
