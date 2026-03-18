const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    icon: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    }
}, {
    tableName: 'categories',
    underscored: true,
    timestamps: true
});

module.exports = Category;
