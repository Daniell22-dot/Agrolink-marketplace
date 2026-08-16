const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'reviews',
    underscored: true,
    timestamps: true
});

// Associations
Review.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Product.hasMany(Review, { foreignKey: 'productId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Review;
