# 📊 Google Sheets Integration Setup Guide

## ✅ What We Did

1. ✅ Commented out all Prometheus/Grafana code
2. ✅ Created Google Sheets Logger (`backend/src/utils/googleSheetsLogger.js`)
3. ✅ Integrated logging into Auth Controller (signup, login)
4. ✅ Integrated logging into Cart Controller (add, update, remove)
5. ✅ Integrated logging into Server (API requests)
6. ✅ Installed `googleapis` package
7. ✅ Pushed all changes to GitHub

---

## 📋 PART 2: Google Cloud Console Setup (15 minutes)

Follow these steps **EXACTLY**:

### Step 1: Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click **"Select a project"** (top left, next to Google Cloud logo)
3. Click **"NEW PROJECT"**
4. Enter:
   - **Project name:** `hypernova-metrics`
   - **Location:** No organization
5. Click **"CREATE"**
6. Wait 30 seconds, then click **"SELECT PROJECT"**

---

### Step 2: Enable Google Sheets API

1. In your project, click **"APIs & Services"** (left sidebar)
2. Click **"+ ENABLE APIS AND SERVICES"** (top blue button)
3. Search for: **"Google Sheets API"**
4. Click on **"Google Sheets API"**
5. Click **"ENABLE"**
6. Wait for it to enable (10 seconds)

---

### Step 3: Create Service Account

1. Click **"Credentials"** (left sidebar)
2. Click **"+ CREATE CREDENTIALS"** (top)
3. Select **"Service Account"**
4. Fill in:
   - **Service account name:** `hypernova-sheets-logger`
   - **Service account ID:** (auto-filled)
   - **Description:** `Logs metrics to Google Sheets for IBM Data Prep Kit`
5. Click **"CREATE AND CONTINUE"**
6. **Role:** Select **"Editor"** (from dropdown)
7. Click **"CONTINUE"**
8. Click **"DONE"** (skip the 3rd step)

---

### Step 4: Generate Service Account Key (JSON)

1. You'll see your service account in the list
2. Click on the **email address** (looks like: `hypernova-sheets-logger@hypernova-metrics.iam.gserviceaccount.com`)
3. Click **"KEYS"** tab (at the top)
4. Click **"ADD KEY"** → **"Create new key"**
5. Select **"JSON"**
6. Click **"CREATE"**
7. ⚠️ **A JSON file will download** - SAVE THIS FILE SAFELY!
8. **DO NOT LOSE THIS FILE!** You'll need it in the next steps

---

## 📊 PART 3: Create Google Sheet (5 minutes)

### Step 1: Create New Sheet

1. Go to: https://docs.google.com/spreadsheets/
2. Click **"+ Blank"** (create new spreadsheet)
3. **Name it:** `HyperNova Metrics Dashboard`

---

### Step 2: Create Tabs (Sheets)

Create 4 tabs with these **EXACT** names:

**Tab 1: Authentication**
- Click **"+"** at bottom left
- Rename to: **`Authentication`**
- Add headers in Row 1:
  ```
  Timestamp | Type | Status | Email | IP | UserAgent | Reason
  ```

**Tab 2: CartOperations**
- Click **"+"** again
- Rename to: **`CartOperations`**
- Add headers in Row 1:
  ```
  Timestamp | Operation | Status | UserID | ProductID | Quantity | ItemCount | TotalValue
  ```

**Tab 3: APIRequests**
- Click **"+"** again
- Rename to: **`APIRequests`**
- Add headers in Row 1:
  ```
  Timestamp | Method | Path | StatusCode | Duration | UserID
  ```

**Tab 4: Errors**
- Click **"+"** again
- Rename to: **`Errors`**
- Add headers in Row 1:
  ```
  Timestamp | Type | Message | Stack | Endpoint | UserID
  ```

---

### Step 3: Get Spreadsheet ID

1. Look at the URL in your browser:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
2. **Copy the long ID** between `/d/` and `/edit`
3. Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
4. **Save this ID** - you'll need it!

---

### Step 4: Share Sheet with Service Account

1. Click **"Share"** button (top right)
2. **Paste the service account email** (from Step 3 earlier):
   - Example: `hypernova-sheets-logger@hypernova-metrics.iam.gserviceaccount.com`
3. Change role to **"Editor"**
4. **UNCHECK** "Notify people" (it's a bot, not a person!)
5. Click **"Share"** or **"Send"**

✅ **Done!** Your sheet is now ready to receive data!

---

## 🔐 PART 4: Add Credentials to Render (10 minutes)

Now we need to add the Google credentials to your backend on Render.

### Step 1: Prepare the JSON Key

1. **Open the JSON file** you downloaded in Part 2, Step 4
2. **Copy the ENTIRE contents** (all the JSON)
3. It should look like:
   ```json
   {
     "type": "service_account",
     "project_id": "hypernova-metrics",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "hypernova-sheets-logger@hypernova-metrics.iam.gserviceaccount.com",
     ...
   }
   ```

---

### Step 2: Add to Render Environment Variables

1. Go to: https://dashboard.render.com
2. Click on your **"hypernova-backend"** service
3. Click **"Environment"** (left sidebar)
4. Click **"Add Environment Variable"**

**Add Variable 1:**
```
Key: GOOGLE_SHEETS_ID
Value: [paste your Spreadsheet ID from Part 3, Step 3]
```

**Add Variable 2:**
```
Key: GOOGLE_SERVICE_ACCOUNT_KEY
Value: [paste the ENTIRE JSON content from Step 1 above]
```

⚠️ **IMPORTANT:** Make sure the JSON is on ONE LINE or Render might have issues!

5. Click **"Save Changes"**
6. **Wait 3-5 minutes** for Render to redeploy with new variables

---

## 🧪 PART 5: Test It! (5 minutes)

### Step 1: Wait for Deployment

1. Watch the Render dashboard
2. Wait for: **"Your service is live 🎉"**

---

### Step 2: Test Health Endpoint

```powershell
Invoke-RestMethod https://hypernova-backend-azgf.onrender.com/health
```

**Should show:**
```json
{
  "status": "healthy",
  "logging": "Google Sheets"
}
```

---

### Step 3: Generate Test Data

```powershell
# Test failed login (will log to Google Sheets!)
$body = @{
  email = 'test@example.com'
  password = 'wrongpassword'
} | ConvertTo-Json

Invoke-RestMethod -Uri https://hypernova-backend-azgf.onrender.com/api/auth/login -Method POST -Body $body -ContentType 'application/json' -ErrorAction SilentlyContinue
```

---

### Step 4: Check Google Sheets!

1. Go back to your Google Sheet
2. Click on **"Authentication"** tab
3. **Refresh the page** (F5)
4. You should see a new row with:
   - Timestamp
   - Type: login
   - Status: failure
   - Email: test@example.com
   - Reason: invalid_credentials

✅ **IT'S WORKING!**

---

## 📤 PART 6: Export to CSV for IBM Data Prep Kit

### Option 1: Manual Export

1. Go to your Google Sheet
2. Click **File** → **Download** → **Comma Separated Values (.csv)**
3. Select which tab to export
4. Save the CSV file

### Option 2: Automated Export (Recommended)

Create this PowerShell script:

```powershell
# export-metrics.ps1
$sheetId = "YOUR_SPREADSHEET_ID_HERE"
$tabs = @("Authentication", "CartOperations", "APIRequests", "Errors")

foreach ($tab in $tabs) {
    $url = "https://docs.google.com/spreadsheets/d/$sheetId/gviz/tq?tqx=out:csv&sheet=$tab"
    $filename = "metrics_${tab}_$(Get-Date -Format 'yyyyMMdd_HHmmss').csv"
    Invoke-WebRequest -Uri $url -OutFile $filename
    Write-Host "✅ Exported: $filename"
}

Write-Host "`n🎉 All metrics exported! Ready for IBM Data Prep Kit"
```

**Run it:**
```powershell
.\export-metrics.ps1
```

---

## 🎯 What You'll Have:

After following all steps, you'll have:

✅ **Live Backend** on Render (https://hypernova-backend-azgf.onrender.com)  
✅ **Google Sheets** receiving real-time metrics from your backend  
✅ **4 CSV files** ready for IBM Data Prep Kit:
   - `metrics_Authentication_20241104.csv`
   - `metrics_CartOperations_20241104.csv`
   - `metrics_APIRequests_20241104.csv`
   - `metrics_Errors_20241104.csv`

---

## 🔄 Data Flow:

```
User Action (Login, Add to Cart, etc.)
         ↓
Backend API (Render)
         ↓
Google Sheets Logger
         ↓
Google Sheets (4 tabs with real-time data)
         ↓
Export as CSV
         ↓
IBM Data Prep Kit
         ↓
Clean & Prepare Data
         ↓
Granite LLM + RAG Model
```

---

## 📊 Metrics Being Tracked:

### Authentication Events:
- Signup attempts (success/failure)
- Login attempts (success/failure)
- Failure reasons (invalid_credentials, weak_password, etc.)
- User IP addresses
- User agents (browsers)

### Cart Operations:
- Add to cart
- Update quantity
- Remove from cart
- Clear cart
- Item counts and values

### API Requests:
- All HTTP requests
- Response codes
- Response times
- User IDs

### Errors:
- All application errors
- Stack traces
- Endpoints where errors occurred

---

## 🚨 Troubleshooting:

### "Google Sheets logging disabled"
- Check if `GOOGLE_SERVICE_ACCOUNT_KEY` is set correctly in Render
- Make sure JSON is valid (use JSON validator)
- Verify service account has Editor role

### "Permission denied" errors
- Make sure you shared the sheet with the service account email
- Check that service account has Editor permissions
- Refresh the sheet and try again

### No data appearing in sheets
- Check Render logs: https://dashboard.render.com
- Look for "📊 Logged to Authentication" messages
- Make sure tab names match EXACTLY (case-sensitive!)

### Rate limits
- Google Sheets API allows 100 requests per 100 seconds
- For high traffic, consider batching writes

---

## ✅ CHECKLIST:

Use this to track your progress:

- [ ] Created Google Cloud Project
- [ ] Enabled Google Sheets API
- [ ] Created Service Account
- [ ] Downloaded JSON key file
- [ ] Created Google Sheet with 4 tabs
- [ ] Added headers to each tab
- [ ] Copied Spreadsheet ID
- [ ] Shared sheet with service account
- [ ] Added GOOGLE_SHEETS_ID to Render
- [ ] Added GOOGLE_SERVICE_ACCOUNT_KEY to Render
- [ ] Waited for Render redeploy
- [ ] Tested health endpoint
- [ ] Generated test data
- [ ] Verified data appears in Google Sheets
- [ ] Exported CSV files

---

**Ready to start? Follow PART 2 first!** 🚀
