/**
 * Global error handling middleware
 */
const { metrics } = require('./metricsExporter');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Track error metrics
  const route = req.route ? req.route.path : req.path;
  const env = process.env.NODE_ENV || 'development';
  
  metrics.errorTotal.inc({ 
    type: err.name || 'UnknownError', 
    route,
    env
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
