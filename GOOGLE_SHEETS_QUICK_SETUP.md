# 🚀 Quick Google Sheets Setup

**Your Spreadsheet ID:** `1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E`

**Your Sheet URL:** https://docs.google.com/spreadsheets/d/1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E/edit

---

## ❌ You DON'T Need Apps Script!

The backend writes directly to Google Sheets using the API. **No Apps Script code needed!**

---

## ✅ What You Need to Do:

### Step 1: Create 4 Tabs in Your Google Sheet

Open your sheet and create these **EXACT** tab names:

1. **`Authentication`** - Add this header row:
   ```
   Timestamp | Type | Status | Email | IP | UserAgent | Reason
   ```

2. **`CartOperations`** - Add this header row:
   ```
   Timestamp | Operation | Status | UserID | ProductID | Quantity | ItemCount | TotalValue
   ```

3. **`APIRequests`** - Add this header row:
   ```
   Timestamp | Method | Path | StatusCode | Duration | UserID
   ```

4. **`Errors`** - Add this header row:
   ```
   Timestamp | Type | Message | Stack | Endpoint | UserID
   ```

---

### Step 2: Get Your Service Account Email

You need to complete the Google Cloud Console setup from the main guide:

1. Go to: https://console.cloud.google.com/
2. Create project: **"hypernova-metrics"**
3. Enable **Google Sheets API**
4. Create **Service Account** named: **"hypernova-sheets-logger"**
5. Download the **JSON key file**
6. **Copy the service account email** from the JSON file (it looks like):
   ```
   hypernova-sheets-logger@hypernova-metrics.iam.gserviceaccount.com
   ```

---

### Step 3: Share Your Google Sheet

1. Open your sheet: https://docs.google.com/spreadsheets/d/1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E/edit
2. Click **"Share"** (top right)
3. Paste the **service account email** from Step 2
4. Set permission to **"Editor"**
5. **Uncheck** "Notify people"
6. Click **"Share"**

---

### Step 4: Add Environment Variables to Render

1. Go to: https://dashboard.render.com
2. Click your **"hypernova-backend"** service
3. Click **"Environment"** (left sidebar)
4. Add these 2 variables:

**Variable 1:**
```
Key: GOOGLE_SHEETS_ID
Value: 1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E
```

**Variable 2:**
```
Key: GOOGLE_SERVICE_ACCOUNT_KEY
Value: [Paste the ENTIRE JSON content from your downloaded key file]
```

Example JSON format:
```json
{"type":"service_account","project_id":"hypernova-metrics","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"hypernova-sheets-logger@hypernova-metrics.iam.gserviceaccount.com",...}
```

5. Click **"Save Changes"**
6. Wait 3-5 minutes for redeploy

---

### Step 5: Test It!

After Render redeploys, test with PowerShell:

```powershell
# Test failed login (will log to your sheet!)
$body = @{
  email = 'test@example.com'
  password = 'wrongpassword'
} | ConvertTo-Json

Invoke-RestMethod -Uri https://hypernova-backend-azgf.onrender.com/api/auth/login -Method POST -Body $body -ContentType 'application/json' -ErrorAction SilentlyContinue
```

Then check your Google Sheet → **Authentication** tab → You should see a new row!

---

## 📊 How It Works:

```
User Action (Login, Signup, Add to Cart)
         ↓
Backend API (your Express.js server)
         ↓
googleSheetsLogger.js (writes via Google Sheets API)
         ↓
Your Google Sheet (real-time updates!)
         ↓
Export as CSV
         ↓
IBM Data Prep Kit
```

**No Apps Script needed!** Everything happens from the backend using the Google Sheets API.

---

## 🔍 What Each Tab Will Track:

### Authentication Tab:
- Every login attempt (success/failure)
- Every signup attempt
- IP addresses
- Browser info
- Failure reasons (wrong password, weak password, etc.)

### CartOperations Tab:
- Add to cart
- Update quantity
- Remove from cart
- Product IDs and quantities

### APIRequests Tab:
- All HTTP requests to your API
- Response times
- Status codes

### Errors Tab:
- All application errors
- Stack traces
- Which endpoint failed

---

## ✅ Checklist:

- [ ] Created 4 tabs with correct names
- [ ] Added header rows to each tab
- [ ] Completed Google Cloud Console setup
- [ ] Downloaded JSON key file
- [ ] Shared sheet with service account email
- [ ] Added GOOGLE_SHEETS_ID to Render
- [ ] Added GOOGLE_SERVICE_ACCOUNT_KEY to Render
- [ ] Waited for Render to redeploy
- [ ] Tested and verified data appears in sheet

---

**Need the full Google Cloud setup steps?** See: `GOOGLE_SHEETS_SETUP_GUIDE.md`
