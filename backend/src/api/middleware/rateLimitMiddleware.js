const rateLimit = require('express-rate-limit');
const { securityEvents, CATEGORIES } = require('../../services/securityEventService');

// General API rate limiter
exports.apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: process.env.NODE_ENV === 'development' ? 50000 : 10000,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    // Skip common “browse” GETs to avoid throttling normal pagination/search.
    skip: (req) => {
        if (process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1') return true;
        if (req.method === 'GET' && (
            req.originalUrl.startsWith('/api/products') ||
            req.originalUrl.startsWith('/api/categories')
        )) return true;
        return false;
    },
    handler: (req, res) => {
        securityEvents.record(CATEGORIES.RATE_LIMIT, {
            ip: req.ip || req.connection?.remoteAddress || 'unknown',
            route: req.originalUrl,
            method: req.method,
            limiter: 'api',
            userAgent: req.get('User-Agent'),
        });
        res.status(429).json({ message: 'Too many requests from this IP, please try again later.' });
    }
});



// Strict limiter for authentication routes
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: false,
    handler: (req, res) => {
        securityEvents.record(CATEGORIES.RATE_LIMIT, {
            ip: req.ip || req.connection?.remoteAddress || 'unknown',
            route: req.originalUrl,
            method: req.method,
            limiter: 'auth',
            userAgent: req.get('User-Agent'),
        });
        res.status(429).json({ message: 'Too many authentication attempts, please try again later.' });
    }
});

// Login specific limiter (stricter)
exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again after 15 minutes.',
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (req, res) => {
        securityEvents.record(CATEGORIES.RATE_LIMIT, {
            ip: req.ip || req.connection?.remoteAddress || 'unknown',
            route: req.originalUrl,
            method: req.method,
            limiter: 'login',
            userAgent: req.get('User-Agent'),
        });
        res.status(429).json({ message: 'Too many login attempts, please try again after 15 minutes.' });
    }
});

// Create limiter (for resource creation)
exports.createLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 creates per minute
    message: 'Too many items created, please slow down.',
});

// File upload limiter
exports.uploadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 uploads per minute
    message: 'Too many file uploads, please wait before uploading more.',
});

module.exports = exports;
