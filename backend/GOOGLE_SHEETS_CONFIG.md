# Google Sheets Configuration

## Spreadsheet ID
```
1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E
```

## Spreadsheet URL
```
https://docs.google.com/spreadsheets/d/1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E/edit
```

## Required Environment Variables

Add these to your Render.com dashboard:

```env
GOOGLE_SHEETS_ID=1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

## Required Tabs (Sheet Names)

Your Google Sheet must have these exact tab names:

1. **Authentication** - Tracks login/signup attempts
2. **CartOperations** - Tracks shopping cart actions
3. **APIRequests** - Tracks all API calls
4. **Errors** - Tracks application errors

## Required Permissions

Share your Google Sheet with the service account email (Editor access):
```
hypernova-sheets-logger@hypernova-metrics.iam.gserviceaccount.com
```
(Replace with your actual service account email from Google Cloud Console)

## Testing

After setup, test with:

```powershell
# Health check (should show "logging": "Google Sheets")
Invoke-RestMethod https://hypernova-backend-azgf.onrender.com/health

# Generate test log
$body = @{ email = 'test@test.com'; password = 'wrong' } | ConvertTo-Json
Invoke-RestMethod -Uri https://hypernova-backend-azgf.onrender.com/api/auth/login -Method POST -Body $body -ContentType 'application/json' -ErrorAction SilentlyContinue
```

Then check your Google Sheet's Authentication tab for the logged attempt.
