exports.checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role ${req.user.role} is not authorized to access this route`
            });
        }

        next();
    };
};

// Enforce mandatory 2FA (TOTP) before granting access to restricted resources
exports.require2FA = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    if (!req.user.twoFaEnabled || !req.user.twoFaSecret) {
        return res.status(403).json({
            message: 'Two-Factor Authentication (2FA) must be enabled to access this resource'
        });
    }

    next();
};
