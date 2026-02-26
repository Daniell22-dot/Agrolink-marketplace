const redis = require('../config/redis');

// Cache middleware
exports.cache = (duration = 300) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl}`;

        try {
            const cachedData = await redis.get(key);

            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }

            // Store original res.json
            const originalJson = res.json.bind(res);

            // Override res.json
            res.json = (data) => {
                // Cache the response
                redis.setex(key, duration, JSON.stringify(data));
                return originalJson(data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

// Clear cache by pattern
exports.clearCache = async (pattern = '*') => {
    try {
        const keys = await redis.keys(`cache:${pattern}`);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        return keys.length;
    } catch (error) {
        console.error('Clear cache error:', error);
        return 0;
    }
};

// Cache specific key
exports.cacheData = async (key, data, duration = 300) => {
    try {
        await redis.setex(`cache:${key}`, duration, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Cache data error:', error);
        return false;
    }
};

// Get cached data
exports.getCachedData = async (key) => {
    try {
        const data = await redis.get(`cache:${key}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Get cached data error:', error);
        return null;
    }
};

module.exports = exports;
