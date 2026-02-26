// Role-based middleware (Similar to RBAC but simpler)
exports.checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }

        next();
    };
};

// Specific role checks
exports.isFarmer = (req, res, next) => {
    if (req.user.role !== 'farmer') {
        return res.status(403).json({ message: 'Access restricted to farmers only' });
    }
    next();
};

exports.isBuyer = (req, res, next) => {
    if (req.user.role !== 'buyer') {
        return res.status(403).json({ message: 'Access restricted to buyers only' });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};
