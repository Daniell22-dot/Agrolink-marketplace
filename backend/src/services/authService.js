const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const { sendEmail } = require('./emailService');

// Generate JWT Access Token
exports.generateAccessToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Generate Refresh Token
exports.generateRefreshToken = async (userId) => {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
        userId,
        token,
        expiresAt
    });

    return token;
};

// Verify Refresh Token
exports.verifyRefreshToken = async (token) => {
    const refreshToken = await RefreshToken.findOne({
        where: { token },
        include: [{ model: User }]
    });

    if (!refreshToken) {
        throw new Error('Invalid refresh token');
    }

    if (new Date() > refreshToken.expiresAt) {
        await refreshToken.destroy();
        throw new Error('Refresh token expired');
    }

    return refreshToken.User;
};

// Hash Password
exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Compare Password
exports.comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generate 2FA Secret
exports.generate2FASecret = (email) => {
    return speakeasy.generateSecret({
        name: `AgroLink (${email})`,
        length: 32
    });
};

// Verify 2FA Token
exports.verify2FAToken = (secret, token) => {
    return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 2
    });
};

// Send Verification Email
exports.sendVerificationEmail = async (user, verificationToken) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
        email: user.email,
        template: 'welcome',
        data: { name: user.name, verificationUrl }
    });
};

module.exports = exports;
