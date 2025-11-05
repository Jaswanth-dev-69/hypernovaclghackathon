# 🐳 Docker Setup & Prometheus Monitoring - Quick Start

## ✅ STEP 1: Start Docker Desktop

You've already installed Docker! Now you need to start it:

### Option A: Via Start Menu
1. Press **Windows Key**
2. Type: **Docker Desktop**
3. Click to open
4. Wait for "Engine running" status (bottom left, green indicator)

### Option B: Via PowerShell
```powershell
# Start Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Wait 30 seconds for Docker to start
Start-Sleep -Seconds 30

# Verify Docker is running
docker --version
docker ps
```

---

## ✅ STEP 2: Verify Docker is Working

After Docker Desktop shows "Engine running":

```powershell
# Close and reopen PowerShell (important!)
# Then test:

docker --version
# Expected: Docker version 24.x.x, build xxxxx

docker ps
# Expected: (empty list or running containers)
```

✅ **If you see version info, Docker is working!**

---

## ✅ STEP 3: Start Prometheus Monitoring Stack

Now let's start all monitoring services:

```powershell
# Navigate to project
cd J:\hypernovahackathon

# Start all services (Prometheus, Grafana, Alertmanager, Node Exporter)
docker compose up -d

# Expected output:
# [+] Running 4/4
#  ✔ Container hypernova-prometheus      Started
#  ✔ Container hypernova-grafana         Started
#  ✔ Container hypernova-alertmanager    Started
#  ✔ Container hypernova-node-exporter   Started
```

---

## ✅ STEP 4: Verify All Services are Running

```powershell
# Check container status
docker compose ps

# Expected:
# NAME                       STATUS
# hypernova-prometheus       Up X seconds
# hypernova-grafana          Up X seconds
# hypernova-alertmanager     Up X seconds
# hypernova-node-exporter    Up X seconds
```

---

## ✅ STEP 5: Access Prometheus

```powershell
# Open Prometheus UI
start http://localhost:9090

# Check if it's scraping your backend
start http://localhost:9090/targets
```

**What you should see:**
- Prometheus UI with query box
- Under Targets: `hypernova-backend-local` with status **UP** 🟢

---

## ✅ STEP 6: Verify Backend is Being Scraped

### In Prometheus UI (http://localhost:9090):

1. **Click:** Status → Targets
2. **Look for:** `hypernova-backend-local`
3. **Check Status:** Should be 🟢 **UP**

**Target Details:**
```
Endpoint: http://host.docker.internal:5000/metrics
State: UP
Last Scrape: 5s ago
Scrape Duration: ~15ms
```

---

## ✅ STEP 7: Test Login Failure Tracking

### Generate test data:
```powershell
# Open new PowerShell window
cd J:\hypernovahackathon\backend

# Generate 5 failed login attempts
npm run test:login-failures

# Expected: 5 failed logins created
```

### Query in Prometheus:
1. Go to: http://localhost:9090/graph
2. Enter query: `hypernova_login_failures_total`
3. Click **Execute**
4. Should show: `hypernova_login_failures_total{reason="invalid_credentials"} 5`

---

## ✅ STEP 8: Check Alerts are Working

Prometheus is configured with alerts for:
- High login failure rate
- High error rate
- Slow response times
- High CPU/memory usage

### View Alerts:
```powershell
# Open Prometheus alerts page
start http://localhost:9090/alerts

# Open Alertmanager
start http://localhost:9093
```

**Alert Status:**
- 🟢 **Inactive** - Everything normal
- 🟡 **Pending** - Threshold reached, waiting
- 🔴 **Firing** - Alert active!

---

## ✅ STEP 9: Access Grafana Dashboard

```powershell
# Open Grafana
start http://localhost:3001
```

**Login:**
- Username: `admin`
- Password: `admin`
- (Change password when prompted, or skip)

**Create Dashboard:**
1. Click **"+"** → **"Dashboard"**
2. Click **"Add visualization"**
3. Select **"Prometheus"** data source
4. Enter query: `hypernova_login_failures_total`
5. Click **"Apply"**

Now you have a real-time dashboard! 📊

---

## 🎯 COMPLETE COMMAND SEQUENCE

Just copy-paste all of these:

```powershell
# 1. Start Docker Desktop (if not already running)
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
Start-Sleep -Seconds 30

# 2. Navigate to project
cd J:\hypernovahackathon

# 3. Start monitoring stack
docker compose up -d

# 4. Wait for services to start
Start-Sleep -Seconds 15

# 5. Check status
docker compose ps

# 6. Open Prometheus
start http://localhost:9090

# 7. Open Grafana
start http://localhost:3001

# 8. Check targets
start http://localhost:9090/targets

# 9. Generate test login failures
cd backend
npm run test:login-failures
```

---

## 📊 SERVICES & PORTS

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend** | http://localhost:5000 | Your Node.js API |
| **Backend Metrics** | http://localhost:5000/metrics | Raw Prometheus metrics |
| **Prometheus** | http://localhost:9090 | Query & view metrics |
| **Grafana** | http://localhost:3001 | Visualize dashboards |
| **Alertmanager** | http://localhost:9093 | Manage alerts |
| **Frontend** | http://localhost:3000 | Next.js app |

---

## 🔍 USEFUL PROMETHEUS QUERIES

Copy these into Prometheus at http://localhost:9090/graph:

### Login Failures:
```promql
# Total login failures
hypernova_login_failures_total

# Failures by reason
sum by (reason) (hypernova_login_failures_total)

# Failure rate per second (last 5 min)
rate(hypernova_login_failures_total[5m])

# Total failed attempts
sum(hypernova_login_failures_total)
```

### Auth Metrics:
```promql
# Success vs failure
sum by (status) (hypernova_auth_attempts_total{type="login"})

# Success rate %
(sum(hypernova_auth_attempts_total{status="success",type="login"}) / 
 sum(hypernova_auth_attempts_total{type="login"})) * 100
```

### System Metrics:
```promql
# Memory usage (MB)
hypernova_process_resident_memory_bytes / 1024 / 1024

# CPU usage
rate(hypernova_process_cpu_user_seconds_total[5m])

# HTTP requests by status
sum by (status_code) (hypernova_http_requests_total)

# Average response time
rate(hypernova_http_request_duration_seconds_sum[5m]) / 
rate(hypernova_http_request_duration_seconds_count[5m])
```

---

## 🚨 ALERTS CONFIGURED

Your Prometheus has these alerts (check at http://localhost:9090/alerts):

1. **HighLoginFailureRate**
   - Triggers when: > 0.5 failures/second
   - Duration: 2 minutes

2. **HighHTTPErrorRate**
   - Triggers when: > 5% error rate
   - Duration: 5 minutes

3. **HighHTTPResponseTime**
   - Triggers when: p95 > 2 seconds
   - Duration: 5 minutes

4. **HighMemoryUsage**
   - Triggers when: > 500MB
   - Duration: 5 minutes

5. **HighCPUUsage**
   - Triggers when: > 80%
   - Duration: 5 minutes

---

## 🔧 TROUBLESHOOTING

### Docker Desktop won't start:
```powershell
# Check if WSL 2 is installed
wsl --status

# Install WSL 2 if needed
wsl --install
wsl --set-default-version 2

# Restart computer
```

### Target shows DOWN in Prometheus:
```powershell
# Restart backend
cd J:\hypernovahackathon\backend
npm start

# Check if Docker can reach backend
docker exec hypernova-prometheus wget -O- http://host.docker.internal:5000/metrics

# If fails, restart Docker containers
cd J:\hypernovahackathon
docker compose restart
```

### "docker" command not recognized:
```powershell
# Close ALL PowerShell windows
# Reopen PowerShell
# Make sure Docker Desktop is running (green icon in system tray)

# Test again
docker --version
```

### Containers won't start:
```powershell
# Check Docker Desktop is running
# Check ports aren't in use
netstat -ano | findstr ":9090"
netstat -ano | findstr ":3001"
netstat -ano | findstr ":9093"

# View Docker logs
docker compose logs
```

---

## 🎯 VERIFICATION CHECKLIST

Check each item:

- [ ] Docker Desktop installed and shows "Engine running"
- [ ] `docker --version` works in PowerShell
- [ ] Backend running at http://localhost:5000
- [ ] `docker compose up -d` completes successfully
- [ ] `docker compose ps` shows 4 containers UP
- [ ] Prometheus accessible at http://localhost:9090
- [ ] Target "hypernova-backend-local" shows UP status
- [ ] Can query `hypernova_login_failures_total`
- [ ] Grafana accessible at http://localhost:3001
- [ ] Alertmanager accessible at http://localhost:9093

---

## 📤 EXPORT TO IBM DATA PREP KIT

Once everything is running, you can export data:

### Option 1: Query Prometheus API (Recommended)
```powershell
# Get current login failures
$result = Invoke-RestMethod "http://localhost:9090/api/v1/query?query=hypernova_login_failures_total"
$result | ConvertTo-Json -Depth 10 | Out-File "login_failures.json"

# Get time-series (last 24 hours)
$start = ([DateTimeOffset]::UtcNow.AddHours(-24)).ToUnixTimeSeconds()
$end = ([DateTimeOffset]::UtcNow).ToUnixTimeSeconds()
$url = "http://localhost:9090/api/v1/query_range?query=hypernova_login_failures_total&start=$start&end=$end&step=300"

Invoke-RestMethod $url | ConvertTo-Json -Depth 10 | Out-File "failures_timeseries.json"
```

### Option 2: Direct Backend Scraping
```powershell
# Scrape raw metrics from backend
Invoke-WebRequest http://localhost:5000/metrics | 
    Select-Object -ExpandProperty Content | 
    Out-File "backend_metrics.txt"
```

---

## 🎉 SUCCESS!

You now have:
- ✅ Prometheus scraping your backend every 10 seconds
- ✅ Login failures tracked with detailed reasons
- ✅ Alerts configured for anomalies
- ✅ Grafana for visualization
- ✅ Alertmanager for notifications
- ✅ Data ready for IBM Data Prep Kit

**Next steps:**
1. Open http://localhost:9090 and explore queries
2. Create Grafana dashboards at http://localhost:3001
3. Test wrong logins and watch metrics increase
4. Export data for IBM Data Prep Kit analysis

---

## 🛑 STOP SERVICES

When you're done:

```powershell
# Stop all monitoring services
cd J:\hypernovahackathon
docker compose down

# Or just stop (keeps data)
docker compose stop

# Restart later
docker compose start
```

---

**Everything is ready! Start with Step 1 and follow through!** 🚀
