const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const SecurityInvite = sequelize.define('SecurityInvite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('security_auditor'),
        allowNull: false,
        defaultValue: 'security_auditor'
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'revoked', 'expired'),
        allowNull: false,
        defaultValue: 'pending'
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'created_by'
    },
    acceptedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'accepted_by'
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
    },
    acceptedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'accepted_at'
    }
}, {
    underscored: true,
    timestamps: true
});

SecurityInvite.belongsTo(User, { foreignKey: 'createdBy', as: 'inviter', targetKey: 'id' });
User.hasMany(SecurityInvite, { foreignKey: 'createdBy', as: 'securityInvitesCreated' });

SecurityInvite.belongsTo(User, { foreignKey: 'acceptedBy', as: 'acceptor', targetKey: 'id' });

module.exports = SecurityInvite;
