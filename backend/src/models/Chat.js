const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    farmerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    lastMessage: {
        type: DataTypes.TEXT
    },
    lastMessageAt: {
        type: DataTypes.DATE
    },
    unreadCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    underscored: true,
    timestamps: true
});

// Associations
Chat.belongsTo(User, { as: 'Buyer', foreignKey: 'buyerId' });
Chat.belongsTo(User, { as: 'Farmer', foreignKey: 'farmerId' });
Chat.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Chat;
