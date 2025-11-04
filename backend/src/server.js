const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

// ============================================
// DUAL MONITORING: Prometheus + Google Sheets
// ============================================
const { metricsMiddleware } = require('./middleware/metricsExporter');
const metricsRoutes = require('./routes/metricsRoutes');

// Google Sheets Logger (for IBM Data Prep Kit)
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
// DUAL MONITORING: Prometheus + Google Sheets
// ============================================
// Prometheus metrics middleware (for real-time monitoring)
app.use(metricsMiddleware);

// Google Sheets logging middleware (for IBM Data Prep Kit)
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
// PROMETHEUS METRICS ENDPOINT (Real-time monitoring)
// ============================================
app.use('/metrics', metricsRoutes);

// API Routes
app.use('/api/auth', authRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

// ============================================
// 🧪 MONITORING ENDPOINT (for testing error logging in production)
// This is a SAFE endpoint to verify error logging works
// Visit: https://your-app.onrender.com/api/test-logging
// ============================================
app.get('/api/test-logging', async (req, res) => {
  try {
    // Intentionally throw a test error
    throw new Error('Test error for monitoring - Error logging is working!');
  } catch (error) {
    console.log('📊 Test error triggered - logging to Google Sheets...');
    
    // Log to Google Sheets Errors tab
    await sheetsLogger.logError(
      'monitoring_test',
      error.message,
      error.stack,
      { 
        endpoint: '/api/test-logging',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        note: 'Manual test to verify error logging is functional'
      }
    );
    
    console.log('✅ Test error logged to Google Sheets!');
    
    res.status(200).json({ 
      success: true,
      message: '✅ Error logging test completed successfully!',
      note: 'Check your Google Sheets Errors tab - you should see a new row',
      timestamp: new Date().toISOString()
    });
  }
});

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
  console.log(`📊 Prometheus metrics: http://localhost:${PORT}/metrics`);
  console.log(`💊 Health check at http://localhost:${PORT}/health`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔐 Supabase URL: ${process.env.SUPABASE_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`� Monitoring: Prometheus (real-time) + Google Sheets ${sheetsLogger.initialized ? '(CSV export)' : '(disabled)'}`);
});

module.exports = app;
