const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body Parser & Cookie Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./src/api/routes/authRoutes'));
app.use('/api/users', require('./src/api/routes/userRoutes'));
app.use('/api/products', require('./src/api/routes/productRoutes'));
app.use('/api/orders', require('./src/api/routes/orderRoutes'));
app.use('/api/admin', require('./src/api/routes/adminRoutes'));
app.use('/api/cart', require('./src/api/routes/cartRoutes'));
app.use('/api/chat', require('./src/api/routes/chatRoutes'));
app.use('/api/reviews', require('./src/api/routes/reviewRoutes'));
app.use('/api/notifications', require('./src/api/routes/notificationRoutes'));
app.use('/api/payments', require('./src/api/routes/paymentRoutes'));
app.use('/api/webhooks', require('./src/api/routes/webhookRoutes'));

// Error Middleware
app.use(require('./src/api/middleware/errorMiddleware'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;
