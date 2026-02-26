const logger = require('./logger');

function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function pick(obj = {}, keys = []) {
    return keys.reduce((acc, k) => {
        if (Object.prototype.hasOwnProperty.call(obj, k)) acc[k] = obj[k];
        return acc;
    }, {});
}

function sendResponse(res, statusCode = 200, data = null, message = 'ok') {
    return res.status(statusCode).json({ status: statusCode, message, data });
}

function safeParseJSON(str, fallback = null) {
    try {
        return JSON.parse(str);
    } catch (err) {
        logger.debug('safeParseJSON failed', err);
        return fallback;
    }
}

module.exports = {
    isValidEmail,
    pick,
    sendResponse,
    safeParseJSON
};