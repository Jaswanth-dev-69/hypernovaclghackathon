const express = require('express');
const { register, metrics } = require('../middleware/metricsExporter');

const router = express.Router();

// Main Prometheus metrics endpoint for scraping
router.get('/', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).end(error);
  }
});

// Endpoint to accept metrics from frontend (telemetry)
router.post('/emit', (req, res) => {
  try {
    const { 
      route = '/', 
      method = 'GET', 
      status = '200', 
      duration, 
      type, 
      reason, 
      env = process.env.NODE_ENV || 'development',
      page,
      endpoint
    } = req.body || {};

    // Track HTTP requests from frontend
    if (route && method && status) {
      metrics.httpRequestTotal.inc({ method, route, status_code: status, env }, 1);
      
      if (typeof duration === 'number') {
        metrics.httpRequestDuration.observe(
          { method, route, status_code: status, env }, 
          duration
        );
      }
    }

    // Track login failures
    if (type === 'login_failure') {
      metrics.loginFailures.inc({ reason: reason || 'unknown', env }, 1);
      metrics.authAttempts.inc({ status: 'failure', type: 'login', env }, 1);
    }

    // Track page views
    if (page) {
      metrics.pageViews.inc({ page, env }, 1);
    }

    // Track API call duration from frontend
    if (endpoint && typeof duration === 'number') {
      metrics.apiCallDuration.observe(
        { endpoint, status: status || '200', env }, 
        duration
      );
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Error processing metrics:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Health check with detailed metrics
router.get('/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`
    },
    cpu: {
      user: `${(cpuUsage.user / 1000000).toFixed(2)} seconds`,
      system: `${(cpuUsage.system / 1000000).toFixed(2)} seconds`
    },
    nodeVersion: process.version,
    platform: process.platform,
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
