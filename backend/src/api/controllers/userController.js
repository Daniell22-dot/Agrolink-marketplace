const User = require('../../models/User');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'agrolink/avatars' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            if (req.body.fullName !== undefined) user.fullName = req.body.fullName;
            if (req.body.email !== undefined) user.email = req.body.email;
            if (req.body.phone !== undefined) user.phone = req.body.phone;
            if (req.body.location !== undefined) user.location = req.body.location;
            if (req.body.county !== undefined) user.county = req.body.county;

            if (req.file) {
                user.avatar = await uploadToCloudinary(req.file.buffer);
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                data: {
                    id: updatedUser.id,
                    fullName: updatedUser.fullName,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    role: updatedUser.role,
                    avatar: updatedUser.avatar,
                    location: updatedUser.location,
                    county: updatedUser.county
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my products (farmers only)
// @route   GET /api/users/my-products
// @access  Private
exports.getMyProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll({
            where: { farmerId: req.user.id }
        });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my orders
// @route   GET /api/users/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

