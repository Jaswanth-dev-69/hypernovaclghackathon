# 🚀 Quick Reference - Prometheus Metrics

## Access Points

### Local Development
- **Backend Server**: http://localhost:5000
- **Metrics Endpoint**: http://localhost:5000/metrics
- **Health Check**: http://localhost:5000/metrics/health
- **Prometheus UI**: http://localhost:9090 (if running)
- **Grafana**: http://localhost:3001 (if running)

### Production (Render)
- **Metrics Endpoint**: https://hypernovaclghackathon-api.onrender.com/metrics
- **Health Check**: https://hypernovaclghackathon-api.onrender.com/metrics/health

## Quick Commands

### Start Backend
```powershell
cd backend
npm start
```

### Test Metrics
```powershell
# View metrics
Invoke-WebRequest http://localhost:5000/metrics

# Test with script
node backend/test-metrics.js
```

### Start Prometheus & Grafana
```powershell
docker-compose up -d
```

### Stop Prometheus & Grafana
```powershell
docker-compose down
```

## Key Metrics

```promql
# Request rate
rate(hypernova_http_requests_total[1m])

# Response time
rate(hypernova_http_request_duration_seconds_sum[5m]) / 
rate(hypernova_http_request_duration_seconds_count[5m])

# Auth success rate
sum(rate(hypernova_auth_attempts_total{status="success"}[5m])) / 
sum(rate(hypernova_auth_attempts_total[5m])) * 100

# Cart operations
sum by(operation) (rate(hypernova_cart_operations_total[5m]))

# Error rate
rate(hypernova_errors_total[5m])
```

## Environment Variables

### Backend
```
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend
```
NEXT_PUBLIC_API_URL=https://hypernovaclghackathon-api.onrender.com
NEXT_PUBLIC_ENV=production
```

## Files Reference

- `PROMETHEUS_SETUP.md` - Complete setup guide
- `IMPLEMENTATION_COMPLETE.md` - Implementation summary
- `prometheus.yml` - Prometheus configuration
- `docker-compose.yml` - Docker setup
- `backend/src/middleware/metricsExporter.js` - Metrics definitions
- `backend/src/routes/metricsRoutes.js` - Metrics endpoints

## Troubleshooting

### Metrics not showing?
1. Ensure backend is running: `npm start`
2. Check metrics endpoint: `http://localhost:5000/metrics`
3. Check for errors in console

### Prometheus can't scrape?
1. Verify target in Prometheus UI: Status → Targets
2. Check prometheus.yml configuration
3. Ensure backend is accessible

### No data in Grafana?
1. Configure Prometheus data source
2. Check time range (use "Last 5 minutes")
3. Generate traffic to create metrics

## What's Monitored

✅ HTTP requests (count, duration, status)
✅ Authentication (login/signup success/failure)
✅ Cart operations (add, remove, update, clear)
✅ Database queries (duration, errors)
✅ System health (CPU, memory, event loop)
✅ Error tracking (by type and route)
✅ Frontend telemetry (page views, API calls)

---

**Your app is now production-ready with enterprise-grade monitoring!** 🎉
