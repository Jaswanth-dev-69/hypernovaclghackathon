# 🚀 COMPLETE STEP-BY-STEP GUIDE - Getting Metrics from Backend

## ✅ VERIFICATION - Everything is Ready!

Your project has:
- ✅ Backend with Prometheus metrics exporter (`prom-client` installed)
- ✅ Metrics middleware integrated in `server.js`
- ✅ `/metrics` endpoint exposed
- ✅ Auth and Cart controllers instrumented
- ✅ Docker Compose configuration ready
- ✅ Prometheus alert rules configured

---

## 🎯 STEP-BY-STEP EXECUTION

### **STEP 1: Start Backend Server**

**Terminal 1 - Backend:**
```powershell
cd J:\hypernovahackathon\backend
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
📊 Metrics available at http://localhost:5000/metrics
💊 Health check at http://localhost:5000/metrics/health
📱 Frontend URL: http://localhost:3000
🔐 Supabase URL: https://kpzfnzyqxtiauuxljhzr.supabase.co
🌍 Environment: development
```

**✅ Verify Backend is Working:**
- Open browser: http://localhost:5000/health
- Should see: `{"success":true,"message":"Server is running",...}`

---

### **STEP 2: Test Metrics Endpoint (Before Prometheus)**

**Terminal 2 - Test Metrics:**
```powershell
# Test if metrics endpoint works
Invoke-WebRequest http://localhost:5000/metrics
```

**Expected Output:**
```
# HELP hypernova_process_cpu_user_seconds_total Total user CPU time
# TYPE hypernova_process_cpu_user_seconds_total counter
hypernova_process_cpu_user_seconds_total 0.015625

# HELP hypernova_process_resident_memory_bytes Resident memory size
# TYPE hypernova_process_resident_memory_bytes gauge
hypernova_process_resident_memory_bytes 52428800

# HELP hypernova_http_requests_total Total number of HTTP requests
# TYPE hypernova_http_requests_total counter
hypernova_http_requests_total{method="GET",route="/metrics",status_code="200",env="development"} 1

# HELP hypernova_active_connections Number of active connections
# TYPE hypernova_active_connections gauge
hypernova_active_connections 0
```

---

### **STEP 3: Start Prometheus (Docker)**

**Terminal 3 - Prometheus:**

**Option A - Using Docker Compose (Recommended):**
```powershell
cd J:\hypernovahackathon
docker compose up -d
```

**Option B - Using Docker directly (if compose fails):**
```powershell
cd J:\hypernovahackathon

# Start Prometheus
docker run -d `
  --name hypernova-prometheus `
  -p 9090:9090 `
  -v "${PWD}\prometheus\prometheus.yml:/etc/prometheus/prometheus.yml" `
  -v "${PWD}\prometheus\alert_rules.yml:/etc/prometheus/alert_rules.yml" `
  --add-host=host.docker.internal:host-gateway `
  prom/prometheus `
  --config.file=/etc/prometheus/prometheus.yml `
  --storage.tsdb.path=/prometheus `
  --web.enable-lifecycle

# Start Grafana (optional)
docker run -d `
  --name hypernova-grafana `
  -p 3001:3000 `
  -e GF_SECURITY_ADMIN_PASSWORD=admin `
  prom/grafana
```

**Expected Output:**
```
✅ Container hypernova-prometheus started
✅ Container hypernova-grafana started
```

**✅ Verify Prometheus is Running:**
```powershell
docker ps
```

Should show:
```
CONTAINER ID   IMAGE             STATUS         PORTS                    NAMES
abc123...      prom/prometheus   Up 10 seconds  0.0.0.0:9090->9090/tcp  hypernova-prometheus
```

---

### **STEP 4: Verify Prometheus Can Scrape Backend**

**Open Browser - Check Prometheus Targets:**

1. Go to: **http://localhost:9090/targets**

2. Look for `hypernova-backend-local` target:
   - **State:** Should be **UP** (green)
   - **Endpoint:** http://host.docker.internal:5000/metrics
   - **Last Scrape:** Should show recent time (e.g., "2s ago")

**If target is DOWN:**
- Make sure backend is running on port 5000
- Check backend logs for errors
- Test metrics endpoint: http://localhost:5000/metrics

---

### **STEP 5: Query Metrics in Prometheus**

**Open Prometheus Graph UI:**

Go to: **http://localhost:9090/graph**

**Try These Queries:**

1. **View all HTTP requests:**
   ```promql
   hypernova_http_requests_total
   ```

2. **HTTP requests per second (rate):**
   ```promql
   rate(hypernova_http_requests_total[1m])
   ```

3. **Active connections:**
   ```promql
   hypernova_active_connections
   ```

4. **Memory usage in MB:**
   ```promql
   hypernova_process_resident_memory_bytes / 1024 / 1024
   ```

5. **CPU usage percentage:**
   ```promql
   rate(hypernova_process_cpu_user_seconds_total[1m]) * 100
   ```

**Click "Execute" and switch to "Graph" tab to visualize!**

---

### **STEP 6: Generate Activity to See Metrics Change**

**Terminal 2 - Generate Test Requests:**

```powershell
# Test login endpoint multiple times
for ($i=1; $i -le 10; $i++) {
    Write-Host "Request $i"
    Invoke-RestMethod -Uri http://localhost:5000/api/auth/login `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"email":"test@test.com","password":"wrong"}' `
        -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
}
```

**Now check Prometheus again:**
- Query: `hypernova_auth_attempts_total`
- Should see counter increase!
- Query: `hypernova_login_failures_total`
- Should see failures counted!

---

### **STEP 7: Start Frontend (Optional)**

**Terminal 4 - Frontend:**
```powershell
cd J:\hypernovahackathon\frontend
npm run dev
```

**Open Frontend:**
- Go to: http://localhost:3000
- Try logging in, adding to cart
- Watch metrics increase in Prometheus!

---

### **STEP 8: View Metrics in Real-Time**

**Keep these tabs open:**

1. **Prometheus Graph:** http://localhost:9090/graph
   - Query: `rate(hypernova_http_requests_total[1m])`
   - Refresh every 5 seconds

2. **Prometheus Targets:** http://localhost:9090/targets
   - Verify backend is UP

3. **Backend Metrics Endpoint:** http://localhost:5000/metrics
   - Raw metrics in Prometheus format

4. **Prometheus Alerts:** http://localhost:9090/alerts
   - View alert status (Inactive/Pending/Firing)

---

## 📊 KEY METRICS TO MONITOR

### HTTP Metrics
```promql
# Total requests
hypernova_http_requests_total

# Requests per second
rate(hypernova_http_requests_total[1m])

# Average response time
rate(hypernova_http_request_duration_seconds_sum[5m]) / 
rate(hypernova_http_request_duration_seconds_count[5m])
```

### Authentication Metrics
```promql
# Total auth attempts
hypernova_auth_attempts_total

# Login failures
hypernova_login_failures_total

# Auth success rate
sum(rate(hypernova_auth_attempts_total{status="success"}[5m])) /
sum(rate(hypernova_auth_attempts_total[5m]))
```

### Cart Metrics
```promql
# Cart operations
hypernova_cart_operations_total

# Cart operations by type
sum by(operation) (hypernova_cart_operations_total)

# Failed cart operations
hypernova_cart_operations_total{status="failure"}
```

### System Metrics
```promql
# CPU usage %
rate(hypernova_process_cpu_user_seconds_total[1m]) * 100

# Memory MB
hypernova_process_resident_memory_bytes / 1024 / 1024

# Event loop lag
hypernova_nodejs_eventloop_lag_seconds
```

---

## 🧪 TESTING SCENARIOS

### Test 1: HTTP Request Tracking
```powershell
# Generate 20 requests
for ($i=1; $i -le 20; $i++) {
    Invoke-WebRequest http://localhost:5000/health
}

# Check in Prometheus:
rate(hypernova_http_requests_total{route="/health"}[1m])
```

### Test 2: Failed Login Alert
```powershell
# Generate failed logins (trigger alert)
for ($i=1; $i -le 30; $i++) {
    Invoke-RestMethod -Uri http://localhost:5000/api/auth/login `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"email":"wrong@test.com","password":"wrong"}' `
        -ErrorAction SilentlyContinue
}

# Check alert: http://localhost:9090/alerts
# "HighLoginFailureRate" should go: Inactive → Pending → Firing
```

### Test 3: Cart Operations
```powershell
# Add to cart (need valid auth token)
# Use frontend to add items to cart
# Then check: hypernova_cart_operations_total
```

---

## 🔧 TROUBLESHOOTING

### Backend Not Starting
```powershell
# Check if port 5000 is free
netstat -ano | findstr :5000

# Check backend dependencies
cd backend
npm install
```

### Prometheus Target DOWN
```powershell
# Test metrics endpoint
Invoke-WebRequest http://localhost:5000/metrics

# Check backend logs
# Terminal 1 should show requests

# Test from inside container
docker exec hypernova-prometheus wget -O- http://host.docker.internal:5000/metrics
```

### No Metrics Appearing
```powershell
# Generate activity first!
Invoke-WebRequest http://localhost:5000/health

# Then check
Invoke-WebRequest http://localhost:5000/metrics

# Should see metrics increment
```

### Docker Issues
```powershell
# Check Docker is running
docker ps

# Restart Prometheus
docker restart hypernova-prometheus

# View logs
docker logs hypernova-prometheus
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Backend running on port 5000
- [ ] Metrics endpoint accessible: http://localhost:5000/metrics
- [ ] Prometheus running: http://localhost:9090
- [ ] Prometheus target "hypernova-backend-local" is UP
- [ ] Can query metrics in Prometheus graph
- [ ] Metrics increase when generating activity
- [ ] Alerts are loaded: http://localhost:9090/alerts

---

## 📈 NEXT STEPS

1. **Create Grafana Dashboard:**
   - Go to: http://localhost:3001 (if running)
   - Login: admin/admin
   - Create dashboard with your metrics

2. **Enable Alert Notifications:**
   - Edit `alertmanager/alertmanager.yml`
   - Add email/Slack configuration

3. **Deploy to Render:**
   - Production target will automatically start working
   - Monitor both dev and prod from same Prometheus

---

**🎉 YOU'RE ALL SET!**

Your metrics pipeline is working:
```
Backend → /metrics endpoint → Prometheus scrapes → Stores metrics → Query/Alert/Visualize
```
