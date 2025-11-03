# 🔧 Permanent Docker PATH Fix

## The Problem
Docker Desktop is running, but the `docker` command isn't recognized in PowerShell because it's not in your system PATH.

---

## ✅ TEMPORARY FIX (Current Session Only)

Add this to the start of any PowerShell command:

```powershell
$env:Path += ";C:\Program Files\Docker\Docker\resources\bin"
```

**Example:**
```powershell
$env:Path += ";C:\Program Files\Docker\Docker\resources\bin"; docker ps
```

---

## ✅ PERMANENT FIX (Recommended)

### Option 1: Via PowerShell (Recommended)

Run this **once** as Administrator:

```powershell
# Open PowerShell as Administrator, then run:
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\Program Files\Docker\Docker\resources\bin",
    "Machine"
)

# Close ALL PowerShell windows and reopen
# Test: docker --version should now work
```

### Option 2: Via Windows Settings (GUI)

1. Press **Windows Key + X** → **System**
2. Click **Advanced system settings** (right side)
3. Click **Environment Variables** button
4. Under **System variables**, find **Path**
5. Click **Edit**
6. Click **New**
7. Add: `C:\Program Files\Docker\Docker\resources\bin`
8. Click **OK** → **OK** → **OK**
9. **Close all PowerShell windows** and reopen

### Option 3: Via Command Prompt (Admin)

```cmd
setx /M PATH "%PATH%;C:\Program Files\Docker\Docker\resources\bin"
```

---

## ✅ VERIFY IT WORKS

After applying permanent fix:

1. **Close ALL PowerShell windows**
2. Open **new** PowerShell window
3. Run:
   ```powershell
   docker --version
   docker ps
   ```

Expected output:
```
Docker version 28.5.1, build e180ab8
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS   PORTS   NAMES
```

---

## 🎯 YOUR MONITORING STACK

Everything is now running! 🎉

### Services Running:
- ✅ **Prometheus**: http://localhost:9090
- ✅ **Grafana**: http://localhost:3001 (admin/admin)
- ✅ **Alertmanager**: http://localhost:9093
- ✅ **Node Exporter**: http://localhost:9100
- ✅ **Backend**: http://localhost:5000 (on J: drive)

### Config Location:
- 📁 **C:\hypernova-monitoring\**
  - `prometheus.yml` - Prometheus config
  - `docker-compose.yml` - Container orchestration

---

## 🔍 USEFUL COMMANDS

All these will work after PATH fix:

```powershell
# Check running containers
docker ps

# View Prometheus logs
docker logs hypernova-prometheus

# View Grafana logs
docker logs hypernova-grafana

# Restart containers
cd C:\hypernova-monitoring
docker compose restart

# Stop all services
docker compose down

# Start all services
docker compose up -d

# View resource usage
docker stats
```

---

## 📊 TEST YOUR METRICS

### 1. Open Prometheus UI
```powershell
start http://localhost:9090
```

### 2. Try these queries in the UI:

**Login Failures:**
```promql
hypernova_login_failures_total
```

**Failure Rate (per second):**
```promql
rate(hypernova_login_failures_total[5m])
```

**Failures by Reason:**
```promql
sum by (reason) (hypernova_login_failures_total)
```

**Total Failures:**
```promql
sum(hypernova_login_failures_total)
```

### 3. Check if Backend is Being Scraped

Go to: http://localhost:9090/targets

You should see:
- **Endpoint**: `hypernova-backend` (host.docker.internal:5000)
- **State**: 🟢 **UP**
- **Last Scrape**: Recently (few seconds ago)

---

## 🧪 GENERATE TEST DATA

Want to see metrics in action?

```powershell
# Go to your backend folder
cd J:\hypernovahackathon\backend

# Generate 5 failed login attempts
npm run test:login-failures

# Then refresh Prometheus query:
# hypernova_login_failures_total
# Should show count increased by 5
```

Or manually test:
1. Go to: http://localhost:3000/login (or 3001)
2. Enter wrong credentials 3 times
3. Check Prometheus - counter will increase!

---

## 📤 EXPORT TO IBM DATA PREP KIT

Now that Prometheus is running, you can export data:

### Method 1: Direct API Query
```powershell
# Get current login failures
$result = Invoke-RestMethod "http://localhost:9090/api/v1/query?query=hypernova_login_failures_total"
$result | ConvertTo-Json -Depth 10 | Out-File "C:\hypernova-monitoring\login_failures.json"

Write-Host "✅ Data exported to C:\hypernova-monitoring\login_failures.json"
```

### Method 2: Time-Series Data (Last 24 Hours)
```powershell
$start = ([DateTimeOffset]::UtcNow.AddHours(-24)).ToUnixTimeSeconds()
$end = ([DateTimeOffset]::UtcNow).ToUnixTimeSeconds()
$url = "http://localhost:9090/api/v1/query_range?query=hypernova_login_failures_total&start=$start&end=$end&step=60"

$timeseries = Invoke-RestMethod $url
$timeseries | ConvertTo-Json -Depth 10 | Out-File "C:\hypernova-monitoring\failures_timeseries.json"

Write-Host "✅ Time-series data exported!"
```

### Method 3: All Metrics (CSV format)
```powershell
# Get all metrics
$metrics = Invoke-WebRequest http://localhost:5000/metrics
$metrics.Content | Out-File "C:\hypernova-monitoring\all_metrics.txt"

# Parse for specific metrics
$loginFailures = $metrics.Content | Select-String "hypernova_login_failures_total"
$loginFailures | Out-File "C:\hypernova-monitoring\login_failures.txt"
```

---

## 🎨 CREATE GRAFANA DASHBOARD

1. Open Grafana: http://localhost:3001
2. Login: **admin** / **admin** (skip password change)
3. Click **"+"** → **"Dashboard"**
4. Click **"Add visualization"**
5. Select **"Prometheus"** data source
6. Enter query: `hypernova_login_failures_total`
7. Click **"Apply"**

Now you have a real-time dashboard! 📊

---

## 🚨 VIEW ALERTS

Check your configured alerts:

```powershell
# Open Prometheus alerts page
start http://localhost:9090/alerts

# Open Alertmanager
start http://localhost:9093
```

**Configured Alerts:**
- 🔴 **HighLoginFailureRate**: > 0.5 failures/sec for 2 min
- 🔴 **HighHTTPErrorRate**: > 5% errors for 5 min
- 🔴 **HighMemoryUsage**: > 500MB for 5 min

---

## 🛠️ TROUBLESHOOTING

### Docker command still not found after PATH fix
```powershell
# 1. Verify Docker Desktop is running
Get-Process "*docker*"

# 2. Check PATH was added
$env:Path -split ';' | Select-String "Docker"

# 3. Restart PowerShell (close ALL windows, reopen)

# 4. Try again
docker --version
```

### Prometheus shows "DOWN" for backend target
```powershell
# 1. Verify backend is running
Invoke-WebRequest http://localhost:5000/metrics

# 2. Check Docker can reach it
docker run --rm --add-host=host.docker.internal:host-gateway curlimages/curl curl -s http://host.docker.internal:5000/metrics

# 3. Restart Prometheus
docker restart hypernova-prometheus

# 4. Check logs
docker logs hypernova-prometheus
```

### Port already in use error
```powershell
# Find what's using the port
netstat -ano | findstr ":9090"

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use different port
docker run -d -p 9091:9090 --name prometheus prom/prometheus
```

---

## ✅ SUCCESS CHECKLIST

- [x] Docker Desktop installed and running
- [x] Docker PATH added (temporary fix applied)
- [x] Prometheus running at http://localhost:9090
- [x] Grafana running at http://localhost:3001
- [x] Backend accessible from Docker containers
- [x] Prometheus scraping backend successfully
- [ ] Docker PATH permanently fixed (optional - do this when you have time)
- [ ] Test queries in Prometheus UI
- [ ] Create Grafana dashboard
- [ ] Export data for IBM Data Prep Kit

---

## 🎉 YOU'RE ALL SET!

Your complete monitoring stack is now running:

1. **Backend** (J: drive) → Generates metrics
2. **Prometheus** (C: drive) → Collects metrics every 10s
3. **Grafana** (Docker) → Visualizes metrics
4. **Alertmanager** (Docker) → Handles alerts

**Next steps:**
1. Apply the permanent PATH fix when you have time
2. Go to http://localhost:9090 and explore your metrics
3. Query `hypernova_login_failures_total` to see your test data
4. Export to IBM Data Prep Kit using the commands above

---

## 📚 QUICK REFERENCE

### Start Services
```powershell
cd C:\hypernova-monitoring
docker compose up -d
```

### Stop Services
```powershell
cd C:\hypernova-monitoring
docker compose down
```

### View Logs
```powershell
docker logs hypernova-prometheus
docker logs hypernova-grafana
```

### Restart Everything
```powershell
cd C:\hypernova-monitoring
docker compose restart
```

### Add Docker to PATH (Current Session)
```powershell
$env:Path += ";C:\Program Files\Docker\Docker\resources\bin"
```

---

**Everything is working! 🚀 Check http://localhost:9090 right now!**
