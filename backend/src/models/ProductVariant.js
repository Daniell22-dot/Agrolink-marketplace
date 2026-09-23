const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductVariant = sequelize.define('ProductVariant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    value: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    priceDelta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    stockQty: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    sku: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'product_variants',
    underscored: true,
    timestamps: true
});

module.exports = ProductVariant;
