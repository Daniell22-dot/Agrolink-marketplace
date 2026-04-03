const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());

const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(xss());
app.use(hpp());

// Body Parser & Cookie Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import rate limiters
const { apiLimiter } = require('./api/middleware/rateLimitMiddleware');
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', require('./api/routes/authRoutes'));
app.use('/api/users', require('./api/routes/userRoutes'));
app.use('/api/products', require('./api/routes/productRoutes'));
app.use('/api/categories', require('./api/routes/categoryRoutes'));
app.use('/api/orders', require('./api/routes/orderRoutes'));
app.use('/api/admin', require('./api/routes/adminRoutes'));
app.use('/api/cart', require('./api/routes/cartRoutes'));
app.use('/api/chat', require('./api/routes/chatRoutes'));
app.use('/api/reviews', require('./api/routes/reviewRoutes'));
app.use('/api/notifications', require('./api/routes/notificationRoutes'));
app.use('/api/recommendations', require('./api/routes/recommendationRoutes'));
app.use('/api/payments', require('./api/routes/paymentRoutes'));
app.use('/api/webhooks', require('./api/routes/webhookRoutes'));
app.use('/api/analytics', require('./api/routes/analyticsRoutes'));
app.use('/api/pricing', require('./api/routes/pricingRoutes'));
app.use('/api/images', require('./api/routes/imageRoutes'));

// Error Middleware (must be last)
app.use(require('./api/middleware/errorMiddleware'));

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;
