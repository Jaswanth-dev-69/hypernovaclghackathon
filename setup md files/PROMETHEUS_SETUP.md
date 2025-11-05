# Prometheus Metrics Setup Guide

This guide explains how to set up and use Prometheus metrics monitoring for the HyperNova Hackathon project.

## 📊 What's Included

Your project now has comprehensive Prometheus metrics tracking:

### Backend Metrics (Node.js/Express)
- ✅ **HTTP Request Metrics**: Duration, count, status codes
- ✅ **Authentication Metrics**: Login/signup attempts, success/failure rates
- ✅ **Cart Operations**: Add, remove, update, clear with timing
- ✅ **Database Queries**: Query duration, error tracking
- ✅ **System Metrics**: CPU usage, memory, event loop lag
- ✅ **Error Tracking**: Errors by type and route

### Frontend Metrics (Next.js)
- ✅ **Page Views**: Track which pages users visit
- ✅ **API Calls**: Frontend API call duration and status
- ✅ **User Actions**: Events tracked via telemetry

## 🚀 Quick Start

### 1. Start Your Backend

```bash
cd backend
npm install
npm start
```

Your backend will start on `http://localhost:5000`

**Metrics Endpoints:**
- Prometheus metrics: `http://localhost:5000/metrics`
- Health check: `http://localhost:5000/metrics/health`

### 2. Test Metrics Locally

Visit the metrics endpoint to see Prometheus-format metrics:

```bash
# Windows PowerShell
Invoke-WebRequest http://localhost:5000/metrics

# Or use curl
curl http://localhost:5000/metrics
```

You should see output like:
```
# HELP hypernova_http_requests_total Total number of HTTP requests
# TYPE hypernova_http_requests_total counter
hypernova_http_requests_total{method="GET",route="/metrics",status_code="200",env="development"} 1

# HELP hypernova_auth_attempts_total Total number of authentication attempts
# TYPE hypernova_auth_attempts_total counter
hypernova_auth_attempts_total{status="success",type="login",env="development"} 5
```

### 3. Start Prometheus (Local Monitoring)

#### Option A: Using Docker (Recommended)

```bash
# Start Prometheus and Grafana
docker-compose up -d

# View logs
docker-compose logs -f prometheus
```

**Access URLs:**
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001` (admin/admin)

#### Option B: Without Docker

1. Download Prometheus from https://prometheus.io/download/
2. Extract to a folder
3. Copy `prometheus.yml` to the Prometheus folder
4. Run: `prometheus.exe --config.file=prometheus.yml` (Windows)

### 4. View Metrics in Prometheus

1. Open `http://localhost:9090`
2. Go to **Status → Targets** to verify your backend is being scraped
3. Go to **Graph** and try these queries:

```promql
# Request rate per second
rate(hypernova_http_requests_total[1m])

# Average response time
rate(hypernova_http_request_duration_seconds_sum[5m]) / 
rate(hypernova_http_request_duration_seconds_count[5m])

# Authentication success rate
sum(rate(hypernova_auth_attempts_total{status="success"}[5m])) / 
sum(rate(hypernova_auth_attempts_total[5m])) * 100

# Cart operations by type
sum by(operation) (rate(hypernova_cart_operations_total[5m]))

# Error rate
rate(hypernova_errors_total[5m])

# Active connections
hypernova_active_connections

# Login failures by reason
sum by(reason) (hypernova_login_failures_total)
```

## 📈 Setting Up Grafana Dashboard

1. Open Grafana at `http://localhost:3001`
2. Login with `admin`/`admin`
3. Add Prometheus as a data source:
   - Go to **Configuration → Data Sources**
   - Click **Add data source**
   - Select **Prometheus**
   - URL: `http://prometheus:9090` (if using Docker) or `http://localhost:9090`
   - Click **Save & Test**

4. Import a dashboard:
   - Go to **Create → Import**
   - Use dashboard ID `1860` (Node Exporter Full) for system metrics
   
   - Or create custom panels with the queries above

## 🌐 Production Deployment (Render)

### Backend Configuration

Your backend is already configured! When deployed to Render:

**Environment Variables to Set:**
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com
```

**Metrics Endpoint:**
- `https://hypernovaclghackathon-api.onrender.com/metrics`

### Configure Prometheus to Scrape Production

Update `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'hypernova-production'
    static_configs:
      - targets: ['hypernovaclghackathon-api.onrender.com']
    metrics_path: '/metrics'
    scheme: https
    scrape_interval: 30s
```

### Frontend Configuration

Add to `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=https://hypernovaclghackathon-api.onrender.com
NEXT_PUBLIC_ENV=production
```

Your frontend will automatically send telemetry to the backend's `/metrics/emit` endpoint.

## 🔍 Available Metrics

### HTTP Metrics
- `hypernova_http_requests_total` - Total HTTP requests
- `hypernova_http_request_duration_seconds` - Request duration histogram
- `hypernova_active_connections` - Current active connections

### Authentication Metrics
- `hypernova_auth_attempts_total` - Auth attempts (login/signup)
- `hypernova_auth_duration_seconds` - Auth operation duration
- `hypernova_login_failures_total` - Failed login attempts

### Cart Metrics
- `hypernova_cart_operations_total` - Cart operations count
- `hypernova_cart_operation_duration_seconds` - Cart operation timing

### Database Metrics
- `hypernova_database_query_duration_seconds` - DB query timing
- `hypernova_database_errors_total` - Database errors

### Error Metrics
- `hypernova_errors_total` - Total errors by type and route

### System Metrics (Default)
- `hypernova_process_cpu_user_seconds_total` - CPU usage
- `hypernova_process_resident_memory_bytes` - Memory usage
- `hypernova_nodejs_eventloop_lag_seconds` - Event loop lag

## 🧪 Testing the Implementation

### Test 1: Generate Traffic

```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test cart endpoint
curl http://localhost:5000/api/cart/user123

# Check metrics
curl http://localhost:5000/metrics | grep hypernova_auth_attempts_total
```

### Test 2: Frontend Telemetry

1. Start your frontend: `cd frontend && npm run dev`
2. Open browser and navigate around
3. Check browser console for telemetry logs
4. Check backend metrics: `curl http://localhost:5000/metrics | grep page`

### Test 3: Verify Prometheus Scraping

1. Open Prometheus UI: `http://localhost:9090`
2. Go to **Status → Targets**
3. Verify target is **UP**
4. Execute queries in the **Graph** tab

## 📊 Sample Grafana Queries

Create panels in Grafana with these queries:

**Request Rate:**
```promql
sum(rate(hypernova_http_requests_total[5m])) by (route)
```

**Error Rate:**
```promql
sum(rate(hypernova_errors_total[5m]))
```

**95th Percentile Response Time:**
```promql
histogram_quantile(0.95, rate(hypernova_http_request_duration_seconds_bucket[5m]))
```

**Cart Operations:**
```promql
sum(rate(hypernova_cart_operations_total[5m])) by (operation, status)
```

## 🛠️ Troubleshooting

### Metrics Not Showing Up

1. Check backend is running: `curl http://localhost:5000/health`
2. Check metrics endpoint: `curl http://localhost:5000/metrics`
3. Verify Prometheus can reach backend: Check Prometheus **Status → Targets**

### Prometheus Connection Refused

- Ensure backend is running on port 5000
- Check firewall settings
- Verify `prometheus.yml` has correct target URL

### No Data in Grafana

1. Verify Prometheus data source is configured correctly
2. Check time range in Grafana (use "Last 5 minutes")
3. Generate some traffic to create metrics

## 📚 Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [prom-client npm package](https://www.npmjs.com/package/prom-client)
- [PromQL Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)

## 🎯 What You've Achieved

✅ Full Prometheus metrics exporter in your Node.js backend
✅ Frontend telemetry sending metrics to backend
✅ Ready for production deployment on Render
✅ Local Prometheus + Grafana setup with Docker
✅ Comprehensive monitoring of auth, cart, and database operations
✅ Error tracking and performance monitoring

Your application is now production-ready with enterprise-grade observability! 🚀
