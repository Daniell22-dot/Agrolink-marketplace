const crypto = require('crypto');
const SecurityInvite = require('../../models/SecurityInvite');
const User = require('../../models/User');
const { securityEvents, CATEGORIES } = require('../../services/securityEventService');

// @desc    Generate a single-use, time-bound security auditor invitation
// @route   POST /api/admin/security/invites
// @access  Private / SUPER_ADMIN (2FA required)
exports.createInvite = async (req, res, next) => {
    try {
        const { email, expiresInHours } = req.body;
        const token = crypto.randomBytes(24).toString('hex');
        const ttlHours = parseInt(expiresInHours) > 0 ? parseInt(expiresInHours) : 24;
        const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

        const invite = await SecurityInvite.create({
            token,
            email: email ? String(email).toLowerCase().trim() : null,
            role: 'security_auditor',
            createdBy: req.user.id,
            expiresAt
        });

        res.status(201).json({
            success: true,
            message: 'Security auditor invitation generated',
            data: {
                id: invite.id,
                token,
                email: invite.email,
                role: invite.role,
                expiresAt: invite.expiresAt,
                status: invite.status
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    List all security invitations
// @route   GET /api/admin/security/invites
// @access  Private / SUPER_ADMIN (2FA required)
exports.listInvites = async (req, res, next) => {
    try {
        const invites = await SecurityInvite.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'inviter', attributes: ['id', 'fullName', 'email'] },
                { model: User, as: 'acceptor', attributes: ['id', 'fullName', 'email'] }
            ]
        });

        res.json({
            success: true,
            count: invites.length,
            data: invites
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Redeem an invitation token (grants SECURITY_AUDITOR role)
// @route   POST /api/admin/security/invites/accept
// @access  Private (any authenticated user redeeming a valid token)
exports.acceptInvite = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Invitation token is required' });
        }

        const invite = await SecurityInvite.findOne({ where: { token } });
        if (!invite) {
            return res.status(400).json({ message: 'Invalid invitation token' });
        }

        if (invite.status === 'accepted') {
            return res.status(400).json({ message: 'Invitation already used' });
        }
        if (invite.status === 'revoked') {
            return res.status(400).json({ message: 'Invitation has been revoked' });
        }

        if (invite.expiresAt < new Date()) {
            invite.status = 'expired';
            await invite.save();
            return res.status(400).json({ message: 'Invitation has expired' });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (invite.email && invite.email !== user.email.toLowerCase()) {
            return res.status(403).json({ message: 'This invitation is not valid for your account' });
        }

        user.role = invite.role;
        await user.save();

        invite.status = 'accepted';
        invite.acceptedBy = user.id;
        invite.acceptedAt = new Date();
        await invite.save();

        securityEvents.record(CATEGORIES.SECURITY_ACCESS, {
            ip: req.ip || req.connection?.remoteAddress || 'unknown',
            action: 'security_auditor_granted',
            email: user.email,
            grantedBy: invite.createdBy,
            userAgent: req.get('User-Agent'),
        });

        res.json({
            success: true,
            message: 'Security auditor access granted. Please enable 2FA to access the security dashboard.',
            data: { role: user.role }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Revoke an invitation
// @route   POST /api/admin/security/invites/:id/revoke
// @access  Private / SUPER_ADMIN (2FA required)
exports.revokeInvite = async (req, res, next) => {
    try {
        const invite = await SecurityInvite.findByPk(req.params.id);
        if (!invite) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        if (invite.status === 'accepted') {
            return res.status(400).json({ message: 'Cannot revoke an already accepted invitation' });
        }

        invite.status = 'revoked';
        await invite.save();

        res.json({
            success: true,
            message: 'Invitation revoked successfully',
            data: invite
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user's security dashboard access status
// @route   GET /api/admin/security/status
// @access  Private
exports.getMySecurityStatus = async (req, res, next) => {
    try {
        const hasSecurityAccess = ['super_admin', 'security_auditor'].includes(req.user.role);

        res.json({
            success: true,
            data: {
                role: req.user.role,
                twoFaEnabled: !!req.user.twoFaEnabled,
                hasSecurityAccess,
                requires2FA: true
            }
        });
    } catch (error) {
        next(error);
    }
};
