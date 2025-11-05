# 📊 Google Sheets Visual Reference

This document shows **EXACTLY** what your Google Sheet should look like.

**Your Sheet:** https://docs.google.com/spreadsheets/d/1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E/edit

---

## Tab 1: Authentication

**Tab Name:** `Authentication` (case-sensitive!)

**Row 1 (Headers):**
```
| A         | B    | C      | D                   | E            | F                                    | G                          |
|-----------|------|--------|---------------------|--------------|--------------------------------------|----------------------------|
| Timestamp | Type | Status | Email               | IP           | UserAgent                            | Reason                     |
```

**Example Data (Row 2+):**
```
| 2024-11-04T10:30:45.123Z | login  | failure | john@test.com | 192.168.1.1 | Mozilla/5.0 (Windows NT 10.0; Win64) | invalid_credentials |
| 2024-11-04T10:35:20.456Z | signup | success | jane@test.com | 192.168.1.2 | Mozilla/5.0 (Macintosh; Intel Mac)   | email_confirmation_pending |
| 2024-11-04T10:40:15.789Z | login  | failure | bob@test.com  | 192.168.1.3 | Mozilla/5.0 (X11; Linux x86_64)      | email_not_confirmed |
```

---

## Tab 2: CartOperations

**Tab Name:** `CartOperations` (case-sensitive!)

**Row 1 (Headers):**
```
| A         | B          | C      | D      | E         | F        | G         | H          |
|-----------|------------|--------|--------|-----------|----------|-----------|------------|
| Timestamp | Operation  | Status | UserID | ProductID | Quantity | ItemCount | TotalValue |
```

**Example Data (Row 2+):**
```
| 2024-11-04T10:32:10.123Z | add_item  | success | user_abc123 | prod_001 | 2 | 2 | 59.98  |
| 2024-11-04T10:33:45.456Z | update    | success | user_abc123 | prod_001 | 3 | 3 | 89.97  |
| 2024-11-04T10:35:20.789Z | remove    | success | user_abc123 | prod_001 | 0 | 2 | 59.98  |
| 2024-11-04T10:40:30.012Z | clear     | success | user_abc123 |          | 0 | 0 | 0.00   |
```

---

## Tab 3: APIRequests

**Tab Name:** `APIRequests` (case-sensitive!)

**Row 1 (Headers):**
```
| A         | B      | C                  | D          | E        | F           |
|-----------|--------|--------------------|------------|----------|-------------|
| Timestamp | Method | Path               | StatusCode | Duration | UserID      |
```

**Example Data (Row 2+):**
```
| 2024-11-04T10:30:45.123Z | POST   | /api/auth/login    | 401 | 0.345 | anonymous   |
| 2024-11-04T10:32:10.456Z | POST   | /api/cart/add      | 200 | 0.123 | user_abc123 |
| 2024-11-04T10:33:20.789Z | GET    | /api/products      | 200 | 0.089 | anonymous   |
| 2024-11-04T10:35:30.012Z | PUT    | /api/cart/update   | 200 | 0.156 | user_abc123 |
```

---

## Tab 4: Errors

**Tab Name:** `Errors` (case-sensitive!)

**Row 1 (Headers):**
```
| A         | B              | C                                | D                           | E                | F           |
|-----------|----------------|----------------------------------|-----------------------------|------------------|-------------|
| Timestamp | Type           | Message                          | Stack                       | Endpoint         | UserID      |
```

**Example Data (Row 2+):**
```
| 2024-11-04T10:30:45.123Z | signup_error | Database connection failed   | Error: connect ECONNREFUSED\n at... | /api/auth/signup | unknown     |
| 2024-11-04T10:35:20.456Z | cart_error   | Product not found            | Error: Not found\n at findProduct... | /api/cart/add    | user_abc123 |
```

*(Stack traces are truncated to 500 characters)*

---

## 🎨 How to Format (Optional but Recommended):

### Make Headers Stand Out:
1. Select Row 1 in each tab
2. **Bold** the text (Ctrl+B)
3. **Background color:** Light gray or light blue
4. **Text alignment:** Center
5. **Freeze row:** View → Freeze → 1 row

### Auto-resize Columns:
1. Select all columns (click the square between A and 1)
2. Double-click any column border to auto-resize

### Add Borders:
1. Select all data (Ctrl+A)
2. Borders icon → All borders

---

## 🔍 What You'll See When Backend Logs:

When someone tries to login with wrong credentials:
```javascript
// Backend logs this:
await sheetsLogger.logAuth('login', 'failure', 'user@test.com', {
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  reason: 'invalid_credentials'
});
```

**Appears in your sheet as:**
```
| 2024-11-04T10:30:45.123Z | login | failure | user@test.com | 192.168.1.1 | Mozilla/5.0... | invalid_credentials |
```

**Instantly!** (Usually within 1-2 seconds)

---

## ✅ Quick Checklist:

- [ ] Create tab: **Authentication** (exact name!)
- [ ] Add 7 headers: Timestamp, Type, Status, Email, IP, UserAgent, Reason
- [ ] Create tab: **CartOperations**
- [ ] Add 8 headers: Timestamp, Operation, Status, UserID, ProductID, Quantity, ItemCount, TotalValue
- [ ] Create tab: **APIRequests**
- [ ] Add 6 headers: Timestamp, Method, Path, StatusCode, Duration, UserID
- [ ] Create tab: **Errors**
- [ ] Add 6 headers: Timestamp, Type, Message, Stack, Endpoint, UserID
- [ ] Format headers (bold, freeze row)
- [ ] Share sheet with service account email (Editor access)

---

## 🚀 After Setup:

Once you add the environment variables to Render and the backend redeploys, data will start appearing automatically!

**Test it:** Try a failed login, then refresh your sheet. You should see the attempt logged! 🎉

---

**Need help?** Check `GOOGLE_SHEETS_QUICK_SETUP.md` for the full setup process!
