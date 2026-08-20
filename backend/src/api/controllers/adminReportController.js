const Report = require('../../models/Report');
const User = require('../../models/User');
const Product = require('../../models/Product');

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getAllReports = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, type, status, search } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (type) where.type = type;
        if (status) where.status = status;
        if (search) {
            const { Op } = require('sequelize');
            where[Op.or] = [
                { reason: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Report.findAndCountAll({
            where,
            include: [
                { model: User, as: 'Reporter', attributes: ['id', 'fullName', 'email'] },
                { model: Product, as: 'ReportedProduct', attributes: ['id', 'name', 'price'] },
                { model: User, as: 'ReportedUser', attributes: ['id', 'fullName', 'email'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            reports: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get report detail
// @route   GET /api/admin/reports/:id
// @access  Private/Admin
exports.getReportDetail = async (req, res, next) => {
    try {
        const report = await Report.findByPk(req.params.id, {
            include: [
                { model: User, as: 'Reporter', attributes: ['id', 'fullName', 'email'] },
                { model: Product, as: 'ReportedProduct', attributes: ['id', 'name', 'price', 'description'] },
                { model: User, as: 'ReportedUser', attributes: ['id', 'fullName', 'email'] }
            ]
        });

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        res.json({ success: true, data: report });
    } catch (error) {
        next(error);
    }
};

// @desc    Resolve report
// @route   PUT /api/admin/reports/:id/resolve
// @access  Private/Admin
exports.resolveReport = async (req, res, next) => {
    try {
        const { action, reason } = req.body;
        const report = await Report.findByPk(req.params.id);

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        report.status = 'resolved';
        report.adminNotes = `Action: ${action}. Reason: ${reason}`;
        report.resolvedBy = req.user.id;
        report.resolvedAt = new Date();
        await report.save();

        // Take action on reported entity
        if (action === 'suspend' || action === 'ban') {
            if (report.reportedUserId) {
                const user = await User.findByPk(report.reportedUserId);
                if (user) {
                    user.status = action === 'ban' ? 'banned' : 'suspended';
                    await user.save();
                }
            }
        }
        if (action === 'delete') {
            if (report.reportedProductId) {
                const product = await Product.findByPk(report.reportedProductId);
                if (product) {
                    product.isAvailable = false;
                    await product.save();
                }
            }
        }

        res.json({ success: true, data: report });
    } catch (error) {
        next(error);
    }
};

// @desc    Dismiss report
// @route   PUT /api/admin/reports/:id/dismiss
// @access  Private/Admin
exports.dismissReport = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const report = await Report.findByPk(req.params.id);

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        report.status = 'dismissed';
        report.adminNotes = reason || 'Dismissed by admin';
        report.resolvedBy = req.user.id;
        report.resolvedAt = new Date();
        await report.save();

        res.json({ success: true, data: report });
    } catch (error) {
        next(error);
    }
};
