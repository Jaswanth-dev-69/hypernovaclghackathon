# 🗄️ PostgreSQL Integration Guide

## Ready to Connect Your Frontend to PostgreSQL

---

## 📋 Prerequisites

### What You Need
- ✅ Frontend running (already done!)
- 🔜 PostgreSQL installed
- 🔜 Node.js backend (Express/Next.js API routes)
- 🔜 Database connection library (pg or Prisma)

---

## 🚀 Quick Setup Options

### Option 1: Next.js API Routes (Recommended)
Use Next.js built-in API routes - no separate backend needed!

### Option 2: Separate Express Backend
Create a standalone API server with Express.js

### Option 3: Prisma ORM
Use Prisma for type-safe database access

---

## 📦 Installation Steps

### Step 1: Install PostgreSQL Client
```powershell
cd j:\hypernovahackathon\frontend
npm install pg
npm install --save-dev @types/pg
```

### Step 2: Install Prisma (Alternative)
```powershell
npm install @prisma/client
npm install --save-dev prisma
npx prisma init
```

---

## 🗄️ Database Schema

### Create Database
```sql
CREATE DATABASE ecommerce_db;
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data from your JSON
INSERT INTO products (name, price, description, image, category, stock, rating) VALUES
('Wireless Headphones Pro', 199.99, 'Premium noise-canceling wireless headphones', 
 'https://via.placeholder.com/400x400/6366f1/ffffff?text=Headphones', 
 'Electronics', 25, 4.8),
('Smart Watch Ultra', 399.99, 'Advanced fitness tracking, heart rate monitoring',
 'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Watch',
 'Electronics', 15, 4.7);
-- Add remaining products...
```

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cart Table
```sql
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  session_id VARCHAR(255), -- For guest users
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  session_id VARCHAR(255),
  total DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Telemetry Tables
```sql
CREATE TABLE telemetry_events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  metadata JSONB,
  session_id VARCHAR(255),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE telemetry_metrics (
  id SERIAL PRIMARY KEY,
  metric_name VARCHAR(255) NOT NULL,
  value NUMERIC NOT NULL,
  unit VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE telemetry_errors (
  id SERIAL PRIMARY KEY,
  error_message TEXT NOT NULL,
  severity VARCHAR(50),
  context JSONB,
  session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Next.js API Routes Setup

### Create Database Connection
**File**: `src/lib/db.ts`
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ecommerce_db',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;
```

### Environment Variables
**File**: `.env.local`
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ecommerce_db
DB_PASSWORD=your_password
DB_PORT=5432
```

---

## 📡 API Routes to Create

### 1. Products API
**File**: `src/app/api/products/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY id'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

**File**: `src/app/api/products/[id]/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [params.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
```

### 2. Cart API
**File**: `src/app/api/cart/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Get cart items
export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;
  
  if (!sessionId) {
    return NextResponse.json([]);
  }
  
  try {
    const result = await pool.query(
      `SELECT c.*, p.name, p.price, p.image, p.description, p.stock
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.session_id = $1`,
      [sessionId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// Add to cart
export async function POST(request: NextRequest) {
  const { productId, quantity = 1 } = await request.json();
  const sessionId = request.cookies.get('session_id')?.value || 
                    generateSessionId();
  
  try {
    await pool.query(
      `INSERT INTO cart_items (session_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (session_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $3`,
      [sessionId, productId, quantity]
    );
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

### 3. Checkout API
**File**: `src/app/api/checkout/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;
  
  if (!sessionId) {
    return NextResponse.json(
      { error: 'No cart found' },
      { status: 400 }
    );
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get cart items
    const cartResult = await client.query(
      `SELECT c.*, p.price
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.session_id = $1`,
      [sessionId]
    );
    
    if (cartResult.rows.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Calculate totals
    const subtotal = cartResult.rows.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (session_id, subtotal, tax, total, status)
       VALUES ($1, $2, $3, $4, 'completed')
       RETURNING id`,
      [sessionId, subtotal, tax, total]
    );
    
    const orderId = orderResult.rows[0].id;
    
    // Create order items
    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
      
      // Update stock
      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }
    
    // Clear cart
    await client.query(
      'DELETE FROM cart_items WHERE session_id = $1',
      [sessionId]
    );
    
    await client.query('COMMIT');
    
    return NextResponse.json({
      success: true,
      orderId: `ORDER_${orderId}`
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
```

### 4. Telemetry API
**File**: `src/app/api/telemetry/events/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { eventName, metadata, sessionId } = await request.json();
    
    await pool.query(
      `INSERT INTO telemetry_events (event_name, metadata, session_id)
       VALUES ($1, $2, $3)`,
      [eventName, JSON.stringify(metadata), sessionId]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to log event' },
      { status: 500 }
    );
  }
}
```

---

## 🔄 Update Frontend API Calls

### Update `src/lib/api.ts`

Replace mock functions with real API calls:

```typescript
// Before: Mock data
export async function fetchProducts(): Promise<Product[]> {
  const response = await import('@/data/products.json');
  return response.default;
}

// After: Real API
export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products', {
    cache: 'no-store' // Or use Next.js revalidation
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}

// Before: localStorage
export async function addToCart(product: Product, quantity: number) {
  // localStorage logic...
}

// After: Database
export async function addToCart(product: Product, quantity: number) {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: product.id,
      quantity
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to add to cart');
  }
  
  return response.json();
}
```

---

## 🧪 Testing the Integration

### Step 1: Setup Database
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ecommerce_db;

# Connect to database
\c ecommerce_db

# Run schema SQL from above
```

### Step 2: Verify Connection
Create a test route:
```typescript
// src/app/api/test/route.ts
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await pool.query('SELECT NOW()');
    return NextResponse.json({
      connected: true,
      time: result.rows[0].now
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error.message
    }, { status: 500 });
  }
}
```

Test: http://localhost:3000/api/test

---

## 📝 Migration Checklist

- [ ] Install PostgreSQL
- [ ] Create database
- [ ] Run schema SQL
- [ ] Insert sample products
- [ ] Install pg package
- [ ] Create db.ts connection file
- [ ] Add environment variables
- [ ] Create API routes
- [ ] Update frontend API calls
- [ ] Test each endpoint
- [ ] Remove mock data imports
- [ ] Update cart to use API
- [ ] Test checkout flow
- [ ] Verify telemetry logging

---

## 🎯 Testing Endpoints

```powershell
# Test products API
curl http://localhost:3000/api/products

# Test single product
curl http://localhost:3000/api/products/1

# Test add to cart
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'

# Test checkout
curl -X POST http://localhost:3000/api/checkout
```

---

## 🚀 Next Steps After Integration

1. **User Authentication**
   - Add NextAuth.js
   - Link carts to users
   - Protected routes

2. **Payment Processing**
   - Integrate Stripe
   - Process real payments
   - Handle webhooks

3. **Email Notifications**
   - Order confirmations
   - Shipping updates
   - Account emails

4. **Admin Dashboard**
   - Manage products
   - View orders
   - Analytics

---

## 📚 Helpful Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg)](https://node-postgres.com/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Your frontend is ready - just connect PostgreSQL and you're live! 🚀**
