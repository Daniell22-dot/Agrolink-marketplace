const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');
const sequelize = require('./src/config/database');

// Load env vars
dotenv.config();

// Import app
const app = require('./src/app');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io available in routes
app.set('io', io);

// Initialize Socket handlers
require('./src/sockets/chatSocket')(io);

// Additional route mounting (if not in app.js)
app.use('/api/payments', require('./src/api/routes/paymentRoutes'));
app.use('/api/webhooks', require('./src/api/routes/webhookRoutes'));

// Database connection and sync
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(' MySQL Connected');

    // Sync database (creates tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false }); // Set to true to update tables
      console.log(' Database synced');
    }

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error(' Unable to start server:', error);
    process.exit(1);
  }
};

// Start cron jobs
try {
  require('./src/jobs/orderCleanup');
  console.log(' Cron jobs initialized');
} catch (error) {
  console.warn(' Cron jobs failed to initialize:', error.message);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

startServer();