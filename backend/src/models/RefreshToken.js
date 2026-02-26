const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const RefreshToken = sequelize.define('RefreshToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

RefreshToken.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id'
});
User.hasMany(RefreshToken, {
    foreignKey: 'userId',
    sourceKey: 'id'
});

RefreshToken.createToken = async function (user) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + process.env.JWT_REFRESH_EXPIRATION);

    const _token = require('uuid').v4();

    let refreshToken = await this.create({
        token: _token,
        userId: user.id,
        expiryDate: expiredAt.getTime(),
    });

    return refreshToken.token;
};

RefreshToken.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
};

module.exports = RefreshToken;
