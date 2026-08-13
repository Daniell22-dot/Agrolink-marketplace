const Redis = require('ioredis');
require('dotenv').config();

let useRedis = process.env.USE_REDIS !== 'false';
let redisClient = null;
let isConnected = false;

const memoryStore = new Map();

// A simple in-memory Redis fallback
const memoryRedis = {
    async get(key) {
        const item = memoryStore.get(key);
        if (!item) return null;
        if (item.expiry && Date.now() > item.expiry) {
            memoryStore.delete(key);
            return null;
        }
        return item.value;
    },
    async set(key, value, mode, duration) {
        let expiry = null;
        if (mode === 'EX' && duration) {
            expiry = Date.now() + duration * 1000;
        }
        memoryStore.set(key, { value, expiry });
        return 'OK';
    },
    async setex(key, seconds, value) {
        const expiry = Date.now() + seconds * 1000;
        memoryStore.set(key, { value, expiry });
        return 'OK';
    },
    async del(...keys) {
        let deleted = 0;
        const flatKeys = keys.flat();
        for (const key of flatKeys) {
            if (memoryStore.delete(key)) {
                deleted++;
            }
        }
        return deleted;
    },
    async keys(pattern) {
        const regexStr = '^' + pattern.replace(/\*/g, '.*') + '$';
        const regex = new RegExp(regexStr);
        const results = [];
        for (const key of memoryStore.keys()) {
            const item = memoryStore.get(key);
            if (item && item.expiry && Date.now() > item.expiry) {
                memoryStore.delete(key);
                continue;
            }
            if (regex.test(key)) {
                results.push(key);
            }
        }
        return results;
    },
    on(event, callback) {
        if (event === 'connect' && !useRedis) {
            setTimeout(() => callback(), 0);
        }
        return this;
    }
};

if (useRedis) {
    try {
        redisClient = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
            password: process.env.REDIS_PASSWORD || null,
            username: process.env.REDIS_USER_NAME || 'default',
            retryStrategy: (times) => {
                if (times > 3) {
                    console.warn('⚠️ Redis connection failed 3 times. Falling back to in-memory store.');
                    isConnected = false;
                    return null; // stop retrying
                }
                return Math.min(times * 100, 2000);
            },
            enableReadyCheck: false,
            enableOfflineQueue: true,
            maxRetriesPerRequest: 3 // Fail request quickly if redis is down
        });

        redisClient.on('connect', () => {
            console.log(' Redis connected');
            isConnected = true;
        });

        redisClient.on('error', (err) => {
            console.warn(' Redis error:', err.message);
        });
    } catch (err) {
        console.error('⚠️ Failed to initialize Redis client:', err.message);
        useRedis = false;
    }
}

const redisProxy = {
    async get(key) {
        if (useRedis && isConnected) {
            try {
                return await redisClient.get(key);
            } catch (err) {
                console.warn('Redis get failed, falling back to memory:', err.message);
            }
        }
        return await memoryRedis.get(key);
    },
    async set(key, value, ...args) {
        if (useRedis && isConnected) {
            try {
                return await redisClient.set(key, value, ...args);
            } catch (err) {
                console.warn('Redis set failed, falling back to memory:', err.message);
            }
        }
        return await memoryRedis.set(key, value, ...args);
    },
    async setex(key, seconds, value) {
        if (useRedis && isConnected) {
            try {
                return await redisClient.setex(key, seconds, value);
            } catch (err) {
                console.warn('Redis setex failed, falling back to memory:', err.message);
            }
        }
        return await memoryRedis.setex(key, seconds, value);
    },
    async del(...keys) {
        if (useRedis && isConnected) {
            try {
                return await redisClient.del(...keys);
            } catch (err) {
                console.warn('Redis del failed, falling back to memory:', err.message);
            }
        }
        return await memoryRedis.del(...keys);
    },
    async keys(pattern) {
        if (useRedis && isConnected) {
            try {
                return await redisClient.keys(pattern);
            } catch (err) {
                console.warn('Redis keys failed, falling back to memory:', err.message);
            }
        }
        return await memoryRedis.keys(pattern);
    },
    on(event, callback) {
        if (useRedis && redisClient) {
            redisClient.on(event, callback);
        } else {
            memoryRedis.on(event, callback);
        }
        return this;
    }
};

module.exports = redisProxy;


