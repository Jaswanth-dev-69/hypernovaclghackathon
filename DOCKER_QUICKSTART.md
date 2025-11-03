# HyperNova Monitoring Stack - Docker Quick Start

This guide will help you set up and run the Prometheus monitoring stack locally using Docker.

## 🚀 Prerequisites

- **Docker Desktop** installed and running on your Windows laptop
- **Backend server** ready to run (Node.js application on port 5000)

## 📁 What's Been Created

Your monitoring stack includes:

```
hypernovahackathon/
├── docker-compose.yml              # Docker orchestration
├── start-monitoring.ps1            # Quick start script
├── prometheus/
│   ├── prometheus.yml             # Prometheus configuration
│   └── alert_rules.yml            # Alert rules
├── alertmanager/
│   └── alertmanager.yml           # Alertmanager config (no email)
└── grafana/
    └── provisioning/
        ├── datasources/
        │   └── prometheus.yml     # Auto-configure Prometheus
        └── dashboards/
            └── dashboards.yml     # Dashboard provider
```

## 🎯 Quick Start (3 Steps)

### Step 1: Start Docker Desktop

Make sure Docker Desktop is running. Check the system tray for the Docker icon.

### Step 2: Start Monitoring Stack

Open PowerShell in the project root and run:

```powershell
.\start-monitoring.ps1
```

This will:
- ✅ Check Docker is running
- ✅ Start Prometheus (port 9090)
- ✅ Start Alertmanager (port 9093)
- ✅ Start Grafana (port 3001)
- ✅ Start Node Exporter (port 9100)
- ✅ Display all access URLs

### Step 3: Start Your Backend

In a new PowerShell window:

```powershell
cd backend
npm start
```

Your backend should start on `http://localhost:5000`

## 🔍 Verify Everything is Working

### 1. Check Prometheus Targets

Open: http://localhost:9090/targets

You should see:
- ✅ **hypernova-backend-local** - State: UP
- ✅ **prometheus** - State: UP
- ✅ **alertmanager** - State: UP
- ✅ **grafana** - State: UP
- ✅ **node-exporter** - State: UP

**Note:** `hypernova-backend-production` will be DOWN if not deployed to Render yet - this is normal!

### 2. Test Backend Metrics Endpoint

Open: http://localhost:5000/metrics

You should see Prometheus format metrics like:
```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/metrics",status="200"} 1

# HELP hypernova_auth_attempts_total Total authentication attempts
# TYPE hypernova_auth_attempts_total counter
hypernova_auth_attempts_total{operation="login",status="success"} 5
```

### 3. Query Metrics in Prometheus

Open: http://localhost:9090/graph

Try these queries:
```
http_requests_total
hypernova_auth_attempts_total
hypernova_cart_operations_total
rate(http_requests_total[5m])
```

Click **Execute** and switch to **Graph** tab to visualize!

### 4. Open Grafana

Open: http://localhost:3001

**Login:**
- Username: `admin`
- Password: `admin`

Grafana will automatically connect to Prometheus. You can create custom dashboards to visualize your metrics.

## 📊 Key Metrics to Monitor

### Authentication Metrics
```promql
hypernova_auth_attempts_total{operation="login"}
hypernova_auth_attempts_total{operation="signup"}
hypernova_login_failures_total
hypernova_auth_duration_seconds
```

### Cart Metrics
```promql
hypernova_cart_operations_total{operation="add"}
hypernova_cart_operations_total{operation="update"}
hypernova_cart_operations_total{operation="remove"}
hypernova_cart_operation_duration_seconds
```

### HTTP Performance
```promql
http_requests_total
http_request_duration_seconds
rate(http_requests_total[5m])
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### System Resources
```promql
process_cpu_usage_percentage
process_resident_memory_bytes
nodejs_eventloop_lag_seconds
nodejs_active_handles_total
```

### Database Metrics
```promql
hypernova_db_query_duration_seconds
hypernova_db_errors_total
```

## 🚨 Check Alerts

Open: http://localhost:9090/alerts

You'll see all configured alerts:
- 🟢 **Inactive** - Everything is fine
- 🟡 **Pending** - Condition met, waiting for threshold duration
- 🔴 **Firing** - Alert is active!

**Note:** Alerts are being tracked but no notifications are sent (email not configured).

## 🎨 Create Grafana Dashboard

1. Open Grafana: http://localhost:3001
2. Click **+** → **Create Dashboard**
3. Click **Add visualization**
4. Select **Prometheus** as data source
5. Enter a query (e.g., `hypernova_auth_attempts_total`)
6. Customize the visualization
7. Click **Save** and name your dashboard

### Example Dashboard Panels

**Auth Success Rate (past 5 minutes):**
```promql
rate(hypernova_auth_attempts_total{status="success"}[5m])
```

**Cart Operations by Type:**
```promql
sum by(operation) (hypernova_cart_operations_total)
```

**HTTP Request Rate:**
```promql
sum(rate(http_requests_total[5m])) by (method, route)
```

**95th Percentile Response Time:**
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

## 🛠️ Common Commands

### View Container Status
```powershell
docker-compose ps
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f prometheus
docker-compose logs -f grafana
```

### Restart a Service
```powershell
docker-compose restart prometheus
```

### Stop All Services
```powershell
docker-compose down
```

### Stop and Remove All Data
```powershell
docker-compose down -v
```

## 🧪 Test Your Setup

### Test 1: Generate Auth Metrics

1. Open your frontend: http://localhost:3000/login
2. Try logging in (success or failure)
3. Check metrics: http://localhost:5000/metrics
4. Search for: `hypernova_auth_attempts_total`
5. Query in Prometheus: `hypernova_auth_attempts_total`

### Test 2: Generate Cart Metrics

1. Open shop page and add items to cart
2. Update quantities
3. Check metrics: http://localhost:5000/metrics
4. Search for: `hypernova_cart_operations_total`
5. Query in Prometheus: `hypernova_cart_operations_total`

### Test 3: Check Alert Rules

1. Open: http://localhost:9090/alerts
2. See all configured alerts
3. To trigger an alert, generate conditions (e.g., failed logins)
4. Wait for alert to go from Inactive → Pending → Firing

## 📊 Monitoring Workflow

```
Your App → Metrics → Prometheus → Alertmanager → (Grafana)
                                         ↓
                                   Alerts Tracked
                              (No email notifications)
```

**How it works:**
1. Your backend exposes `/metrics` endpoint
2. Prometheus scrapes metrics every 10-15 seconds
3. Alert rules are evaluated every 15 seconds
4. Alerts are sent to Alertmanager (but no notifications configured)
5. Grafana queries Prometheus for visualization

## 🔧 Troubleshooting

### Backend Target Shows "DOWN"

**Problem:** `hypernova-backend-local` shows DOWN in Prometheus targets

**Solution:**
1. Make sure backend is running: `cd backend && npm start`
2. Test metrics endpoint: http://localhost:5000/metrics
3. Check backend logs for errors
4. Verify port 5000 is not blocked

### No Metrics Appearing

**Problem:** Metrics endpoint is empty or shows only default metrics

**Solution:**
1. Generate some activity (login, add to cart)
2. Frontend must send metrics via `/metrics/emit`
3. Check backend logs for metric emission
4. Verify frontend is calling backend API (not Supabase directly)

### Grafana Won't Connect to Prometheus

**Problem:** Grafana shows "Data source not found"

**Solution:**
1. Check Prometheus is running: http://localhost:9090
2. Verify Docker network: `docker network ls`
3. Restart Grafana: `docker-compose restart grafana`
4. Check datasource config: `grafana/provisioning/datasources/prometheus.yml`

### Docker Containers Won't Start

**Problem:** Error starting containers

**Solution:**
1. Check Docker Desktop is running
2. Check port conflicts: `netstat -ano | findstr "9090 9093 3001"`
3. View detailed logs: `docker-compose logs`
4. Try: `docker-compose down && docker-compose up -d`

### Alerts Not Working

**Problem:** Alerts stay in Pending or never fire

**Solution:**
1. Check alert rules syntax: http://localhost:9090/alerts
2. Verify metrics exist: Query in Prometheus graph
3. Check evaluation interval: 15s by default
4. Review alert "for" duration (how long condition must be true)

## 📈 Next Steps

### 1. Create Custom Dashboards in Grafana
- Business metrics (signups, cart additions, revenue tracking)
- System health (CPU, memory, response times)
- User engagement (page views, session duration)

### 2. Fine-tune Alert Thresholds
Edit `prometheus/alert_rules.yml` to adjust:
- Failure rate thresholds
- Response time limits
- Resource usage warnings

### 3. Add Production Monitoring
When deployed to Render:
1. The `hypernova-backend-production` target will automatically scrape your production metrics
2. Same alerts will monitor production
3. Compare dev vs prod metrics in Grafana

### 4. Enable Email Notifications (Future)
When ready, edit `alertmanager/alertmanager.yml`:
- Uncomment email receiver configuration
- Add SMTP settings
- Update route to use email receiver

## 🎉 Success Checklist

- ✅ Docker Desktop running
- ✅ Monitoring stack started via script
- ✅ All containers healthy (`docker-compose ps`)
- ✅ Backend running on port 5000
- ✅ Prometheus targets showing UP
- ✅ Metrics endpoint accessible (http://localhost:5000/metrics)
- ✅ Can query metrics in Prometheus
- ✅ Grafana accessible with Prometheus data source
- ✅ Alert rules loaded and evaluating

## 📚 Additional Resources

- **Prometheus Documentation:** https://prometheus.io/docs/
- **PromQL Guide:** https://prometheus.io/docs/prometheus/latest/querying/basics/
- **Grafana Dashboards:** https://grafana.com/grafana/dashboards/
- **Alert Rules Examples:** https://awesome-prometheus-alerts.grep.to/

## 🆘 Need Help?

1. Check container logs: `docker-compose logs -f [service-name]`
2. Verify backend metrics: http://localhost:5000/metrics
3. Check Prometheus targets: http://localhost:9090/targets
4. Review alert rules: http://localhost:9090/alerts
5. Test queries in Prometheus graph: http://localhost:9090/graph

---

**Happy Monitoring! 🚀**
