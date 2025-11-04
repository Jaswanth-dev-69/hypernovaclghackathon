const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

// ============================================
// PROMETHEUS/GRAFANA DISABLED - Using Google Sheets instead
// ============================================
// const { metricsMiddleware } = require('./middleware/metricsExporter');
// const metricsRoutes = require('./routes/metricsRoutes');

// Google Sheets Logger
const sheetsLogger = require('./utils/googleSheetsLogger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Request logging
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ============================================
// PROMETHEUS METRICS MIDDLEWARE DISABLED
// ============================================
// app.use(metricsMiddleware);

// Google Sheets logging middleware
app.use(async (req, res, next) => {
  const start = Date.now();
  res.on('finish', async () => {
    const duration = (Date.now() - start) / 1000;
    const userId = req.user?.id || 'anonymous';
    await sheetsLogger.logRequest(req.method, req.path, res.statusCode, duration, userId);
  });
  next();
});

// Health check endpoint (for Render and monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    logging: sheetsLogger.initialized ? 'Google Sheets' : 'Console Only'
  });
});

// ============================================
// PROMETHEUS METRICS ENDPOINT DISABLED
// ============================================
// app.use('/metrics', metricsRoutes);

// API Routes
app.use('/api/auth', authRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize Google Sheets Logger
sheetsLogger.initialize().then((success) => {
  if (success) {
    console.log('📊 Google Sheets logging enabled');
  } else {
    console.log('⚠️  Google Sheets logging disabled - using console only');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // console.log(`� Metrics available at http://localhost:${PORT}/metrics`); // DISABLED
  console.log(`💊 Health check at http://localhost:${PORT}/health`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔐 Supabase URL: ${process.env.SUPABASE_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📊 Logging: Google Sheets ${sheetsLogger.initialized ? 'ENABLED' : 'DISABLED'}`);
});

module.exports = app;
