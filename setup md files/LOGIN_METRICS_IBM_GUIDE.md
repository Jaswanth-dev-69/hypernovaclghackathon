# 🎯 LOGIN FAILURE TRACKING - IBM DATA PREP KIT READY

## ✅ What's Already Working

### Backend Metrics Implementation
Your backend is now tracking **detailed login failures** with these metrics:

```javascript
// Failed Login Tracking:
hypernova_auth_attempts_total{status="failure", type="login", env="development"}
hypernova_login_failures_total{reason="invalid_credentials", env="development"}
hypernova_login_failures_total{reason="email_not_confirmed", env="development"}
hypernova_login_failures_total{reason="rate_limit", env="development"}
hypernova_login_failures_total{reason="user_not_found", env="development"}
hypernova_login_failures_total{reason="unknown_error", env="development"}
hypernova_auth_duration_seconds{type="login", env="development"}

// Successful Login Tracking:
hypernova_auth_attempts_total{status="success", type="login", env="development"}
```

---

## 🔍 View Metrics NOW (Without Prometheus)

### Option 1: Direct Backend Metrics Endpoint

**URL:** http://localhost:5000/metrics

**What you'll see:**
```prometheus
# HELP hypernova_login_failures_total Total number of failed login attempts
# TYPE hypernova_login_failures_total counter
hypernova_login_failures_total{reason="invalid_credentials",env="development"} 5
hypernova_login_failures_total{reason="email_not_confirmed",env="development"} 2

# HELP hypernova_auth_attempts_total Total authentication attempts
# TYPE hypernova_auth_attempts_total counter
hypernova_auth_attempts_total{status="failure",type="login",env="development"} 7
hypernova_auth_attempts_total{status="success",type="login",env="development"} 3

# HELP hypernova_auth_duration_seconds Authentication operation duration
# TYPE hypernova_auth_duration_seconds histogram
hypernova_auth_duration_seconds_bucket{le="0.5",type="login",env="development"} 8
hypernova_auth_duration_seconds_bucket{le="1",type="login",env="development"} 10
hypernova_auth_duration_seconds_sum{type="login",env="development"} 4.567
hypernova_auth_duration_seconds_count{type="login",env="development"} 10
```

---

## 🧪 Test Login Failures NOW

### Step 1: Try Wrong Credentials

1. **Go to:** http://localhost:3001/login (or 3000)

2. **Enter wrong credentials:**
   - Email: `wrong@example.com`
   - Password: `wrongpassword`

3. **Click Login** → Should fail

4. **Check metrics:** http://localhost:5000/metrics
   - Look for: `hypernova_login_failures_total{reason="invalid_credentials"}`
   - Counter should increment!

### Step 2: Try Multiple Failed Attempts

Repeat 5 times with different wrong credentials:
```
wrong1@test.com / pass123
wrong2@test.com / pass456
wrong3@test.com / pass789
test@fake.com / badpass
admin@test.com / wrongpw
```

### Step 3: View Updated Metrics

**Refresh:** http://localhost:5000/metrics

**You should see:**
```
hypernova_login_failures_total{reason="invalid_credentials",env="development"} 5
hypernova_auth_attempts_total{status="failure",type="login",env="development"} 5
```

---

## 📊 Export to IBM Data Prep Kit

### Method 1: Scrape Metrics Endpoint

Your backend exposes metrics in **Prometheus format** at:
```
http://localhost:5000/metrics
```

**IBM Data Prep Kit can:**
1. Make HTTP GET request to this endpoint
2. Parse Prometheus text format
3. Extract metric values
4. Store in your data pipeline

**Example Python Script for IBM Data Prep:**
```python
import requests
import re

def scrape_login_metrics():
    response = requests.get('http://localhost:5000/metrics')
    metrics_text = response.text
    
    # Parse login failures
    failures = {}
    for line in metrics_text.split('\n'):
        if 'hypernova_login_failures_total' in line and not line.startswith('#'):
            # Extract reason and count
            match = re.search(r'reason="([^"]+)".*?(\d+)$', line)
            if match:
                reason = match.group(1)
                count = int(match.group(2))
                failures[reason] = count
    
    return failures

# Use in your pipeline
login_failures = scrape_login_metrics()
print(login_failures)
# Output: {'invalid_credentials': 5, 'email_not_confirmed': 2}
```

### Method 2: Use Prometheus as Intermediate

If you want to use Prometheus for collection:

1. **Prometheus scrapes** backend every 10 seconds
2. **Stores time-series data**
3. **IBM Data Prep queries** Prometheus API
4. **Gets historical data** with timestamps

---

## 🐳 Set Up Prometheus (Choose One)

### Option A: Docker (Recommended)

**Requirements:**
- Docker Desktop installed and running

**Steps:**
```powershell
# 1. Make sure Docker Desktop is running
# 2. Start monitoring stack
cd J:\hypernovahackathon
docker compose up -d

# 3. Access Prometheus
# http://localhost:9090
```

**Verify:**
- Prometheus UI: http://localhost:9090
- Targets: http://localhost:9090/targets
- Should see: `hypernova-backend-local` as UP

### Option B: Windows Binary (No Docker)

**Download Prometheus:**
```powershell
# 1. Download from: https://prometheus.io/download/
# Windows AMD64 version

# 2. Extract to: C:\prometheus

# 3. Copy config file
Copy-Item prometheus\prometheus.yml C:\prometheus\

# 4. Run Prometheus
cd C:\prometheus
.\prometheus.exe

# 5. Access: http://localhost:9090
```

---

## 📈 Query Metrics in Prometheus

Once Prometheus is running, go to: http://localhost:9090

### Query 1: Total Login Failures
```promql
hypernova_login_failures_total
```

### Query 2: Login Failures by Reason
```promql
sum by (reason) (hypernova_login_failures_total)
```

### Query 3: Login Success Rate
```promql
rate(hypernova_auth_attempts_total{status="success",type="login"}[5m]) 
/ 
rate(hypernova_auth_attempts_total{type="login"}[5m])
```

### Query 4: Failed Login Rate (Last 5 minutes)
```promql
rate(hypernova_login_failures_total[5m])
```

### Query 5: Invalid Credentials Count
```promql
hypernova_login_failures_total{reason="invalid_credentials"}
```

---

## 🔗 IBM Data Prep Kit Integration

### Option 1: Direct HTTP Scraping (No Prometheus)

**Pros:**
- No Prometheus needed
- Direct access to current metrics
- Simple HTTP GET request

**Cons:**
- No historical data
- No time-series queries
- Manual parsing required

**URL:** http://localhost:5000/metrics

### Option 2: Prometheus HTTP API (With Prometheus)

**Pros:**
- Historical data available
- Time-series queries
- Aggregations and calculations
- Rate calculations

**Cons:**
- Requires Prometheus running
- Additional setup

**Prometheus API Examples:**

**Get current value:**
```bash
curl 'http://localhost:9090/api/v1/query?query=hypernova_login_failures_total'
```

**Get range (last hour):**
```bash
curl 'http://localhost:9090/api/v1/query_range?query=hypernova_login_failures_total&start=2025-11-04T00:00:00Z&end=2025-11-04T01:00:00Z&step=60s'
```

**Python Example:**
```python
import requests
import json

def get_prometheus_metrics(query):
    url = 'http://localhost:9090/api/v1/query'
    params = {'query': query}
    response = requests.get(url, params=params)
    data = response.json()
    
    if data['status'] == 'success':
        results = data['data']['result']
        for result in results:
            metric = result['metric']
            value = result['value'][1]
            print(f"{metric}: {value}")
    
    return data

# Get login failures
get_prometheus_metrics('hypernova_login_failures_total')

# Get failures by reason
get_prometheus_metrics('sum by (reason) (hypernova_login_failures_total)')
```

---

## 🎯 Quick Start for IBM Data Prep

### 1. Test Metrics Are Working

**Run this now:**
```powershell
# Check metrics endpoint
curl http://localhost:5000/metrics
```

**Or open in browser:**
```
http://localhost:5000/metrics
```

### 2. Generate Failed Login Data

**Go to login page and fail 10 times:**
```
http://localhost:3001/login
```

**Try different wrong credentials each time**

### 3. Verify Metrics Updated

**Refresh metrics endpoint:**
```
http://localhost:5000/metrics
```

**Search for:** `hypernova_login_failures_total`

### 4. Export to IBM Data Prep

**Option A - Direct scrape (Simple):**
```python
import requests

# Scrape metrics
response = requests.get('http://localhost:5000/metrics')
metrics = response.text

# Parse and use in your pipeline
# Each metric is in format: metric_name{labels} value
```

**Option B - With Prometheus (Advanced):**
```python
import requests

# Query Prometheus API
url = 'http://localhost:9090/api/v1/query'
query = 'hypernova_login_failures_total'
response = requests.get(url, params={'query': query})
data = response.json()

# Use in IBM Data Prep pipeline
```

---

## 📊 Metrics Data Format

### Prometheus Text Format (from /metrics)
```
hypernova_login_failures_total{reason="invalid_credentials",env="development"} 15
hypernova_login_failures_total{reason="email_not_confirmed",env="development"} 3
hypernova_auth_attempts_total{status="failure",type="login",env="development"} 18
hypernova_auth_attempts_total{status="success",type="login",env="development"} 45
```

### Prometheus API JSON Format
```json
{
  "status": "success",
  "data": {
    "resultType": "vector",
    "result": [
      {
        "metric": {
          "__name__": "hypernova_login_failures_total",
          "reason": "invalid_credentials",
          "env": "development"
        },
        "value": [1730678400, "15"]
      }
    ]
  }
}
```

---

## ✅ Current Status

### Working Now:
- ✅ Backend tracking all login failures
- ✅ Detailed error reasons captured
- ✅ Metrics exposed at /metrics endpoint
- ✅ Prometheus format ready
- ✅ Can be scraped by IBM Data Prep Kit

### Next Steps:
1. ✅ **Test now** - Try failed logins and check metrics
2. 🔄 **Optional** - Set up Prometheus for historical data
3. 🔄 **Optional** - Set up Grafana for visualization
4. ✅ **Ready** - Integrate with IBM Data Prep Kit

---

## 🚀 Quick Test Commands

```powershell
# 1. Check backend is running
curl http://localhost:5000/metrics/health

# 2. View all metrics
curl http://localhost:5000/metrics

# 3. Filter login failures
curl http://localhost:5000/metrics | Select-String "login_failures"

# 4. Count failed logins
curl http://localhost:5000/metrics | Select-String "login_failures_total"
```

---

**You're ready to track and export login failures to IBM Data Prep Kit!** 🎉
