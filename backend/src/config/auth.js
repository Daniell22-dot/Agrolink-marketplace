const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT Token Expiration times
const JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
const JWT_REFRESH_EXPIRATION = parseInt(process.env.JWT_REFRESH_EXPIRATION || '604800'); // 7 days in seconds

// Generate Access Token
exports.generateAccessToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRE
    });
};

// Generate Refresh Token (stored in DB)
exports.generateRefreshToken = () => {
    return require('uuid').v4();
};

// Verify Token
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Send Token Response (Cookie + JSON)
exports.sendTokenResponse = (user, statusCode, res, accessToken, refreshToken) => {
    // Cookie options
    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        sameSite: 'strict'
    };

    res
        .status(statusCode)
        .cookie('token', accessToken, options)
        .json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};

module.exports = exports;
