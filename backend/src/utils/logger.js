const { createLogger, format, transports } = require('winston');
const { LOG_LEVEL, NODE_ENV } = require('./constants');

const logger = createLogger({
    level: LOG_LEVEL,
    format: format.combine(
        format.timestamp(),
        NODE_ENV === 'development'
            ? format.colorize({ all: true })
            : format.uncolorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
            return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
    ),
    transports: [new transports.Console()]
});

module.exports = logger;