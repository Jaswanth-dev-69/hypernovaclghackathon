# 📊 Google Sheets → Power BI Integration

Export HyperNova e-commerce monitoring data from Google Sheets to CSV files for Power BI visualization.

## ✅ Status: WORKING!

```
✅ 10,556 rows exported successfully
✅ 5 sheets processed
✅ Ready for Power BI visualization
```

---

## 🚀 Quick Start

### 1. Export Data from Google Sheets
```powershell
npm run fetch
```

**Output:**
```
✅ APIRequests: 490 rows → data/api_requests.csv
✅ Errors: 27 rows → data/errors.csv  
✅ Metrics: 9,987 rows → data/metrics.csv
✅ Authentication: 23 rows → data/authentication.csv
✅ CartOperations: 29 rows → data/cart_operations.csv
```

### 2. Open Power BI Desktop
1. Download: https://aka.ms/pbidesktop
2. Install and launch

### 3. Import CSV Files
```
Get Data → Text/CSV → Select files from data/ folder
```

### 4. Create Visualizations
See **POWER_BI_GUIDE.md** for detailed dashboard instructions!

---

## 📁 Project Structure

```
sheet-to-csv/
├── fetchSheet.js           # Main export script
├── package.json            # Node.js dependencies
├── .env                    # Configuration
├── service-account.json    # Google Service Account credentials
├── data/                   # Exported CSV files
│   ├── api_requests.csv
│   ├── errors.csv
│   ├── metrics.csv
│   ├── authentication.csv
│   └── cart_operations.csv
├── POWER_BI_GUIDE.md       # Complete Power BI tutorial
└── README.md               # This file
```

---

## 🔧 Configuration

### .env File
```env
SHEET_ID=1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E
SERVICE_ACCOUNT_JSON_PATH=./service-account.json
OUTPUT_FILE=./data/data.csv
```

### Google Sheets Structure
- **APIRequests**: HTTP request logs
- **Errors**: Error tracking
- **Metrics**: System performance metrics
- **Authentication**: Login/signup events
- **CartOperations**: Shopping cart activities

---

## 📊 Data Schema

### api_requests.csv
| Column | Type | Description |
|--------|------|-------------|
| Timestamp | DateTime | Request time |
| Method | String | GET/POST/PUT/DELETE |
| Path | String | API endpoint |
| StatusCode | Integer | HTTP status code |
| Duration | Decimal | Response time (seconds) |
| UserID | String | User identifier |

### errors.csv
| Column | Type | Description |
|--------|------|-------------|
| Timestamp | DateTime | Error time |
| Type | String | Error category |
| Message | String | Error message |
| Stack | String | Stack trace |
| Endpoint | String | Failing endpoint |
| UserID | String | Affected user |

### metrics.csv
| Column | Type | Description |
|--------|------|-------------|
| Timestamp | DateTime | Metric time |
| MetricName | String | Metric identifier |
| MetricType | String | counter/gauge/histogram |
| Value | Decimal | Metric value |
| Labels | JSON | Metric labels |
| Help | String | Metric description |
| Environment | String | dev/production |
| NodeVersion | String | Node.js version |

---

## 🔄 Refresh Data

### Manual Refresh
```powershell
npm run fetch
```

### Schedule Auto-Refresh (Windows)
```powershell
# Run every 15 minutes
$action = New-ScheduledTaskAction -Execute "npm" -Argument "run fetch" -WorkingDirectory "J:\hypernovahackathon\sheet-to-csv"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 15)
Register-ScheduledTask -TaskName "PowerBI-SheetSync" -Action $action -Trigger $trigger
```

---

## 📈 Sample Visualizations

### 1. API Performance Dashboard
- Request volume over time (Line Chart)
- Response time by endpoint (Bar Chart)  
- Status code distribution (Pie Chart)
- Slowest endpoints (Table)

### 2. Error Monitoring Dashboard
- Error trends (Line Chart)
- Top error types (Bar Chart)
- Errors by endpoint (Treemap)
- Recent errors (Table)

### 3. System Metrics Dashboard
- CPU/Memory usage (Gauges)
- Request duration (Histogram)
- Metric trends (Line Chart)
- Health score (KPI)

**See POWER_BI_GUIDE.md for complete instructions!**

---

## 🛠️ Troubleshooting

### Issue: "Service account auth failed"
**Solution:** Verify service account email has access to Google Sheet:
```
powerbi-sheet-reader@apple-477216.iam.gserviceaccount.com
```

### Issue: "No data found"
**Solution:** Check Google Sheet ID in .env:
```
SHEET_ID=1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E
```

### Issue: "CSV files empty"
**Solution:** Verify sheet names match exactly:
- APIRequests (not "API Requests")
- Errors (not "Error")
- Metrics (not "Metric")

---

## 📦 Dependencies

```json
{
  "google-spreadsheet": "^4.1.4",
  "google-auth-library": "^9.14.2",
  "csv-writer": "^1.6.0",
  "dotenv": "^16.4.7"
}
```

---

## 🎯 Next Steps

1. ✅ Export data: `npm run fetch`
2. ✅ Open Power BI Desktop
3. ✅ Import CSV files
4. ✅ Create visualizations (see POWER_BI_GUIDE.md)
5. ✅ Publish to Power BI Service (optional)

---

## 🔗 Links

- **Google Sheet:** https://docs.google.com/spreadsheets/d/1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E/edit
- **Power BI Desktop:** https://aka.ms/pbidesktop
- **Project GitHub:** https://github.com/Jaswanth-dev-69/hypernovaclghackathon

---

**Your data is ready for visualization! 📊✨**

Open Power BI Desktop and import the CSV files from `data/` folder to get started!
