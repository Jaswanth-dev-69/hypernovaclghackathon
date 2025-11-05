# 🚀 HyperNova E-Commerce Platform

> A modern, full-stack e-commerce application with comprehensive monitoring, metrics collection, and IBM Data Prep Kit integration

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-green?logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-E6522C?logo=prometheus)](https://prometheus.io/)
[![Deployed](https://img.shields.io/badge/Deployed-Render-46E3B7?logo=render)](https://render.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [API Documentation](#-api-documentation)
- [Monitoring & Metrics](#-monitoring--metrics)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Workflow Diagram](#-workflow-diagram)
- [Contributing](#-contributing)

---

## 🌟 Overview

**HyperNova** is a production-ready e-commerce platform built with modern web technologies. It features a **dual monitoring system** combining real-time Prometheus metrics with historical Google Sheets logging for seamless integration with IBM Data Prep Kit.

### Key Highlights

- 🛒 **Full E-Commerce Functionality**: Product browsing, cart management, user authentication
- 📊 **Dual Monitoring System**: Prometheus (real-time) + Google Sheets (CSV export)
- 🔐 **Secure Authentication**: JWT-based auth with Supabase PostgreSQL
- 📈 **69+ Metrics Collected**: Node.js stats, HTTP requests, auth events, cart operations, database queries
- ☁️ **Cloud Deployed**: Both frontend and backend live on Render.com
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- 🔄 **RESTful API**: Clean, documented API endpoints
- 📝 **Comprehensive Logging**: 5 Google Sheets tabs for different event types

---

## 🏗️ Architecture

### System Design

```
┌──────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                  │
│                    (Desktop, Mobile, Tablet)                          │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ HTTPS
                             ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND (React SSR)                       │
│         🌐 https://hypernova-frontend.onrender.com                    │
│                                                                       │
│  📱 Pages:                          🎨 UI Framework:                 │
│  • Home (/)                         • Tailwind CSS                   │
│  • Shop (/shop)                     • Responsive Design              │
│  • Product Details (/products/[id]) • Modern Pastel Theme            │
│  • Cart (/cart)                                                      │
│  • Login (/login)                   🔧 State Management:             │
│  • Signup (/signup)                 • React Hooks (useState)         │
│  • Search (/search)                 • localStorage (cart, auth)      │
│  • FAQ (/faq)                       • Custom events (cart updates)   │
│                                                                       │
│  📚 Libraries:                      🔌 API Client:                   │
│  • lib/api.ts                       • fetch API                      │
│  • lib/auth.ts                      • JWT token management           │
│  • lib/cart.ts                      • Supabase client                │
│  • lib/telemetry.ts                 • Error handling                 │
└────────────────────────────┬─────────────────────────────────────────┘
                             │ REST API (JSON over HTTPS)
                             │ Authorization: Bearer <JWT_TOKEN>
                             ↓
┌──────────────────────────────────────────────────────────────────────┐
│                EXPRESS.JS BACKEND (Node.js 18+)                       │
│         🚀 https://hypernova-backend-7zxi.onrender.com                │
│                                                                       │
│  🔒 Middleware Pipeline:                                             │
│  1. helmet() - Security headers                                      │
│  2. cors() - Cross-origin requests                                   │
│  3. express.json() - JSON body parser                                │
│  4. metricsMiddleware - Prometheus tracking                          │
│  5. sheetsLogger - Google Sheets logging                             │
│  6. JWT authentication - Token validation                            │
│                                                                       │
│  🛣️ REST API Endpoints:                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ POST   /api/auth/signup     - Create user account           │   │
│  │ POST   /api/auth/login      - User authentication           │   │
│  │ GET    /api/cart/:userId    - Get user's cart               │   │
│  │ POST   /api/cart            - Add item to cart              │   │
│  │ PUT    /api/cart/:id        - Update cart item quantity     │   │
│  │ DELETE /api/cart/:id        - Remove item from cart         │   │
│  │ DELETE /api/cart/:userId    - Clear entire cart             │   │
│  │ GET    /api/cart/:userId/count - Get cart item count        │   │
│  │ GET    /health              - Health check endpoint         │   │
│  │ GET    /metrics             - Prometheus metrics (text)     │   │
│  │ GET    /api/log-metrics     - Trigger manual metrics log    │   │
│  │ GET    /api/test-logging    - Test error logging            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  📊 Monitoring Components:                                           │
│  • Prometheus Client (prom-client)                                   │
│  • Google Sheets Logger (googleapis)                                 │
│  • Custom metrics collectors                                         │
└──────┬────────────────────────┬──────────────────────┬───────────────┘
       │                        │                      │
       │                        │                      │
       ↓                        ↓                      ↓
┌──────────────────┐   ┌──────────────────┐   ┌─────────────────────┐
│   SUPABASE DB    │   │   PROMETHEUS     │   │  GOOGLE SHEETS API  │
│   (PostgreSQL)   │   │   (In-Memory)    │   │   (googleapis)      │
│                  │   │                  │   │                     │
│ 🗄️ Tables:       │   │ 📈 Metrics:      │   │ 📋 Tabs:            │
│ • users          │   │ • Counters       │   │ 1. Authentication   │
│   - id (UUID)    │   │ • Gauges         │   │ 2. CartOperations   │
│   - email        │   │ • Histograms     │   │ 3. APIRequests      │
│   - password     │   │ • Summaries      │   │ 4. Errors           │
│   - created_at   │   │                  │   │ 5. Metrics (69+)    │
│                  │   │ 🔄 Collected:    │   │                     │
│ • products       │   │ • Node.js stats  │   │ 🔄 Logged:          │
│   - id           │   │ • HTTP requests  │   │ • Every API call    │
│   - name         │   │ • Auth events    │   │ • Every 5 minutes   │
│   - price        │   │ • Cart ops       │   │ • All exceptions    │
│   - description  │   │ • DB queries     │   │ • Auth attempts     │
│   - image        │   │ • Errors         │   │ • Cart changes      │
│   - category     │   │                  │   │                     │
│   - stock        │   │ 📊 Exposed at:   │   │ 📤 Exported to:     │
│                  │   │ GET /metrics     │   │ • IBM Data Prep Kit │
│ • cart_items     │   │ (Text format)    │   │ • CSV downloads     │
│   - id (UUID)    │   │                  │   │ • Analytics tools   │
│   - user_id      │   │ 🔁 Auto-logged   │   │                     │
│   - product_id   │   │ to Google Sheets │   │ 🔐 Service Account: │
│   - quantity     │   │ every 5 minutes  │   │ metrics-writer@...  │
│   - created_at   │   │                  │   │                     │
│   - updated_at   │   │                  │   │ 📊 Spreadsheet ID:  │
│                  │   │                  │   │ 1xm6UrKTqgDdB...    │
│ 🔒 RLS Enabled   │   │                  │   │                     │
│ (Row-Level       │   │                  │   │                     │
│  Security)       │   │                  │   │                     │
└──────────────────┘   └──────────────────┘   └─────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend (Next.js)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2 | React framework with SSR, SSG, and App Router |
| **React** | 18.3 | UI library for component-based architecture |
| **TypeScript** | 5.4 | Type-safe JavaScript with static typing |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework for styling |
| **@supabase/supabase-js** | 2.78 | Supabase client for database operations |
| **fetch API** | Native | HTTP client for REST API calls |

**Key Features:**
- Server-Side Rendering (SSR) for SEO optimization
- Static Site Generation (SSG) for performance
- App Router with file-based routing
- Client-side state management with React Hooks
- Responsive design (mobile-first)
- JWT token management
- Local storage persistence

### Backend (Express.js)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 4.18 | Web framework for RESTful API |
| **Node.js** | 18+ | JavaScript runtime environment |
| **prom-client** | 15.1 | Prometheus metrics collection library |
| **googleapis** | 164.1 | Google Sheets API client |
| **@supabase/supabase-js** | 2.39 | Supabase client for PostgreSQL |
| **cors** | 2.8 | Cross-Origin Resource Sharing middleware |
| **helmet** | 7.1 | Security middleware (headers) |
| **morgan** | 1.10 | HTTP request logger |
| **dotenv** | 16.3 | Environment variable management |

**Key Features:**
- RESTful API design
- JWT authentication
- Prometheus metrics collection (69+ metrics)
- Google Sheets integration
- PostgreSQL database queries
- Error handling middleware
- Request logging
- Security headers

### Database (Supabase PostgreSQL)

| Feature | Implementation |
|---------|---------------|
| **Database** | PostgreSQL 15+ |
| **Authentication** | Supabase Auth (JWT) |
| **Row-Level Security** | Enabled on all tables |
| **Real-time** | WebSocket subscriptions |
| **Storage** | File storage (images) |
| **Edge Functions** | Serverless functions |

**Schema:**
- `users` - User accounts
- `products` - Product catalog
- `cart_items` - Shopping cart data

### Monitoring & Analytics

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Real-time Metrics** | Prometheus + prom-client | In-memory metrics collection |
| **Historical Logging** | Google Sheets API | CSV export for data analysis |
| **Service Account** | Google Cloud IAM | Secure API access |
| **Metrics Types** | Counter, Gauge, Histogram, Summary | Different metric patterns |
| **Export Format** | CSV | Compatible with IBM Data Prep Kit |

---

## ✨ Features

### 🛒 E-Commerce Core

- ✅ **Product Catalog**
  - 12+ sample products with images
  - Product details pages
  - Category filtering
  - Search functionality (UI ready)
  - Price display with currency formatting

- ✅ **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Real-time price calculation
  - Cart persistence (database-backed)
  - Cart count badge in header
  - User-specific carts (RLS protected)

- ✅ **User Authentication**
  - Signup with email/password
  - Login with JWT tokens
  - Secure password hashing
  - Session management
  - Logout functionality
  - Protected routes

### 📊 Monitoring & Metrics

- ✅ **Prometheus Metrics (69+ metrics)**
  - Node.js process stats (CPU, memory, event loop)
  - HTTP request metrics (duration, count, status codes)
  - Authentication metrics (attempts, failures, duration)
  - Cart operation metrics (CRUD operations, timing)
  - Database query metrics (duration, errors)
  - Error tracking (total errors by type)
  - Custom application metrics

- ✅ **Google Sheets Logging**
  - **Authentication Tab**: Login/signup events with IP, User-Agent, reasons
  - **CartOperations Tab**: Add, update, remove, clear operations
  - **APIRequests Tab**: All API calls with method, path, status, duration
  - **Errors Tab**: Exception logging with stack traces
  - **Metrics Tab**: Complete Prometheus metrics snapshot every 5 minutes

- ✅ **Data Export**
  - CSV format compatible with IBM Data Prep Kit
  - Automatic logging every 5 minutes
  - Manual trigger endpoint (`/api/log-metrics`)
  - Historical data analysis

### 🔒 Security

- ✅ JWT authentication
- ✅ Password hashing (Supabase Auth)
- ✅ Row-Level Security (RLS) on database
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input validation
- ✅ SQL injection protection (parameterized queries)

### 🎨 User Interface

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern pastel color scheme (blue/purple)
- ✅ Smooth animations and transitions
- ✅ Loading states
- ✅ Error states
- ✅ Empty states
- ✅ Toast notifications
- ✅ Form validation feedback

---

## 📡 API Documentation

### Base URL

```
Production: https://hypernova-backend-7zxi.onrender.com
Local:      http://localhost:5000
```

### REST API Endpoints

#### Authentication Endpoints

**1. Signup (Create Account)**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "johndoe"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**2. Login (Authenticate)**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Cart Endpoints

**3. Get Cart Items**
```http
GET /api/cart/:userId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "cart": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "product_id": "1",
      "product_name": "Wireless Headphones",
      "product_price": 79.99,
      "product_image": "https://...",
      "quantity": 2,
      "created_at": "2025-11-05T12:00:00Z",
      "updated_at": "2025-11-05T12:30:00Z"
    }
  ]
}
```

**4. Add to Cart**
```http
POST /api/cart
Content-Type: application/json
Authorization: Bearer <token>

{
  "user_id": "uuid",
  "product_id": "1",
  "product_name": "Wireless Headphones",
  "product_price": 79.99,
  "product_image": "https://...",
  "product_description": "High-quality wireless headphones",
  "quantity": 1
}

Response (201):
{
  "success": true,
  "message": "Item added to cart",
  "cartItem": { ... }
}
```

**5. Update Cart Item**
```http
PUT /api/cart/:cartItemId
Content-Type: application/json
Authorization: Bearer <token>

{
  "quantity": 3
}

Response (200):
{
  "success": true,
  "message": "Cart item updated",
  "cartItem": { ... }
}
```

**6. Remove from Cart**
```http
DELETE /api/cart/:cartItemId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Item removed from cart"
}
```

**7. Clear Cart**
```http
DELETE /api/cart/:userId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

**8. Get Cart Count**
```http
GET /api/cart/:userId/count
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 5
}
```

#### Monitoring Endpoints

**9. Health Check**
```http
GET /health

Response (200):
{
  "success": true,
  "status": "healthy",
  "message": "Server is running",
  "timestamp": "2025-11-05T12:00:00.000Z",
  "uptime": 3600.5,
  "environment": "production",
  "version": "1.0.0",
  "logging": "Google Sheets"
}
```

**10. Prometheus Metrics**
```http
GET /metrics

Response (200, text/plain):
# HELP hypernova_http_requests_total Total number of HTTP requests
# TYPE hypernova_http_requests_total counter
hypernova_http_requests_total{method="GET",route="/health",status_code="200",env="production"} 150

# HELP hypernova_http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE hypernova_http_request_duration_seconds histogram
hypernova_http_request_duration_seconds_bucket{le="0.01",method="GET",route="/health",status_code="200",env="production"} 120
...
```

**11. Manual Metrics Logging**
```http
GET /api/log-metrics

Response (200):
{
  "success": true,
  "message": "✅ Metrics logged to Google Sheets successfully!",
  "timestamp": "2025-11-05T12:00:00.000Z",
  "note": "Check your Google Sheets Metrics tab"
}
```

**12. Test Error Logging**
```http
GET /api/test-logging

Response (200):
{
  "success": true,
  "message": "✅ Error logging test completed successfully!",
  "note": "Check your Google Sheets Errors tab - you should see a new row",
  "timestamp": "2025-11-05T12:00:00.000Z"
}
```

### REST API Principles

**What is REST API?**

REST (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP methods to perform CRUD operations:

- **GET**: Retrieve data (Read)
- **POST**: Create new data (Create)
- **PUT/PATCH**: Update existing data (Update)
- **DELETE**: Remove data (Delete)

**Key Characteristics:**
1. **Stateless**: Each request contains all information needed
2. **Client-Server**: Separation of concerns
3. **Cacheable**: Responses can be cached for performance
4. **Uniform Interface**: Consistent API design
5. **JSON Format**: Data exchanged in JSON

**Example Request Flow:**
```javascript
// Frontend (React)
const response = await fetch('https://hypernova-backend-7zxi.onrender.com/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// { success: true, token: "...", user: {...} }
```

---

## 📊 Monitoring & Metrics

### Prometheus Metrics System

**What is Prometheus?**

Prometheus is an open-source monitoring system that collects metrics from applications and stores them in a time-series database. It's ideal for real-time monitoring and alerting.

**How HyperNova Uses Prometheus:**

1. **Metrics Collection** (`prom-client` library)
   - Automatically collects Node.js runtime stats
   - Custom metrics for business logic
   - HTTP request tracking
   - Database query monitoring

2. **Metric Types:**

   **Counter** (always increases):
   ```javascript
   httpRequestTotal.inc({
     method: 'GET',
     route: '/api/cart',
     status_code: 200,
     env: 'production'
   });
   ```

   **Gauge** (can go up or down):
   ```javascript
   activeConnections.set(42);
   ```

   **Histogram** (tracks distribution):
   ```javascript
   httpRequestDuration.observe(
     { method: 'POST', route: '/api/auth/login' },
     0.345  // duration in seconds
   );
   ```

3. **Metrics Collected (69+ total):**

   **Node.js Process Metrics (50+):**
   - `hypernova_process_cpu_user_seconds_total` - CPU time in user mode
   - `hypernova_process_cpu_system_seconds_total` - CPU time in system mode
   - `hypernova_process_resident_memory_bytes` - Memory usage
   - `hypernova_nodejs_eventloop_lag_seconds` - Event loop lag
   - `hypernova_nodejs_heap_size_total_bytes` - Heap size
   - `hypernova_nodejs_heap_size_used_bytes` - Used heap
   - `hypernova_nodejs_active_handles_total` - Active handles
   - `hypernova_nodejs_active_requests_total` - Active requests

   **HTTP Metrics:**
   - `hypernova_http_requests_total` - Total request count
   - `hypernova_http_request_duration_seconds` - Request timing
   - `hypernova_active_connections` - Current connections

   **Authentication Metrics:**
   - `hypernova_auth_attempts_total` - Login attempts
   - `hypernova_auth_duration_seconds` - Auth operation timing
   - `hypernova_login_failures_total` - Failed logins

   **Cart Metrics:**
   - `hypernova_cart_operations_total` - Cart CRUD operations
   - `hypernova_cart_operation_duration_seconds` - Cart timing

   **Database Metrics:**
   - `hypernova_database_query_duration_seconds` - Query timing
   - `hypernova_database_errors_total` - Database errors

   **Error Metrics:**
   - `hypernova_errors_total` - Total application errors

4. **Access Metrics:**
   ```bash
   # View real-time metrics
   curl https://hypernova-backend-7zxi.onrender.com/metrics
   ```

### Google Sheets Logging System

**Why Google Sheets?**

Google Sheets serves as a **historical data warehouse** for metrics, making it easy to:
- Export to CSV for IBM Data Prep Kit
- Analyze trends over time
- Share with non-technical stakeholders
- Create charts and dashboards
- No complex database setup needed

**Architecture:**

```javascript
// Backend: src/utils/googleSheetsLogger.js
const { google } = require('googleapis');

class GoogleSheetsLogger {
  async initialize() {
    // Authenticate with service account
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    this.sheets = google.sheets({ version: 'v4', auth });
  }
  
  async logMetric(sheetName, data) {
    // Append row to specified tab
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          new Date().toISOString(),
          ...Object.values(data)
        ]]
      }
    });
  }
}
```

**5 Google Sheets Tabs:**

**1. Authentication Tab**
| Timestamp | Type | Status | Email | IP Address | User-Agent | Reason | Metadata |
|-----------|------|--------|-------|------------|------------|--------|----------|
| 2025-11-05T12:00:00Z | login | success | user@ex.com | 203.0.113.42 | Mozilla/5.0... | valid_credentials | {...} |

**2. CartOperations Tab**
| Timestamp | Operation | Status | UserID | ProductID | Quantity | ProductName | Metadata |
|-----------|-----------|--------|--------|-----------|----------|-------------|----------|
| 2025-11-05T12:05:00Z | add | success | uuid-123 | 5 | 2 | Wireless Mouse | {...} |

**3. APIRequests Tab**
| Timestamp | Method | Path | StatusCode | Duration | UserID | IP | UserAgent |
|-----------|--------|------|------------|----------|--------|----|-----------| 
| 2025-11-05T12:10:00Z | GET | /api/cart | 200 | 0.045 | uuid-123 | 203.0.113.42 | Mozilla... |

**4. Errors Tab**
| Timestamp | Type | Message | Stack | Endpoint | UserID | Environment | Metadata |
|-----------|------|---------|-------|----------|--------|-------------|----------|
| 2025-11-05T12:15:00Z | database_error | Connection timeout | at Function.query... | /api/cart | uuid-123 | production | {...} |

**5. Metrics Tab (69+ metrics)**
| Timestamp | MetricName | MetricType | Value | Labels | Help | Environment | NodeVersion |
|-----------|------------|------------|-------|--------|------|-------------|-------------|
| 2025-11-05T12:00:00Z | hypernova_http_requests_total | counter | 1250 | {"method":"GET","route":"/health"} | Total HTTP requests | production | v18.19.0 |

**Automatic Logging:**

```javascript
// server.js - Periodic metrics logging
function startMetricsLogging() {
  const logMetrics = async () => {
    // Get all Prometheus metrics
    const metricsText = await promRegister.metrics();
    
    // Parse and log to Google Sheets
    await sheetsLogger.logMetricsSnapshot(metricsText);
    
    console.log('✅ Metrics snapshot logged successfully');
  };

  // Initial log after 10 seconds
  setTimeout(logMetrics, 10000);
  
  // Log every 5 minutes (300000ms)
  setInterval(logMetrics, 300000);
}
```

**CSV Export for IBM Data Prep Kit:**

1. Open Google Sheets spreadsheet
2. Select tab (e.g., Metrics)
3. File → Download → Comma Separated Values (.csv)
4. Import into IBM Data Prep Kit for analysis

---

## 🗄️ Database Schema

### Supabase PostgreSQL Schema

**What is Supabase?**

Supabase is an open-source Firebase alternative built on PostgreSQL. It provides:
- PostgreSQL database with RESTful API
- Authentication & user management
- Real-time subscriptions
- Row-Level Security (RLS)
- Storage for files
- Edge Functions

**Tables:**

**1. users (Authentication)**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

**2. products (Product Catalog)**
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**3. cart_items (Shopping Cart)**
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  product_image VARCHAR(500),
  product_description TEXT,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

-- Row-Level Security
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL
  USING (auth.uid() = user_id);
```

**Indexes for Performance:**
```sql
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_products_category ON products(category);
```

---

## ☁️ Deployment

### Render.com Deployment

**Why Render?**
- Free tier for hobby projects
- Automatic deploys from GitHub
- HTTPS by default
- Environment variable management
- Auto-scaling
- Zero-downtime deploys

**Deployed Services:**

**Frontend (Next.js):**
- URL: https://hypernova-frontend.onrender.com
- Type: Web Service
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Auto-deploy: Enabled (on git push)

**Backend (Express.js):**
- URL: https://hypernova-backend-7zxi.onrender.com
- Type: Web Service
- Build Command: `npm install`
- Start Command: `npm start`
- Auto-deploy: Enabled (on git push)

**Deployment Workflow:**

```bash
# 1. Make changes locally
git add .
git commit -m "feat: Add new feature"

# 2. Push to GitHub
git push origin master

# 3. Render automatically:
#    - Detects push
#    - Pulls latest code
#    - Runs build command
#    - Restarts service
#    - Updates deployment (5-10 min)

# 4. Check deployment logs
# Visit Render dashboard → Service → Logs
```

---

## 💻 Installation

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Supabase account
- Google Cloud account (for Sheets API)
- Render account (for deployment)

### Local Setup

**1. Clone Repository:**
```bash
git clone https://github.com/Jaswanth-dev-69/hypernovaclghackathon.git
cd hypernovaclghackathon
```

**2. Backend Setup:**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key
# GOOGLE_SHEETS_ID=your-sheet-id
# GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
# JWT_SECRET=your-secret-key
# FRONTEND_URL=http://localhost:3000
# PORT=5000
# NODE_ENV=development
```

**3. Frontend Setup:**
```bash
cd ../frontend
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# NEXT_PUBLIC_API_URL=http://localhost:5000
```

**4. Database Setup:**
```bash
# Go to Supabase Dashboard → SQL Editor
# Run the SQL files in order:
# 1. backend/database/schema.sql
# 2. backend/database/cart_schema.sql
```

**5. Start Development Servers:**
```bash
# Terminal 1 - Backend
cd backend
npm start
# Server: http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Frontend: http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Supabase Configuration
SUPABASE_URL=https://kpzfnzyqxtiauuxljhzr.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Sheets Configuration
GOOGLE_SHEETS_ID=1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"apple-477216",...}

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://hypernova-frontend.onrender.com
```

### Frontend (.env.local)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://kpzfnzyqxtiauuxljhzr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API URL
NEXT_PUBLIC_API_URL=https://hypernova-backend-7zxi.onrender.com
```

---

## 🚀 Usage

### Testing the Application

**1. Health Check:**
```bash
curl https://hypernova-backend-7zxi.onrender.com/health
```

**2. Create Account:**
```bash
curl -X POST https://hypernova-backend-7zxi.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","username":"testuser"}'
```

**3. Login:**
```bash
curl -X POST https://hypernova-backend-7zxi.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

**4. View Metrics:**
```bash
curl https://hypernova-backend-7zxi.onrender.com/metrics
```

**5. Trigger Metrics Logging:**
```bash
curl https://hypernova-backend-7zxi.onrender.com/api/log-metrics
```

**6. Test Error Logging:**
```bash
curl https://hypernova-backend-7zxi.onrender.com/api/test-logging
```

### Frontend Usage

1. Visit: https://hypernova-frontend.onrender.com
2. Click "Sign Up" to create account
3. Login with credentials
4. Browse products at /shop
5. Add items to cart
6. View cart at /cart
7. Update quantities or remove items

---

## 📁 Project Structure

```
hypernovahackathon/
├── README.md                           # This file
├── METRICS_TAB_COMPLETE.md            # Metrics implementation guide
├── SETUP_COMPLETE.md                  # Initial setup documentation
├── CART_MIGRATION_GUIDE.md            # Cart migration guide
│
├── backend/                            # Express.js Backend
│   ├── src/
│   │   ├── server.js                  # Main server file
│   │   ├── config/
│   │   │   └── supabase.js            # Supabase client config
│   │   ├── controllers/
│   │   │   ├── authController.js      # Auth endpoints (signup/login)
│   │   │   └── cartController.js      # Cart CRUD endpoints
│   │   ├── middleware/
│   │   │   ├── errorHandler.js        # Global error handler
│   │   │   └── metricsExporter.js     # Prometheus metrics setup
│   │   ├── routes/
│   │   │   ├── authRoutes.js          # Auth routes
│   │   │   ├── cartRoutes.js          # Cart routes
│   │   │   └── metricsRoutes.js       # Metrics endpoint
│   │   ├── services/
│   │   │   ├── userService.js         # User business logic
│   │   │   └── cartService.js         # Cart business logic
│   │   └── utils/
│   │       └── googleSheetsLogger.js  # Google Sheets integration
│   ├── database/
│   │   ├── schema.sql                 # Database schema
│   │   └── cart_schema.sql            # Cart table schema
│   ├── package.json                   # Dependencies
│   ├── .env                           # Environment variables (not in git)
│   └── README.md                      # Backend docs
│
├── frontend/                           # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout
│   │   │   ├── page.tsx               # Home page
│   │   │   ├── login/
│   │   │   │   └── page.tsx           # Login page
│   │   │   ├── signup/
│   │   │   │   └── page.tsx           # Signup page
│   │   │   ├── shop/
│   │   │   │   └── page.tsx           # Shop page
│   │   │   ├── cart/
│   │   │   │   └── page.tsx           # Cart page
│   │   │   ├── products/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Product details
│   │   │   ├── search/
│   │   │   │   └── page.tsx           # Search page
│   │   │   └── faq/
│   │   │       └── page.tsx           # FAQ page
│   │   ├── components/
│   │   │   ├── Header.tsx             # Navigation header
│   │   │   ├── Footer.tsx             # Footer
│   │   │   ├── ProductCard.tsx        # Product card
│   │   │   ├── ProductGallery.tsx     # Product grid
│   │   │   ├── CartItem.tsx           # Cart item component
│   │   │   ├── Button.tsx             # Reusable button
│   │   │   ├── Input.tsx              # Reusable input
│   │   │   └── LoadingSpinner.tsx     # Loading component
│   │   ├── lib/
│   │   │   ├── api.ts                 # API functions
│   │   │   ├── auth.ts                # Auth helpers
│   │   │   ├── cart.ts                # Cart operations
│   │   │   ├── supabase.ts            # Supabase client
│   │   │   ├── telemetry.ts           # Telemetry logging
│   │   │   └── validation.ts          # Form validation
│   │   ├── styles/
│   │   │   └── globals.css            # Global CSS + Tailwind
│   │   └── data/
│   │       └── products.json          # Product catalog
│   ├── public/
│   │   └── images/                    # Static images
│   ├── package.json                   # Dependencies
│   ├── .env.local                     # Environment variables (not in git)
│   ├── next.config.js                 # Next.js config
│   ├── tailwind.config.js             # Tailwind config
│   ├── tsconfig.json                  # TypeScript config
│   └── README.md                      # Frontend docs
│
└── .git/                              # Git repository
```

---

## 🔄 Workflow Diagram

### Complete Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER ACTION                                 │
│              (Click "Add to Cart" button)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                 FRONTEND (React Component)                       │
│  shop/page.tsx → handleAddToCart()                              │
│                                                                  │
│  1. Check if user is logged in                                  │
│  2. Get user ID from localStorage                               │
│  3. Call addToCart() from lib/cart.ts                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP POST Request
                             │ fetch('/api/cart', {method: 'POST', ...})
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND (Express.js Middleware)                     │
│                                                                  │
│  1. CORS Middleware → Allow frontend origin                     │
│  2. JSON Body Parser → Parse request body                       │
│  3. Prometheus Middleware → Track HTTP metrics                  │
│     • Increment httpRequestTotal counter                        │
│     • Start timer for httpRequestDuration                       │
│  4. Google Sheets Middleware → Log API request                  │
│     • Log method, path, status, duration                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│           ROUTE HANDLER (routes/cartRoutes.js)                  │
│  router.post('/api/cart', addToCartController)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│         CONTROLLER (controllers/cartController.js)              │
│                                                                  │
│  1. Extract data from req.body                                  │
│     • user_id, product_id, quantity, etc.                       │
│  2. Validate input                                              │
│  3. Call cartService.addToCart()                                │
│  4. Update Prometheus metrics                                   │
│     • Increment cartOperations counter                          │
│     • Record cartOperationDuration histogram                    │
│  5. Log to Google Sheets                                        │
│     • sheetsLogger.logCart('add', 'success', userId, {...})     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│            SERVICE (services/cartService.js)                     │
│                                                                  │
│  1. Create Supabase client                                      │
│  2. Check if item already in cart                               │
│     • SELECT * FROM cart_items WHERE user_id=? AND product_id=? │
│  3. If exists:                                                  │
│     • UPDATE quantity = quantity + ?                            │
│  4. If not exists:                                              │
│     • INSERT INTO cart_items VALUES (...)                       │
│  5. Return result                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ SQL Query
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              SUPABASE (PostgreSQL Database)                      │
│                                                                  │
│  1. Receive query from backend                                  │
│  2. Check Row-Level Security (RLS) policies                     │
│     • Verify user can access their own cart                     │
│  3. Execute query:                                              │
│     INSERT INTO cart_items (user_id, product_id, ...)           │
│     VALUES (uuid, '5', ...)                                     │
│     ON CONFLICT (user_id, product_id)                           │
│     DO UPDATE SET quantity = quantity + 1                       │
│  4. Return inserted/updated row                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Result
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE FLOW                                │
│                                                                  │
│  Service → Controller → Route → Middleware → Frontend           │
│                                                                  │
│  JSON Response:                                                 │
│  {                                                              │
│    success: true,                                               │
│    message: "Item added to cart",                               │
│    cartItem: {                                                  │
│      id: "uuid",                                                │
│      user_id: "uuid",                                           │
│      product_id: "5",                                           │
│      quantity: 2,                                               │
│      ...                                                        │
│    }                                                            │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND (Receive Response)                         │
│                                                                  │
│  1. Parse JSON response                                         │
│  2. Update local state                                          │
│  3. Dispatch 'cartUpdated' event                                │
│     • window.dispatchEvent(new Event('cartUpdated'))            │
│  4. Show success toast notification                             │
│  5. Header listens to event and updates cart badge              │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ (Parallel Process)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│         MONITORING (Background, Every 5 Minutes)                │
│                                                                  │
│  1. Timer triggers logMetrics()                                 │
│  2. Get all Prometheus metrics                                  │
│     • const metricsText = await promRegister.metrics()          │
│  3. Parse metrics (69+ metrics)                                 │
│     • parsePrometheusMetrics(metricsText)                       │
│  4. Log to Google Sheets Metrics tab                            │
│     • Batch insert 69+ rows                                     │
│  5. Console log: "📊 Logged 69 metrics to Google Sheets"        │
└─────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User enters email/password → POST /api/auth/login
                                    ↓
                       authController validates
                                    ↓
                       Query Supabase users table
                                    ↓
                       Compare password hash
                                    ↓
                       Generate JWT token
                                    ↓
                       Log to Google Sheets (Authentication tab)
                                    ↓
                       Update Prometheus metrics
                                    ↓
                       Return { success, token, user }
                                    ↓
Frontend stores token in localStorage
                                    ↓
Future requests include: Authorization: Bearer <token>
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes and test locally**
4. **Commit changes**: `git commit -m 'feat: Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Code Style

- **Frontend**: ESLint + Prettier (Next.js defaults)
- **Backend**: Standard JavaScript style
- **Commits**: Conventional Commits format
  - `feat:` New feature
  - `fix:` Bug fix
  - `docs:` Documentation
  - `style:` Formatting
  - `refactor:` Code restructuring
  - `test:` Tests
  - `chore:` Maintenance

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Jaswanth**
- GitHub: [@Jaswanth-dev-69](https://github.com/Jaswanth-dev-69)
- Repository: [hypernovaclghackathon](https://github.com/Jaswanth-dev-69/hypernovaclghackathon)

---

## 🙏 Acknowledgments

- **Supabase** - Database and authentication
- **Render** - Hosting platform
- **Google Cloud** - Sheets API for metrics logging
- **Prometheus** - Metrics collection system
- **Next.js Team** - Amazing React framework
- **Express.js Team** - Solid Node.js framework

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review code comments

---

## 🎯 Key Takeaways

✅ **Full-stack e-commerce platform** with authentication and cart management  
✅ **Dual monitoring system** for real-time and historical analytics  
✅ **REST API design** following industry best practices  
✅ **Prometheus metrics** with 69+ metrics collected automatically  
✅ **Google Sheets integration** for CSV export to IBM Data Prep Kit  
✅ **PostgreSQL database** with Row-Level Security  
✅ **Cloud deployment** on Render with auto-deploy from GitHub  
✅ **Modern tech stack** (Next.js 14, Express.js, Supabase, Prometheus)  
✅ **Production-ready** with error handling, logging, and security

---


