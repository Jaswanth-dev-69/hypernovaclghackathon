# 📋 COMPLETE PROJECT COMMAND LIST

## 🚀 MASTER COMMAND (Use This!)
```powershell
cd J:\hypernovahackathon
.\START_ALL_SERVICES.ps1
```
**This starts everything automatically!**

---

## 🔧 BACKEND (Port 5000)

### Start
```powershell
cd J:\hypernovahackathon\backend
npm run dev
```

### Test
```powershell
# Health check
curl http://localhost:5000/health

# Test Google Sheets
node test-sheets-integration.js

# Trigger metrics
curl http://localhost:5000/api/log-metrics
```

---

## 🎨 FRONTEND (Port 3000)

### Start
```powershell
cd J:\hypernovahackathon\frontend
npm run dev
```

### Access
- Home: http://localhost:3000
- Shop: http://localhost:3000/shop
- Cart: http://localhost:3000/cart

---

## 📊 STREAMLIT DASHBOARD (Port 8501)

### Start
```powershell
cd J:\hypernovahackathon\streamlit-dashboard
python -m streamlit run app.py
```

### Access
- Dashboard: http://localhost:8501
- Features: Real-time data, dark mode, auto-refresh

---

## 📄 GOOGLE SHEETS EXPORT

### Export to CSV
```powershell
cd J:\hypernovahackathon\sheet-to-csv
npm run fetch
```

### Output
Files created in `sheet-to-csv/data/`:
- api_requests.csv (490 rows)
- errors.csv (27 rows)
- metrics.csv (9,987 rows)
- authentication.csv (23 rows)
- cart_operations.csv (29 rows)

---

## 🌐 ALL URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000 |
| Dashboard | http://localhost:8501 |
| Health | http://localhost:5000/health |
| Metrics | http://localhost:5000/metrics |
| Google Sheet | [Open Sheet](https://docs.google.com/spreadsheets/d/1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E/edit) |

---

## 🛑 STOP ALL

Press `Ctrl+C` in each terminal window

---

## 🐛 QUICK FIXES

### Port Already in Use
```powershell
# Find process
netstat -ano | findstr :5000  # or :3000 or :8501

# Kill process
Stop-Process -Id <PID> -Force
```

### Reinstall Dependencies
```powershell
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# Streamlit
cd streamlit-dashboard && pip install -r requirements.txt
```

---

**Full Documentation:** `COMMANDS_REFERENCE.md`
