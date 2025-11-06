# 📊 Power BI Integration - COMPLETE SETUP

## ✅ **DATA SUCCESSFULLY EXPORTED!**

### 📈 Export Summary
```
✅ APIRequests: 490 rows → data/api_requests.csv
✅ Errors: 27 rows → data/errors.csv
✅ Metrics: 9,987 rows → data/metrics.csv
✅ Authentication: 23 rows → data/authentication.csv
✅ CartOperations: 29 rows → data/cart_operations.csv

🎉 Total: 10,556 rows ready for Power BI visualization!
```

---

## 🚀 **QUICK START (5 MINUTES)**

### Step 1: Open Power BI Desktop
1. Launch **Power BI Desktop**
2. If not installed, download: https://aka.ms/pbidesktop

### Step 2: Import CSV Files

**2.1 - Import API Requests**
```
1. Click "Get Data" → "Text/CSV"
2. Navigate to: J:\hypernovahackathon\sheet-to-csv\data\
3. Select: api_requests.csv
4. Click "Load"
```

**2.2 - Import Errors**
```
1. Click "Get Data" → "Text/CSV"
2. Select: errors.csv
3. Click "Load"
```

**2.3 - Import Metrics**
```
1. Click "Get Data" → "Text/CSV"
2. Select: metrics.csv
3. Click "Load"
```

### Step 3: Transform Data

**Click "Transform Data" and apply these changes:**

#### For ALL Tables:
1. Convert `Timestamp` column:
   - Select Timestamp column
   - Right-click → Change Type → Date/Time

#### For api_requests:
2. Convert `StatusCode` to number
3. Convert `Duration` to decimal number

#### For metrics:
4. Convert `Value` to decimal number

**Click "Close & Apply"**

---

## 📊 **VISUALIZATIONS TO CREATE**

### Dashboard 1: API Performance

**Visual 1: API Request Trend (Line Chart)**
```
X-axis: Timestamp (Date Hierarchy)
Y-axis: Count of Path
Legend: Method
```

**Visual 2: Response Time by Endpoint (Bar Chart)**
```
Axis: Path
Values: Average of Duration
```

**Visual 3: Status Code Distribution (Pie Chart)**
```
Legend: StatusCode
Values: Count of StatusCode
```

**Visual 4: Top 10 Slowest Endpoints (Table)**
```
Columns: Path, Average Duration, Count
Sort by: Average Duration (Descending)
```

---

### Dashboard 2: Error Analysis

**Visual 1: Error Trend Over Time (Line Chart)**
```
X-axis: Timestamp (Date Hierarchy)
Y-axis: Count of Type
Legend: Type
```

**Visual 2: Top Error Types (Bar Chart)**
```
Axis: Type
Values: Count of Type
```

**Visual 3: Errors by Endpoint (Treemap)**
```
Group: Endpoint
Values: Count
Colors: By count
```

**Visual 4: Recent Errors (Table)**
```
Columns: Timestamp, Type, Message, Endpoint
Sort by: Timestamp (Descending)
Filter: Top 20
```

---

### Dashboard 3: System Metrics

**Visual 1: Metric Trends (Line Chart with Multiple Lines)**
```
X-axis: Timestamp
Y-axis: Value
Legend: MetricName
Filter: Select key metrics:
  - hypernova_http_requests_total
  - process_cpu_user_seconds_total
  - process_resident_memory_bytes
  - nodejs_eventloop_lag_seconds
```

**Visual 2: Current Metrics Snapshot (Cards)**
```
Create 4 Cards:
1. Total HTTP Requests
   - Metric: hypernova_http_requests_total (Max)
   
2. Active Connections
   - Metric: hypernova_active_connections (Max)
   
3. CPU Usage
   - Metric: process_cpu_user_seconds_total (Max)
   
4. Memory Usage (MB)
   - Metric: process_resident_memory_bytes (Max ÷ 1048576)
```

**Visual 3: Metrics by Type (Donut Chart)**
```
Legend: MetricType
Values: Count of MetricName
```

**Visual 4: Environment Breakdown (Stacked Bar)**
```
Axis: Environment
Values: Count of MetricName
Legend: MetricType
```

---

## 🎨 **POWER BI QUICK STEPS**

### 1. Create Your First Visual (API Requests Over Time)

```
1. Click blank area on canvas
2. Select "Line Chart" from Visualizations pane
3. Drag "Timestamp" to X-axis
4. Drag "Path" to Y-axis (it will show "Count of Path")
5. Drag "Method" to Legend
6. Format:
   - Title: "API Requests Over Time"
   - X-axis: Show title "Time"
   - Y-axis: Show title "Request Count"
```

### 2. Add Filters

```
1. Click visual
2. In "Filters" pane, drag fields:
   - Timestamp → set date range
   - StatusCode → select 200, 400, 500
   - Method → select GET, POST, PUT, DELETE
```

### 3. Add Slicers (Interactive Filters)

```
1. Click blank area
2. Select "Slicer" from Visualizations
3. Drag "Timestamp" to Field
4. Convert to date range slider:
   - Click slicer → Format → Slider: On
```

---

## 🎯 **RECOMMENDED DASHBOARDS**

### Dashboard 1: Executive Overview
```
1. Total API Requests (Card)
2. Average Response Time (Card)
3. Error Rate % (Card)
4. Active Users (Card)
5. Request Trend (Line Chart)
6. Status Code Distribution (Pie Chart)
7. Top Endpoints (Table)
```

### Dashboard 2: Error Monitoring
```
1. Total Errors (Card)
2. Error Rate (Card)
3. Error Trend (Line Chart)
4. Top Error Types (Bar Chart)
5. Errors by Endpoint (Treemap)
6. Recent Errors (Table with full details)
```

### Dashboard 3: Performance Metrics
```
1. CPU Usage (Gauge)
2. Memory Usage (Gauge)
3. Event Loop Lag (Gauge)
4. HTTP Request Duration (Line Chart)
5. Metrics Heatmap (Matrix)
6. System Health Score (KPI)
```

---

## 🔄 **REFRESH DATA**

### Manual Refresh:
```powershell
cd J:\hypernovahackathon\sheet-to-csv
npm run fetch
```

Then in Power BI: Click **"Refresh"** button

### Auto-Refresh (Windows Task Scheduler):
```powershell
# Create scheduled task
$action = New-ScheduledTaskAction -Execute "npm" -Argument "run fetch" -WorkingDirectory "J:\hypernovahackathon\sheet-to-csv"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 15)
Register-ScheduledTask -TaskName "PowerBI-SheetSync" -Action $action -Trigger $trigger
```

---

## 📐 **DATA RELATIONSHIPS**

Create relationships between tables:

```
1. Go to "Model" view (left sidebar)
2. Drag to create relationships:
   - api_requests[UserID] → authentication[Email]
   - api_requests[UserID] → cart_operations[UserID]
   - errors[UserID] → authentication[Email]
```

---

## 🎨 **FORMATTING TIPS**

### Colors:
```
Success (200): Green #28A745
Client Error (400): Orange #FFC107
Server Error (500): Red #DC3545
```

### Conditional Formatting:
```
For Duration column:
- < 0.1s: Green
- 0.1s - 0.5s: Yellow
- > 0.5s: Red
```

---

## 📊 **SAMPLE DAX MEASURES**

### Error Rate:
```dax
Error Rate % = 
DIVIDE(
    COUNTROWS(FILTER(api_requests, api_requests[StatusCode] >= 400)),
    COUNTROWS(api_requests),
    0
) * 100
```

### Average Response Time:
```dax
Avg Response Time = 
AVERAGE(api_requests[Duration])
```

### Success Rate:
```dax
Success Rate % = 
DIVIDE(
    COUNTROWS(FILTER(api_requests, api_requests[StatusCode] = 200)),
    COUNTROWS(api_requests),
    0
) * 100
```

### Total Active Users:
```dax
Active Users = 
DISTINCTCOUNT(api_requests[UserID])
```

---

## 🚀 **NEXT LEVEL: Publish to Power BI Service**

1. Click "Publish" in Power BI Desktop
2. Sign in with Microsoft account
3. Select workspace
4. Configure scheduled refresh:
   - Settings → Datasets → Schedule refresh
   - Set to run every 15 minutes
   - Or use On-Premises Data Gateway for real-time

---

## ✅ **CHECKLIST**

- [x] Data exported (10,556 rows)
- [ ] Power BI Desktop installed
- [ ] CSV files imported
- [ ] Timestamp columns converted to DateTime
- [ ] Numeric columns converted
- [ ] Relationships created
- [ ] First visual created (API trend)
- [ ] Dashboard formatted
- [ ] Filters added
- [ ] Published to Power BI Service (optional)

---

## 🎯 **YOUR DATA IS READY!**

**Location:** `J:\hypernovahackathon\sheet-to-csv\data\`

**Files:**
```
✅ api_requests.csv (490 rows)
✅ errors.csv (27 rows)
✅ metrics.csv (9,987 rows)
✅ authentication.csv (23 rows)
✅ cart_operations.csv (29 rows)
```

**Now open Power BI and start visualizing!** 🎨📊

**Need help?** All data is clean and ready to import. Just follow Step 1-3 above!
