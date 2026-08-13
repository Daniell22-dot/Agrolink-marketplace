const sequelize = require('../../config/database');
const redisClient = require('../../config/redis');
const { securityEvents } = require('../../services/securityEventService');

/**
 * @desc    Get public health status of all services
 * @route   GET /api/status/health
 * @access  Public
 */
exports.getHealthStatus = async (req, res) => {
  const services = [];
  const startAll = Date.now();

  // 1. API — Always operational if we reached this handler
  services.push({
    name: 'API Gateway',
    slug: 'api',
    status: 'operational',
    latencyMs: 0,
    description: 'Express API server & proxy services',
  });

  // 2. Database (MySQL via Sequelize)
  try {
    const dbStart = Date.now();
    await sequelize.authenticate();
    services.push({
      name: 'MySQL Database',
      slug: 'database',
      status: 'operational',
      latencyMs: Date.now() - dbStart,
      description: 'Primary relational data store',
    });
  } catch (err) {
    services.push({
      name: 'MySQL Database',
      slug: 'database',
      status: 'down',
      latencyMs: null,
      description: 'Primary relational data store',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // 3. Redis Cache
  try {
    const redisStart = Date.now();
    const pong = await redisClient.get('__health_check_ping__');
    // If we get here without error, Redis (or fallback) is working
    services.push({
      name: 'Redis Cache',
      slug: 'redis',
      status: 'operational',
      latencyMs: Date.now() - redisStart,
      description: 'Session cache & cart storage',
    });
  } catch (err) {
    services.push({
      name: 'Redis Cache',
      slug: 'redis',
      status: 'degraded',
      latencyMs: null,
      description: 'Session cache & cart storage (in-memory fallback active)',
    });
  }

  // 4. M-Pesa Payment Gateway — Check config availability
  const mpesaConfigured = !!(process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET);
  services.push({
    name: 'M-Pesa Gateway',
    slug: 'mpesa',
    status: mpesaConfigured ? 'operational' : 'degraded',
    latencyMs: null,
    description: 'Safaricom STK Push payment integration',
  });

  // 5. CDN (Cloudinary) — Check config availability
  const cloudinaryConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY);
  services.push({
    name: 'CDN & Media',
    slug: 'cdn',
    status: cloudinaryConfigured ? 'operational' : 'degraded',
    latencyMs: null,
    description: 'Cloudinary image & media delivery',
  });

  // Overall status
  const hasDown = services.some(s => s.status === 'down');
  const hasDegraded = services.some(s => s.status === 'degraded');
  const overallStatus = hasDown ? 'major_outage' : hasDegraded ? 'partial_outage' : 'all_operational';

  res.json({
    success: true,
    status: overallStatus,
    totalLatencyMs: Date.now() - startAll,
    checkedAt: new Date().toISOString(),
    uptime: process.uptime(),
    services,
  });
};

/**
 * @desc    Get security event metrics (admin only)
 * @route   GET /api/status/security
 * @access  Private/Admin
 */
exports.getSecurityMetrics = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const metrics = securityEvents.getMetrics(hours);
    const timeSeries = securityEvents.getTimeSeries(hours);
    const activeLockouts = securityEvents.getActiveLockouts();
    const recentEvents = securityEvents.getRecentEvents(
      parseInt(req.query.limit) || 50,
      parseInt(req.query.offset) || 0,
      req.query.category || null
    );

    res.json({
      success: true,
      data: {
        metrics,
        timeSeries,
        activeLockouts,
        recentEvents,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve security metrics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
