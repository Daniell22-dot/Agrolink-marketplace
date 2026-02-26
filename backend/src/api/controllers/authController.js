const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const RefreshToken = require('../../models/RefreshToken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const otplib = require('otplib');
const qrcode = require('qrcode');

// Generate JWT Access Token
const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m'
  });
};

// @desc    Register user
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      nationalId,
      username,
      fullName,
      name,
      email,
      phone,
      password,
      role,
      location,
      latitude,
      longitude,
      county,
      subCounty
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email },
          { phone },
          { nationalId },
          { username }
        ]
      }
    });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists with this email, phone, national ID, or username'
      });
    }

    // Create user
    const user = await User.create({
      nationalId,
      username,
      fullName,
      name: fullName, // Set name to fullName for compatibility
      email,
      phone,
      password,
      role,
      location,
      latitude,
      longitude,
      county,
      subCounty,
      twoFactorEnabled: false,
      loginAttempts: 0
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = await RefreshToken.createToken(user);

    res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        nationalId: user.nationalId,
        username: user.username,
        fullName: user.fullName,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        county: user.county,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check for Account Lock
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        message: `Account locked. Try again later.`
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes lock
        user.loginAttempts = 0; // Reset attempts after locking
        await user.save();
        return res.status(403).json({ message: 'Account locked due to too many failed attempts' });
      }
      await user.save();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on success
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Check 2FA
    if (user.twoFactorEnabled) {
      return res.json({
        success: true,
        twoFactorRequired: true,
        userId: user.id
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = await RefreshToken.createToken(user);

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Token
exports.refreshToken = async (req, res, next) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: 'Refresh Token is required!' });
  }

  try {
    const refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token is not in database!' });
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      return res.status(403).json({
        message: 'Refresh token was expired. Please make a new signin request',
      });
    }

    const user = await User.findByPk(refreshToken.userId);
    const newAccessToken = generateAccessToken(user.id, user.role);

    return res.json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Enable 2FA Step 1: Generate Secret
exports.enable2FA = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const secret = otplib.authenticator.generateSecret();

    user.twoFactorSecret = secret;
    await user.save();

    const otpauth = otplib.authenticator.keyuri(user.email, 'AgroLink', secret);

    qrcode.toDataURL(otpauth, (err, imageUrl) => {
      if (err) {
        return res.status(500).json({ message: 'Error generating QR code' });
      }
      res.json({
        success: true,
        secret,
        qrCode: imageUrl
      });
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify 2FA Token (For Enabling or Login)
exports.verify2FA = async (req, res, next) => {
  try {
    const { token, userId } = req.body; // userId needed if verifying during login

    // Determine user context (Logged in vs Login flow)
    let user;
    if (req.user) {
      user = await User.findByPk(req.user.id);
    } else if (userId) {
      user = await User.findByPk(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValid = otplib.authenticator.check(token, user.twoFactorSecret);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    // IF enabling 2FA
    if (req.user && !user.twoFactorEnabled) {
      user.twoFactorEnabled = true;
      await user.save();
      return res.json({ success: true, message: '2FA Enabled Successfully' });
    }

    // IF Logging in
    if (!req.user) {
      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = await RefreshToken.createToken(user);

      return res.json({
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled
        }
      });
    }

    res.json({ success: true, message: 'Token verified' });

  } catch (error) {
    next(error);
  }
};

// @desc    Disable 2FA
exports.disable2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findByPk(req.user.id);

    const isValid = otplib.authenticator.check(token, user.twoFactorSecret);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    res.json({ success: true, message: '2FA Disabled' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'twoFactorSecret'] }
    });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};