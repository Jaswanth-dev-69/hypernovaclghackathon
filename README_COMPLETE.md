# 🚀 HyperNova E-Commerce Platform

<div align="center">

![HyperNova](https://img.shields.io/badge/HyperNova-E--Commerce-667eea?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-1.29-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

**A comprehensive, production-ready e-commerce platform with real-time monitoring, analytics, and Google Sheets integration**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Google Sheets Integration](#-google-sheets-integration)
- [Monitoring & Metrics](#-monitoring--metrics)
- [Streamlit Dashboard](#-streamlit-dashboard)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**HyperNova** is a modern, full-stack e-commerce platform built with cutting-edge technologies. It features real-time monitoring, comprehensive analytics, and seamless Google Sheets integration for business intelligence.

### What Makes HyperNova Special?

- ✅ **Production-Ready**: Deployed on Render with automatic scaling
- ✅ **Real-Time Analytics**: Live dashboard with Google Sheets integration
- ✅ **Comprehensive Monitoring**: 69+ Prometheus metrics tracked
- ✅ **Modern Tech Stack**: Next.js 14, Express.js, Supabase, Streamlit
- ✅ **Type-Safe**: TypeScript for frontend with strict typing
- ✅ **Security First**: Helmet.js, CORS, RLS policies
- ✅ **Developer Experience**: Hot reload, detailed logging, testing utilities

### Live Deployments

- 🌐 **Frontend**: https://hypernova-frontend.onrender.com
- 🔧 **Backend API**: https://hypernova-backend-7zxi.onrender.com
- 📊 **Dashboard**: [Streamlit Cloud](#streamlit-dashboard) (deploy yourself)

---

## ✨ Key Features

### 🛍️ E-Commerce Core

- **Product Catalog**: Browse, search, and filter products
- **Shopping Cart**: Add/remove items, update quantities
- **User Authentication**: Signup, login, JWT-based sessions
- **Order Management**: Track orders and purchase history
- **Responsive Design**: Mobile-first UI with Tailwind CSS

### 📊 Analytics & Monitoring

- **Real-Time Dashboard**: Streamlit-powered analytics with dark mode
- **Google Sheets Integration**: Automatic logging to 5 spreadsheet tabs
- **Prometheus Metrics**: 69+ custom metrics for deep insights
- **Error Tracking**: Comprehensive error logging and analysis
- **Performance Monitoring**: API response times, success rates

### 🔧 Developer Tools

- **Health Checks**: Monitor service status at `/health`
- **Metrics Endpoint**: Prometheus-compatible at `/metrics`
- **CSV Export**: Export Google Sheets data for Power BI
- **Test Scripts**: Comprehensive test suites included
- **Hot Reload**: Fast development with nodemon and Next.js

---

## 🛠️ Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 4.18.2 | Web framework |
| **Supabase** | 2.39.0 | PostgreSQL database + Auth |
| **Prometheus** | prom-client 15.1.3 | Metrics collection |
| **Google Sheets API** | googleapis 164.1.0 | Data logging |
| **Helmet.js** | 7.1.0 | Security headers |
| **Morgan** | 1.10.0 | HTTP request logging |
| **CORS** | 2.8.5 | Cross-origin support |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.0 | React framework |
| **React** | 18.3.0 | UI library |
| **TypeScript** | 5.4.0 | Type safety |
| **Tailwind CSS** | 3.4.3 | Styling framework |
| **Supabase Client** | 2.78.0 | Backend integration |

### Analytics Dashboard

| Technology | Version | Purpose |
|------------|---------|---------|
| **Streamlit** | 1.29.0 | Dashboard framework |
| **Pandas** | 2.1.4 | Data manipulation |
| **Plotly** | 5.18.0 | Interactive charts |
| **Google Auth** | 2.25.2 | Sheets authentication |

### Infrastructure

- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Hosting**: Render (Backend + Frontend)
- **Version Control**: Git + GitHub
- **CI/CD**: Automatic deployments on push

---

## 📁 Project Structure

```
j:\hypernovahackathon\
├── 📂 backend/                      # Express.js API Server
│   ├── 📂 src/
│   │   ├── 📂 config/              # Configuration files
│   │   │   └── supabase.js         # Supabase client setup
│   │   ├── 📂 controllers/         # Request handlers
│   │   │   ├── authController.js   # Authentication logic
│   │   │   └── cartController.js   # Cart operations
│   │   ├── 📂 middleware/          # Express middleware
│   │   │   ├── errorHandler.js    # Global error handling
│   │   │   └── metricsExporter.js # Prometheus metrics
│   │   ├── 📂 routes/              # API routes
│   │   │   ├── authRoutes.js      # /api/auth/*
│   │   │   ├── cartRoutes.js      # /api/cart/*
│   │   │   └── metricsRoutes.js   # /metrics
│   │   ├── 📂 services/            # Business logic
│   │   │   ├── userService.js     # User operations
│   │   │   └── cartService.js     # Cart operations
│   │   ├── 📂 utils/               # Utilities
│   │   │   └── googleSheetsLogger.js # Sheets integration
│   │   └── server.js               # App entry point
│   ├── 📂 database/                # Database scripts
│   │   ├── schema.sql             # Database schema
│   │   ├── setup.js               # Setup script
│   │   └── test.js                # Connection test
│   ├── 📄 package.json             # Dependencies
│   ├── 📄 .env                     # Environment variables
│   ├── 📄 service-account.json     # Google credentials
│   └── 📄 README.md                # Backend docs
│
├── 📂 frontend/                     # Next.js Web Application
│   ├── 📂 src/
│   │   ├── 📂 app/                 # Next.js 14 App Router
│   │   │   ├── page.tsx           # Home page
│   │   │   ├── layout.tsx         # Root layout
│   │   │   ├── 📂 shop/           # Product catalog
│   │   │   ├── 📂 cart/           # Shopping cart
│   │   │   ├── 📂 login/          # Login page
│   │   │   ├── 📂 signup/         # Registration
│   │   │   └── 📂 products/[id]/  # Product details
│   │   ├── 📂 components/         # React components
│   │   │   ├── Header.tsx         # Navigation bar
│   │   │   ├── Footer.tsx         # Page footer
│   │   │   ├── ProductCard.tsx    # Product display
│   │   │   ├── CartItem.tsx       # Cart item
│   │   │   └── Button.tsx         # Reusable button
│   │   ├── 📂 lib/                 # Utilities
│   │   │   ├── api.ts             # API client
│   │   │   ├── auth.ts            # Auth helpers
│   │   │   ├── cart.ts            # Cart helpers
│   │   │   ├── supabase.ts        # Supabase client
│   │   │   ├── telemetry.ts       # Metrics tracking
│   │   │   └── validation.ts      # Form validation
│   │   ├── 📂 styles/             # Global styles
│   │   │   └── globals.css        # Tailwind imports
│   │   └── 📂 data/               # Static data
│   │       └── products.json      # Product catalog
│   ├── 📄 package.json             # Dependencies
│   ├── 📄 tsconfig.json            # TypeScript config
│   ├── 📄 tailwind.config.js      # Tailwind setup
│   ├── 📄 next.config.js           # Next.js config
│   └── 📄 .env.local              # Environment variables
│
├── 📂 streamlit-dashboard/          # Analytics Dashboard
│   ├── 📄 app.py                   # Main dashboard
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📄 service-account.json     # Google credentials
│   └── 📄 README.md                # Dashboard docs
│
├── 📂 sheet-to-csv/                 # CSV Export Tool
│   ├── 📄 fetchSheet.js            # Export script
│   ├── 📄 package.json             # Dependencies
│   ├── 📄 service-account.json     # Google credentials
│   ├── 📂 data/                    # Exported CSVs
│   │   ├── api_requests.csv       # 490 rows
│   │   ├── errors.csv             # 27 rows
│   │   ├── metrics.csv            # 9,987 rows
│   │   ├── authentication.csv     # 23 rows
│   │   └── cart_operations.csv    # 29 rows
│   ├── 📄 POWER_BI_GUIDE.md        # Power BI tutorial
│   └── 📄 README.md                # Export docs
│
├── 📄 START_ALL_SERVICES.ps1        # Master startup script
├── 📄 COMMANDS_REFERENCE.md         # Complete command guide
├── 📄 COMMANDS_SIMPLE.md            # Quick command list
├── 📄 QUICK_START.txt               # Visual reference card
└── 📄 README_COMPLETE.md            # This file

Total Project Statistics:
- 📝 Lines of Code: ~15,000+
- 📁 Files: 236+
- 🎯 API Endpoints: 12+
- 📊 Metrics Tracked: 69+
- 📄 Google Sheets Tabs: 5
- 📈 CSV Exports: 10,556 rows
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Python**: 3.8+ (for Streamlit dashboard)
- **Git**: For version control
- **Supabase Account**: For database and auth
- **Google Cloud Account**: For Sheets API

### Option 1: One-Command Startup (Recommended)

```powershell
# Clone the repository
git clone https://github.com/Jaswanth-dev-69/hypernovaclghackathon.git
cd hypernovaclghackathon

# Run the master startup script
.\START_ALL_SERVICES.ps1
```

This automatically starts:
- ✅ Backend API (Port 5000)
- ✅ Frontend App (Port 3000)
- ✅ Streamlit Dashboard (Port 8501)

### Option 2: Manual Setup

#### 1. Backend Setup

```powershell
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
# Edit .env with your Supabase credentials

# Add Google Sheets service account
# Place service-account.json in backend/

# Start development server
npm run dev
```

Backend runs at: http://localhost:5000

#### 2. Frontend Setup

```powershell
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

Frontend runs at: http://localhost:3000

#### 3. Streamlit Dashboard Setup

```powershell
cd streamlit-dashboard

# Install Python dependencies
pip install -r requirements.txt

# Add Google Sheets service account
# Place service-account.json in streamlit-dashboard/

# Start dashboard
python -m streamlit run app.py
```

Dashboard runs at: http://localhost:8501

### Verify Installation

1. **Backend Health Check:**
   ```powershell
   curl http://localhost:5000/health
   ```
   Expected: `{"status": "healthy", ...}`

2. **Frontend Access:**
   - Open http://localhost:3000 in browser
   - Should see homepage with products

3. **Dashboard Access:**
   - Open http://localhost:8501 in browser
   - Should see dark theme analytics dashboard

---

## 🏗️ Architecture

### System Overview

```mermaid
graph TB
    A[User Browser] -->|HTTP/HTTPS| B[Next.js Frontend<br/>Port 3000]
    B -->|REST API| C[Express Backend<br/>Port 5000]
    C -->|Query/Auth| D[Supabase<br/>PostgreSQL + Auth]
    C -->|Log Data| E[Google Sheets<br/>5 Tabs]
    C -->|Export Metrics| F[Prometheus<br/>/metrics endpoint]
    G[Streamlit Dashboard<br/>Port 8501] -->|Read Data| E
    H[Power BI] -->|Import CSV| I[sheet-to-csv Tool]
    I -->|Fetch Data| E
```

### Data Flow

1. **User Interaction**: User browses products, adds to cart, checks out
2. **Frontend**: Next.js sends API requests to backend
3. **Backend Processing**: Express validates, queries Supabase, logs to Sheets
4. **Database**: Supabase stores users, products, cart items
5. **Monitoring**: Prometheus collects metrics, Google Sheets logs events
6. **Analytics**: Streamlit reads Sheets data, displays real-time dashboard
7. **BI Export**: CSV tool exports Sheets data for Power BI analysis

### Security Architecture

- **Authentication**: JWT tokens from Supabase Auth
- **Authorization**: Row Level Security (RLS) policies
- **API Security**: Helmet.js, CORS, rate limiting
- **Secrets Management**: Environment variables, service accounts
- **Data Validation**: Input sanitization, schema validation

---

## 📡 API Documentation

### Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://hypernova-backend-7zxi.onrender.com`

### Authentication Endpoints

#### POST /api/auth/signup

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token"
    }
  }
}
```

#### POST /api/auth/login

Authenticate existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "session": {
      "access_token": "jwt_token"
    }
  }
}
```

#### POST /api/auth/logout

End user session.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Cart Endpoints

#### GET /api/cart

Get user's cart items.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "product_id": "prod_123",
        "quantity": 2,
        "product": {
          "name": "Product Name",
          "price": 29.99
        }
      }
    ],
    "total_items": 2,
    "total_price": 59.98
  }
}
```

#### POST /api/cart

Add item to cart.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "product_id": "prod_123",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cart_item": {
      "id": "uuid",
      "product_id": "prod_123",
      "quantity": 1
    }
  }
}
```

#### PUT /api/cart/:id

Update cart item quantity.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated",
  "data": {
    "cart_item": {
      "id": "uuid",
      "quantity": 3
    }
  }
}
```

#### DELETE /api/cart/:id

Remove item from cart.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

### Monitoring Endpoints

#### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-06T12:00:00.000Z",
  "uptime": 12345.67,
  "database": "connected",
  "logging": "Google Sheets"
}
```

#### GET /metrics

Prometheus metrics endpoint.

**Response:** (Prometheus format)
```
# HELP hypernova_http_requests_total Total HTTP requests
# TYPE hypernova_http_requests_total counter
hypernova_http_requests_total{method="GET",route="/api/cart",status="200"} 142

# HELP hypernova_http_request_duration_seconds HTTP request duration
# TYPE hypernova_http_request_duration_seconds histogram
hypernova_http_request_duration_seconds_bucket{le="0.1",method="GET",route="/api/cart"} 120
...
```

#### GET /api/log-metrics

Trigger manual metrics export to Google Sheets.

**Response:**
```json
{
  "success": true,
  "message": "69 metrics logged to Google Sheets"
}
```

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 📊 Google Sheets Integration

### Overview

HyperNova logs all application events to a Google Sheet for easy analysis and business intelligence.

### Spreadsheet Details

- **Spreadsheet ID**: `1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E`
- **Name**: HyperNova Metrics Dashboard
- **URL**: [Open Sheet](https://docs.google.com/spreadsheets/d/1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E/edit)

### Sheet Tabs (5 Total)

#### 1. Authentication Tab
Logs all authentication events.

**Columns (7):**
| Column | Type | Description |
|--------|------|-------------|
| Timestamp | DateTime | Event timestamp |
| Type | String | signup, login, logout |
| Status | String | success, failure |
| Email | String | User email |
| IP | String | IP address |
| UserAgent | String | Browser info |
| Reason | String | Failure reason (if any) |

**Sample Data:** 23 rows

#### 2. CartOperations Tab
Logs shopping cart activities.

**Columns (7):**
| Column | Type | Description |
|--------|------|-------------|
| Timestamp | DateTime | Event timestamp |
| Operation | String | add, update, remove |
| Status | String | success, failure |
| UserID | String | User identifier |
| ProductID | String | Product identifier |
| Quantity | Number | Item quantity |
| ItemCount | Number | Total cart items |

**Sample Data:** 29 rows

#### 3. APIRequests Tab
Logs all HTTP API requests.

**Columns (6):**
| Column | Type | Description |
|--------|------|-------------|
| Timestamp | DateTime | Request timestamp |
| Method | String | GET, POST, PUT, DELETE |
| Path | String | API endpoint |
| StatusCode | Number | HTTP status code |
| Duration | Number | Response time (ms) |
| UserID | String | User identifier |

**Sample Data:** 490 rows

#### 4. Errors Tab
Logs application errors.

**Columns (6):**
| Column | Type | Description |
|--------|------|-------------|
| Timestamp | DateTime | Error timestamp |
| Type | String | Error category |
| Message | String | Error message |
| Stack | String | Stack trace |
| Endpoint | String | API endpoint |
| UserID | String | User identifier |

**Sample Data:** 27 rows

#### 5. Metrics Tab
Logs Prometheus metrics snapshots.

**Columns (8):**
| Column | Type | Description |
|--------|------|-------------|
| Timestamp | DateTime | Metric timestamp |
| MetricName | String | Metric identifier |
| MetricType | String | counter, gauge, histogram |
| Value | Number | Metric value |
| Labels | String | JSON labels |
| Help | String | Metric description |
| Environment | String | dev, staging, production |
| NodeVersion | String | Node.js version |

**Sample Data:** 9,987 rows

### Service Accounts

Two service accounts are used:

1. **Backend Writer** (metrics-writer@apple-477216.iam.gserviceaccount.com)
   - Purpose: Write logs from backend
   - Permissions: Editor access to sheet
   - Location: `backend/service-account.json`

2. **Dashboard Reader** (powerbi-sheet-reader@apple-477216.iam.gserviceaccount.com)
   - Purpose: Read data for dashboard
   - Permissions: Viewer access to sheet
   - Location: `streamlit-dashboard/service-account.json`

### Logging Mechanism

```javascript
// Example: Log authentication event
await sheetsLogger.logAuth(
  'login',           // type
  'success',         // status
  'user@example.com', // email
  {
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    reason: ''
  }
);

// Example: Log API request
await sheetsLogger.logRequest(
  'GET',                // method
  '/api/cart',          // path
  200,                  // status code
  45,                   // duration (ms)
  'user-uuid'          // user ID
);
```

### CSV Export

Export all Sheets data to CSV files for Power BI or Excel:

```powershell
cd sheet-to-csv
npm run fetch
```

**Output Files** (in `sheet-to-csv/data/`):
- `api_requests.csv` - 490 rows
- `errors.csv` - 27 rows
- `metrics.csv` - 9,987 rows
- `authentication.csv` - 23 rows
- `cart_operations.csv` - 29 rows

**Total Exported:** 10,556 rows

---

## 📈 Monitoring & Metrics

### Prometheus Metrics

HyperNova exports **69+ custom metrics** in Prometheus format.

#### HTTP Metrics

- `hypernova_http_requests_total` - Total HTTP requests by method, route, status
- `hypernova_http_request_duration_seconds` - Request duration histogram
- `hypernova_http_request_size_bytes` - Request body size
- `hypernova_http_response_size_bytes` - Response body size

#### Authentication Metrics

- `hypernova_auth_signup_total` - Total signup attempts
- `hypernova_auth_signup_success_total` - Successful signups
- `hypernova_auth_signup_failure_total` - Failed signups
- `hypernova_auth_login_total` - Total login attempts
- `hypernova_auth_login_success_total` - Successful logins
- `hypernova_auth_login_failure_total` - Failed logins
- `hypernova_auth_logout_total` - Total logouts

#### Cart Metrics

- `hypernova_cart_add_total` - Items added to cart
- `hypernova_cart_update_total` - Cart updates
- `hypernova_cart_remove_total` - Items removed
- `hypernova_cart_checkout_total` - Checkout attempts
- `hypernova_cart_items_gauge` - Current cart items count

#### Error Metrics

- `hypernova_errors_total` - Total errors by type
- `hypernova_validation_errors_total` - Validation failures
- `hypernova_database_errors_total` - Database errors

#### System Metrics (Node.js)

- `nodejs_version_info` - Node.js version
- `process_cpu_user_seconds_total` - CPU usage (user)
- `process_cpu_system_seconds_total` - CPU usage (system)
- `process_resident_memory_bytes` - Memory usage (RSS)
- `process_heap_bytes` - Heap size
- `nodejs_eventloop_lag_seconds` - Event loop lag
- `nodejs_active_handles_total` - Active handles
- `nodejs_active_requests_total` - Active requests

### Accessing Metrics

**Local Development:**
```powershell
curl http://localhost:5000/metrics
```

**Production:**
```powershell
curl https://hypernova-backend-7zxi.onrender.com/metrics
```

### Grafana Integration (Optional)

1. Add Prometheus datasource pointing to `/metrics`
2. Import dashboard JSON
3. View real-time metrics

---

## 📊 Streamlit Dashboard

### Overview

Live analytics dashboard with dark mode theme and real-time data from Google Sheets.

### Features

- ✅ **Dark Mode**: Professional dark theme with white text
- ✅ **Real-Time Data**: Auto-refresh every 5 minutes
- ✅ **Interactive Charts**: Plotly-powered visualizations
- ✅ **Multiple Tabs**: API Performance, Errors, Metrics
- ✅ **Key Metrics Cards**: Total requests, errors, response time, success rate
- ✅ **Data Filtering**: Date range and metric selectors

### Dashboard Sections

#### 1. Key Metrics Overview

Top row shows 4 metric cards:
- **Total API Requests** with trend indicator
- **Total Errors** with error rate percentage
- **Average Response Time** in milliseconds
- **Success Rate** percentage

#### 2. API Performance Tab

- **Requests Over Time**: Line chart showing hourly request volume
- **Requests by Method**: Pie chart (GET, POST, PUT, DELETE distribution)
- **Response Time Distribution**: Histogram of API latencies
- **Slowest Endpoints**: Bar chart of top 10 slowest routes

#### 3. Errors Analysis Tab

- **Errors Over Time**: Area chart showing error trends
- **Error Types Distribution**: Pie chart of error categories
- **Recent Errors Table**: Last 20 errors with timestamp, type, message, endpoint

#### 4. Metrics Tab

- **Metric Selector**: Dropdown to choose specific metric
- **Metric Timeline**: Line chart showing selected metric over time
- **Statistics Panel**: Current, Average, Max, Min values

### Starting the Dashboard

```powershell
cd streamlit-dashboard
python -m streamlit run app.py
```

Access at: http://localhost:8501

### Configuration

**Auto-Refresh Interval** (in `app.py`):
```python
@st.cache_data(ttl=300)  # 300 seconds = 5 minutes
def get_sheets_data(sheet_name):
    # ...
```

**Dark Theme Colors**:
- Background: `#0e1117` (almost black)
- Cards: `#1e2130` (dark gray)
- Accent: `#667eea` (purple-blue)
- Text: `#ffffff` (white)

### Deployment

Deploy to **Streamlit Cloud** for free:

1. Push code to GitHub
2. Go to https://share.streamlit.io
3. Connect repository
4. Select `streamlit-dashboard/app.py`
5. Add secrets (service-account.json content)
6. Deploy!

---

## 🚢 Deployment

### Current Deployments

- **Backend**: Deployed on Render (https://hypernova-backend-7zxi.onrender.com)
- **Frontend**: Deployed on Render (https://hypernova-frontend.onrender.com)
- **Dashboard**: Can be deployed to Streamlit Cloud

### Backend Deployment (Render)

1. **Connect Repository**:
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub repo

2. **Configuration**:
   ```yaml
   Name: hypernova-backend
   Environment: Node
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```

3. **Environment Variables**:
   ```
   PORT=5000
   NODE_ENV=production
   SUPABASE_URL=your_url
   SUPABASE_ANON_KEY=your_key
   GOOGLE_SHEETS_SPREADSHEET_ID=1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
   ```

4. **Upload service-account.json** via Render dashboard

### Frontend Deployment (Render)

1. **Connect Repository**:
   - Create new Static Site
   - Connect GitHub repo

2. **Configuration**:
   ```yaml
   Name: hypernova-frontend
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/.next
   ```

3. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://hypernova-backend-7zxi.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

### Auto-Deploy Setup

Both backend and frontend are configured for **automatic deployment** on push to `master` branch:

```bash
git add .
git commit -m "Update feature"
git push origin master
# Render automatically deploys!
```

---

## 🧪 Testing

### Backend Tests

#### Health Check Test
```powershell
cd backend
curl http://localhost:5000/health
```

#### Google Sheets Integration Test
```powershell
cd backend
node test-sheets-integration.js
```

Expected output:
```
✅ Authentication logged successfully
✅ Cart operation logged successfully
✅ API request logged successfully
✅ Error logged successfully
✅ Metrics logged successfully
✅ ALL TESTS PASSED!
```

#### Database Connection Test
```powershell
cd backend
node database/test.js
```

### Frontend Tests

#### TypeScript Compilation
```powershell
cd frontend
npm run build
```

#### Linting
```powershell
cd frontend
npm run lint
```

### Integration Tests

#### End-to-End User Flow
```powershell
# 1. Start all services
.\START_ALL_SERVICES.ps1

# 2. Open frontend
start http://localhost:3000

# 3. Test flow:
# - Browse products
# - Add to cart
# - Login/Signup
# - View cart
# - Check backend logs

# 4. Verify Google Sheets
start https://docs.google.com/spreadsheets/d/1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E/edit

# 5. Check dashboard
start http://localhost:8501
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here

# Google Sheets Integration
GOOGLE_SHEETS_SPREADSHEET_ID=1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

# CORS Configuration (Production)
FRONTEND_URL=https://hypernova-frontend.onrender.com

# Optional: Email Service (if implemented)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Production API URL (for deployment)
# NEXT_PUBLIC_API_URL=https://hypernova-backend-7zxi.onrender.com
```

### Streamlit Dashboard

Service account credentials are in `streamlit-dashboard/service-account.json`:

```json
{
  "type": "service_account",
  "project_id": "apple-477216",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "powerbi-sheet-reader@apple-477216.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start

**Problem**: `Error: Cannot find module '...'`

**Solution**:
```powershell
cd backend
Remove-Item node_modules -Recurse -Force
npm install
npm run dev
```

#### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```powershell
# Find process using port
netstat -ano | findstr :5000

# Kill process
Stop-Process -Id <PID> -Force

# Or use different port
$env:PORT=5001; npm run dev
```

#### Google Sheets Permission Denied

**Problem**: `Error: The caller does not have permission`

**Solution**:
1. Open Google Sheet
2. Click "Share"
3. Add service account email: `metrics-writer@apple-477216.iam.gserviceaccount.com`
4. Grant "Editor" access
5. Save

#### Supabase Connection Failed

**Problem**: `Error: Failed to connect to Supabase`

**Solution**:
1. Verify `.env` has correct `SUPABASE_URL` and `SUPABASE_ANON_KEY`
2. Check Supabase dashboard: https://supabase.com/dashboard
3. Test connection:
   ```powershell
   cd backend
   node database/test.js
   ```

#### Frontend API Calls Failing

**Problem**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
1. Ensure backend is running
2. Check `backend/.env` has `FRONTEND_URL` set
3. Verify CORS middleware in `backend/src/server.js`:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true
   }));
   ```

#### Streamlit Dashboard Shows No Data

**Problem**: Dashboard shows "No data available"

**Solution**:
1. Verify `service-account.json` exists in `streamlit-dashboard/`
2. Check if it's the correct file:
   ```powershell
   Test-Path "streamlit-dashboard/service-account.json"
   ```
3. Copy from sheet-to-csv if needed:
   ```powershell
   Copy-Item "sheet-to-csv/service-account.json" "streamlit-dashboard/service-account.json" -Force
   ```
4. Restart Streamlit:
   ```powershell
   # Press Ctrl+C, then:
   python -m streamlit run app.py
   ```

#### Database Tables Don't Exist

**Problem**: `Error: relation "users" does not exist`

**Solution**:
```powershell
cd backend
node database/setup.js
```

This creates all required tables:
- `users`
- `products`
- `cart_items`
- `user_details`

### Getting Help

If you encounter issues not covered here:

1. **Check Documentation**:
   - `COMMANDS_REFERENCE.md` - Complete command guide
   - `COMMANDS_SIMPLE.md` - Quick reference
   - Individual README files in each folder

2. **Review Logs**:
   - Backend logs in terminal window
   - Browser console for frontend errors
   - Streamlit terminal for dashboard issues

3. **Test Individually**:
   - Test backend health: `curl http://localhost:5000/health`
   - Test Sheets integration: `node backend/test-sheets-integration.js`
   - Test database: `node backend/database/test.js`

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow

1. **Fork the repository**

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/hypernovaclghackathon.git
   cd hypernovaclghackathon
   ```

3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**

5. **Test your changes**:
   ```powershell
   # Run all services
   .\START_ALL_SERVICES.ps1
   
   # Test backend
   cd backend && node test-sheets-integration.js
   
   # Test frontend build
   cd frontend && npm run build
   ```

6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**

### Code Style

- **JavaScript**: Follow Airbnb style guide
- **TypeScript**: Use strict mode
- **Python**: Follow PEP 8
- **Commits**: Use conventional commits (feat, fix, docs, etc.)

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🧪 Test coverage
- ♿ Accessibility improvements
- 🌍 Internationalization

---

## 📄 License

This project is licensed under the **ISC License**.

```
ISC License

Copyright (c) 2025 Jaswanth

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## 📞 Contact & Support

- **Developer**: Jaswanth
- **Email**: jaswanthloganathan2006@gmail.com
- **GitHub**: [@Jaswanth-dev-69](https://github.com/Jaswanth-dev-69)
- **Repository**: [hypernovaclghackathon](https://github.com/Jaswanth-dev-69/hypernovaclghackathon)

---

## 🙏 Acknowledgments

- **Supabase** - For amazing PostgreSQL + Auth service
- **Next.js** - For the fantastic React framework
- **Streamlit** - For rapid dashboard development
- **Google Cloud** - For Sheets API
- **Render** - For free hosting
- **Prometheus** - For metrics collection

---

## 📊 Project Statistics

- **Total Lines of Code**: ~15,000+
- **Files**: 236+
- **API Endpoints**: 12+
- **Prometheus Metrics**: 69+
- **Google Sheets Tabs**: 5
- **CSV Export Rows**: 10,556
- **Development Time**: ~2 weeks
- **Last Updated**: November 6, 2025

---

<div align="center">

**Made with ❤️ for the HyperNova Hackathon**

⭐ **Star this repo if you find it helpful!** ⭐

[Report Bug](https://github.com/Jaswanth-dev-69/hypernovaclghackathon/issues) • [Request Feature](https://github.com/Jaswanth-dev-69/hypernovaclghackathon/issues)

</div>
