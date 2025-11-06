# 🚀 HYPERNOVA PROJECT - COMPLETE COMMAND REFERENCE

## 📋 TABLE OF CONTENTS
1. [Quick Start](#quick-start)
2. [Backend Commands](#backend-commands)
3. [Frontend Commands](#frontend-commands)
4. [Streamlit Dashboard Commands](#streamlit-dashboard-commands)
5. [Google Sheets Integration](#google-sheets-integration)
6. [Testing Commands](#testing-commands)
7. [Deployment Commands](#deployment-commands)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 QUICK START

### **Option 1: Start Everything at Once (RECOMMENDED)**

```powershell
# Navigate to project root
cd J:\hypernovahackathon

# Run the master startup script
.\START_ALL_SERVICES.ps1
```

This will open 3 windows:
- ✅ Backend Server (Port 5000)
- ✅ Frontend App (Port 3000)
- ✅ Streamlit Dashboard (Port 8501)

### **Option 2: Manual Startup (Individual Services)**

See sections below for individual commands.

---

## 🔧 BACKEND COMMANDS

### **Location:** `J:\hypernovahackathon\backend`

### **Start Backend Server**
```powershell
cd J:\hypernovahackathon\backend
npm run dev
```
- **URL:** http://localhost:5000
- **Features:** REST API, Google Sheets Logging, Prometheus Metrics

### **Check Backend Health**
```powershell
curl http://localhost:5000/health
```
Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-06T...",
  "uptime": 123.45,
  "database": "connected",
  "logging": "Google Sheets"
}
```

### **View Prometheus Metrics**
```powershell
curl http://localhost:5000/metrics
```
Or open in browser: http://localhost:5000/metrics

### **Test Google Sheets Logging**
```powershell
# Test authentication logging
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{}'

# Check Google Sheet "Authentication" tab for new row

# Test error logging
curl http://localhost:5000/api/nonexistent

# Check Google Sheet "Errors" tab for new row

# Trigger metrics logging
curl http://localhost:5000/api/log-metrics

# Check Google Sheet "Metrics" tab for 69+ new rows
```

### **Backend Environment Variables**
Located in: `backend/.env`
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_key
GOOGLE_SHEETS_SPREADSHEET_ID=1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

---

## 🎨 FRONTEND COMMANDS

### **Location:** `J:\hypernovahackathon\frontend`

### **Start Frontend Development Server**
```powershell
cd J:\hypernovahackathon\frontend
npm run dev
```
- **URL:** http://localhost:3000
- **Features:** Next.js 14, Shopping Cart, Authentication, Product Catalog

### **Build for Production**
```powershell
cd J:\hypernovahackathon\frontend
npm run build
```

### **Start Production Server**
```powershell
cd J:\hypernovahackathon\frontend
npm start
```

### **Run Linting**
```powershell
cd J:\hypernovahackathon\frontend
npm run lint
```

### **Frontend Environment Variables**
Located in: `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### **Available Pages**
- **Home:** http://localhost:3000
- **Shop:** http://localhost:3000/shop
- **Cart:** http://localhost:3000/cart
- **Login:** http://localhost:3000/login
- **Signup:** http://localhost:3000/signup
- **Product Details:** http://localhost:3000/products/[id]

---

## 📊 STREAMLIT DASHBOARD COMMANDS

### **Location:** `J:\hypernovahackathon\streamlit-dashboard`

### **Start Streamlit Dashboard**
```powershell
cd J:\hypernovahackathon\streamlit-dashboard
python -m streamlit run app.py
```
- **URL:** http://localhost:8501
- **Features:** Real-time Google Sheets data, Interactive charts, Dark mode

### **Alternative Start Methods**
```powershell
# Method 1: Using streamlit command directly
cd J:\hypernovahackathon\streamlit-dashboard
streamlit run app.py

# Method 2: With custom port
python -m streamlit run app.py --server.port 8502

# Method 3: With full path
python -m streamlit run "J:\hypernovahackathon\streamlit-dashboard\app.py"
```

### **Streamlit Configuration**
Located in: `streamlit-dashboard/.streamlit/config.toml` (create if needed)
```toml
[server]
port = 8501
headless = true

[browser]
gatherUsageStats = false

[theme]
base = "dark"
primaryColor = "#667eea"
```

### **Dashboard Features**
- 📊 **Key Metrics:** Total requests, errors, response time, success rate
- 📈 **API Performance:** Request trends, method distribution, response times
- ❌ **Error Analysis:** Error types, trends, recent errors table
- 📉 **Metrics:** System metrics visualization with selector
- 🔄 **Auto-Refresh:** Every 5 minutes (configurable)

### **Force Refresh Data**
Click the "🔄 Refresh" button in the dashboard UI

---

## 📄 GOOGLE SHEETS INTEGRATION

### **Sheet Details**
- **Spreadsheet ID:** `1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E`
- **Sheet Name:** HyperNova Metrics Dashboard
- **URL:** https://docs.google.com/spreadsheets/d/1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E/edit

### **5 Tabs**
1. **Authentication** (7 columns): Timestamp, Type, Status, Email, IP, UserAgent, Reason
2. **CartOperations** (7 columns): Timestamp, Operation, Status, UserID, ProductID, Quantity, ItemCount
3. **APIRequests** (6 columns): Timestamp, Method, Path, StatusCode, Duration, UserID
4. **Errors** (6 columns): Timestamp, Type, Message, Stack, Endpoint, UserID
5. **Metrics** (8 columns): Timestamp, MetricName, MetricType, Value, Labels, Help, Environment, NodeVersion

### **Service Accounts**
1. **Backend Logging:** `metrics-writer@apple-477216.iam.gserviceaccount.com`
   - Location: `backend/service-account.json`
   - Permissions: Write to Google Sheets

2. **Dashboard Reading:** `powerbi-sheet-reader@apple-477216.iam.gserviceaccount.com`
   - Location: `streamlit-dashboard/service-account.json`
   - Permissions: Read from Google Sheets

### **Export to CSV (for Power BI)**
```powershell
cd J:\hypernovahackathon\sheet-to-csv
npm run fetch
```
Exports to: `sheet-to-csv/data/` folder
- api_requests.csv (490 rows)
- errors.csv (27 rows)
- metrics.csv (9,987 rows)
- authentication.csv (23 rows)
- cart_operations.csv (29 rows)

### **Verify Google Sheets Connection**
```powershell
# From backend
cd J:\hypernovahackathon\backend
node -e "const { getSheets } = require('./src/utils/googleSheetsLogger'); getSheets().then(() => console.log('✅ Connected'));"

# From Streamlit dashboard
cd J:\hypernovahackathon\streamlit-dashboard
python -c "from app import get_sheets_data; print('✅ Connected')"
```

---

## 🧪 TESTING COMMANDS

### **Test Backend API Endpoints**

```powershell
# Health check
curl http://localhost:5000/health

# Get all products
curl http://localhost:5000/api/products

# Authentication endpoints
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test123","name":"Test User"}'

curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test123"}'

# Cart endpoints (requires authentication token)
curl http://localhost:5000/api/cart -H "Authorization: Bearer YOUR_TOKEN"

# Metrics
curl http://localhost:5000/metrics

# Trigger metrics logging to Google Sheets
curl http://localhost:5000/api/log-metrics
```

### **Test Google Sheets Integration**

```powershell
cd J:\hypernovahackathon\backend
node test-sheets-integration.js
```

Expected output:
```
🧪 Testing Google Sheets Integration...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  Testing Authentication Logging...
✅ Authentication logged successfully

2️⃣  Testing Cart Operation Logging...
✅ Cart operation logged successfully

3️⃣  Testing API Request Logging...
✅ API request logged successfully

... (more tests)

✅ ALL TESTS PASSED!
```

### **Test CSV Export**

```powershell
cd J:\hypernovahackathon\sheet-to-csv
npm run fetch
```

Verify files created in `data/` folder.

---

## 🚀 DEPLOYMENT COMMANDS

### **Backend Deployment (Render)**

```bash
# Already deployed!
Production URL: https://hypernova-backend-7zxi.onrender.com

# Check deployment status
curl https://hypernova-backend-7zxi.onrender.com/health
```

### **Frontend Deployment (Render)**

```bash
# Already deployed!
Production URL: https://hypernova-frontend.onrender.com

# Access in browser
start https://hypernova-frontend.onrender.com
```

### **Deploy Streamlit Dashboard (Streamlit Cloud)**

1. **Push to GitHub:**
```powershell
cd J:\hypernovahackathon
git add streamlit-dashboard/
git commit -m "Add Streamlit dashboard"
git push origin master
```

2. **Deploy on Streamlit Cloud:**
   - Go to: https://share.streamlit.io
   - Click "New app"
   - Select repository: `Jaswanth-dev-69/hypernovaclghackathon`
   - Main file: `streamlit-dashboard/app.py`
   - Add secrets (service-account.json content)
   - Deploy!

### **Git Commands**

```powershell
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your message here"

# Push to GitHub
git push origin master

# Pull latest changes
git pull origin master

# View commit history
git log --oneline -10
```

---

## 🐛 TROUBLESHOOTING

### **Backend Issues**

**Problem:** Backend won't start
```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process using port 5000
Stop-Process -Id <PID> -Force

# Reinstall dependencies
cd J:\hypernovahackathon\backend
Remove-Item node_modules -Recurse -Force
npm install
```

**Problem:** Google Sheets not logging
```powershell
# Verify service account file exists
Test-Path "J:\hypernovahackathon\backend\service-account.json"

# Check environment variables
cd J:\hypernovahackathon\backend
cat .env

# Test connection
node test-sheets-integration.js
```

**Problem:** Supabase connection failed
- Verify `.env` has correct `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Check Supabase dashboard: https://supabase.com/dashboard

---

### **Frontend Issues**

**Problem:** Frontend won't start
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process
Stop-Process -Id <PID> -Force

# Clear Next.js cache
cd J:\hypernovahackathon\frontend
Remove-Item .next -Recurse -Force
npm run dev
```

**Problem:** API calls failing
- Ensure backend is running on port 5000
- Check `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000`
- Check browser console for CORS errors

---

### **Streamlit Dashboard Issues**

**Problem:** Dashboard won't start
```powershell
# Install/reinstall dependencies
cd J:\hypernovahackathon\streamlit-dashboard
pip install -r requirements.txt

# Try alternative start method
python -m streamlit run app.py

# Check if port 8501 is in use
netstat -ano | findstr :8501
```

**Problem:** No data showing
```powershell
# Verify service account exists
Test-Path "J:\hypernovahackathon\streamlit-dashboard\service-account.json"

# Check if it's the same as sheet-to-csv
Compare-Object (Get-Content "streamlit-dashboard\service-account.json") (Get-Content "sheet-to-csv\service-account.json")

# Copy if different
Copy-Item "sheet-to-csv\service-account.json" "streamlit-dashboard\service-account.json" -Force
```

**Problem:** Text not readable
- Dashboard now uses **dark mode** with **white text**
- If still having issues, press `Ctrl+Shift+R` to hard refresh

---

### **Google Sheets Issues**

**Problem:** Permission denied
- Verify service account email has Editor access to the sheet
- Share sheet with: `metrics-writer@apple-477216.iam.gserviceaccount.com`
- Share sheet with: `powerbi-sheet-reader@apple-477216.iam.gserviceaccount.com`

**Problem:** Data not appearing
- Check if backend is running and logging
- Manually trigger: `curl http://localhost:5000/api/log-metrics`
- Check sheet directly: https://docs.google.com/spreadsheets/d/1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E/edit

---

## 📚 ADDITIONAL RESOURCES

### **Documentation Files**
- `SETUP_COMPLETE.md` - Initial setup guide
- `AUTHENTICATION_SETUP_COMPLETE.md` - Auth implementation
- `CART_SETUP_GUIDE.md` - Shopping cart setup
- `POWER_BI_GUIDE.md` - Power BI visualization guide
- `sheet-to-csv/README.md` - CSV export documentation

### **Configuration Files**
- `backend/.env` - Backend environment variables
- `frontend/.env.local` - Frontend environment variables
- `backend/package.json` - Backend dependencies & scripts
- `frontend/package.json` - Frontend dependencies & scripts
- `streamlit-dashboard/requirements.txt` - Python dependencies

### **Important URLs**
- **Google Sheet:** https://docs.google.com/spreadsheets/d/1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E/edit
- **GitHub Repo:** https://github.com/Jaswanth-dev-69/hypernovaclghackathon
- **Backend (Production):** https://hypernova-backend-7zxi.onrender.com
- **Frontend (Production):** https://hypernova-frontend.onrender.com

---

## 🎯 QUICK REFERENCE

### **Start All Services**
```powershell
.\START_ALL_SERVICES.ps1
```

### **Individual Services**
```powershell
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Streamlit Dashboard
cd streamlit-dashboard && python -m streamlit run app.py

# Export CSV from Google Sheets
cd sheet-to-csv && npm run fetch
```

### **URLs**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Dashboard: http://localhost:8501
- Health: http://localhost:5000/health
- Metrics: http://localhost:5000/metrics

### **Stop Services**
Press `Ctrl+C` in each terminal window

---

**Last Updated:** November 6, 2025  
**Project:** HyperNova E-Commerce Platform  
**Developer:** Jaswanth
