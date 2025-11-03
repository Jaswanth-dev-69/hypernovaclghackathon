const client = require('prom-client');

// Create a Registry to register metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, event loop lag, etc.)
client.collectDefaultMetrics({ 
  register,
  prefix: 'hypernova_'
});

// Custom HTTP metrics
const httpRequestDuration = new client.Histogram({
  name: 'hypernova_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'env'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10]
});

const httpRequestTotal = new client.Counter({
  name: 'hypernova_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'env']
});

const activeConnections = new client.Gauge({
  name: 'hypernova_active_connections',
  help: 'Number of active connections'
});

// Authentication metrics
const authAttempts = new client.Counter({
  name: 'hypernova_auth_attempts_total',
  help: 'Total number of authentication attempts',
  labelNames: ['status', 'type', 'env']
});

const authDuration = new client.Histogram({
  name: 'hypernova_auth_duration_seconds',
  help: 'Duration of authentication operations',
  labelNames: ['type', 'env'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const loginFailures = new client.Counter({
  name: 'hypernova_login_failures_total',
  help: 'Total login failures',
  labelNames: ['reason', 'env']
});

// Cart operation metrics
const cartOperations = new client.Counter({
  name: 'hypernova_cart_operations_total',
  help: 'Total number of cart operations',
  labelNames: ['operation', 'status', 'env']
});

const cartOperationDuration = new client.Histogram({
  name: 'hypernova_cart_operation_duration_seconds',
  help: 'Duration of cart operations',
  labelNames: ['operation', 'env'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});

// Database query metrics
const databaseQueries = new client.Histogram({
  name: 'hypernova_database_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['operation', 'table', 'env'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

const databaseErrors = new client.Counter({
  name: 'hypernova_database_errors_total',
  help: 'Total number of database errors',
  labelNames: ['operation', 'table', 'env']
});

// Error metrics
const errorTotal = new client.Counter({
  name: 'hypernova_errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'route', 'env']
});

// Application-specific metrics
const pageViews = new client.Counter({
  name: 'hypernova_page_views_total',
  help: 'Total number of page views',
  labelNames: ['page', 'env']
});

const apiCallDuration = new client.Histogram({
  name: 'hypernova_api_call_duration_seconds',
  help: 'Duration of API calls from frontend',
  labelNames: ['endpoint', 'status', 'env'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(authAttempts);
register.registerMetric(authDuration);
register.registerMetric(loginFailures);
register.registerMetric(cartOperations);
register.registerMetric(cartOperationDuration);
register.registerMetric(databaseQueries);
register.registerMetric(databaseErrors);
register.registerMetric(errorTotal);
register.registerMetric(pageViews);
register.registerMetric(apiCallDuration);

// Middleware to track HTTP requests
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  const env = process.env.NODE_ENV || 'development';
  
  // Increment active connections
  activeConnections.inc();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode, env },
      duration
    );
    
    httpRequestTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
      env
    });

    // Decrement active connections
    activeConnections.dec();
  });

  next();
};

module.exports = {
  register,
  metricsMiddleware,
  metrics: {
    httpRequestDuration,
    httpRequestTotal,
    activeConnections,
    authAttempts,
    authDuration,
    loginFailures,
    cartOperations,
    cartOperationDuration,
    databaseQueries,
    databaseErrors,
    errorTotal,
    pageViews,
    apiCallDuration
  }
};
