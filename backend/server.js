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
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      process.env.ADMIN_URL || 'http://localhost:3001',
      /\.vercel\.app$/
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io available in routes
app.set('io', io);

// Initialize Socket handlers
try {
  require('./src/sockets/chatSocket')(io);
} catch (err) {
  console.warn('Socket handlers not loaded:', err.message);
}

// Database connection and sync
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected');

    // Sync database — creates new tables automatically in ALL environments
    // alter: true adds new columns/tables without dropping existing ones
    await sequelize.sync({ alter: true });
    console.log('Database synced (new tables auto-created)');

    // Seed Super Admin (runs idempotently — safe for production)
    try {
      const seedSuperAdmin = require('./src/seeds/superAdmin');
      await seedSuperAdmin();
    } catch (seedErr) {
      console.warn('Super admin seed skipped:', seedErr.message);
    }

    // Only start HTTP listener in local dev (Vercel handles requests as serverless)
    if (!process.env.VERCEL) {
      const PORT = process.env.PORT || 5000;
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    }

  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

// Start cron jobs
try {
  require('./src/jobs/orderCleanup');
  console.log(' Cron jobs initialized');
} catch (error) {
  console.warn(' Cron jobs failed to initialize:', error.message);
}

startServer();

module.exports = app;