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
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
app.use('/api/orders', require('./api/routes/orderRoutes'));
app.use('/api/admin', require('./api/routes/adminRoutes'));
app.use('/api/cart', require('./api/routes/cartRoutes'));
app.use('/api/chat', require('./api/routes/chatRoutes'));
app.use('/api/reviews', require('./api/routes/reviewRoutes'));
app.use('/api/notifications', require('./api/routes/notificationRoutes'));
app.use('/api/payments', require('./api/routes/paymentRoutes'));
app.use('/api/webhooks', require('./api/routes/webhookRoutes'));

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
