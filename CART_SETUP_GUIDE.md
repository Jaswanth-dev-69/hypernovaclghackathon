# 🚀 CART FIX - Step by Step Setup Guide

## Problem
Getting "Failed to add item to cart" error because the `cart_items` table doesn't exist in Supabase yet.

## Solution
Follow these steps EXACTLY to fix the issue:

---

## Step 1: Open Supabase Dashboard

1. Go to: **https://app.supabase.com/**
2. Login with your credentials
3. Click on your project: **kpzfnzyqxtiauuxljhzr**

---

## Step 2: Create the Cart Table

1. In the left sidebar, click **"SQL Editor"**
2. Click **"New Query"** button (top right)
3. Copy the SQL below and paste it into the editor:

```sql
-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC(10, 2) NOT NULL,
  product_image TEXT,
  product_description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_cart_updated_at ON public.cart_items;
CREATE TRIGGER set_cart_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_cart_updated_at();
```

4. Click the **"RUN"** button (or press Ctrl+Enter)
5. You should see: **"Success. No rows returned"**

---

## Step 3: Verify Table Creation

1. In the left sidebar, click **"Table Editor"**
2. You should see **"cart_items"** in the list of tables
3. Click on **"cart_items"** to view its structure
4. Verify these columns exist:
   - ✅ id (uuid)
   - ✅ user_id (text)
   - ✅ product_id (text)
   - ✅ product_name (text)
   - ✅ product_price (numeric)
   - ✅ product_image (text)
   - ✅ product_description (text)
   - ✅ quantity (int4)
   - ✅ created_at (timestamptz)
   - ✅ updated_at (timestamptz)

---

## Step 4: Test the Cart (In Your App)

1. **Restart your frontend dev server** (if running):
   ```bash
   # Stop the server (Ctrl+C)
   # Start it again
   npm run dev
   ```

2. **Open your browser console** (F12 → Console tab)

3. **Navigate to the shop page** and try to add an item

4. **Check the console logs** - you should see detailed logs like:
   ```
   [Cart Service] Adding to cart: {userId: "...", product: {...}, quantity: 1}
   [Cart Service] Checking for existing item...
   [Cart Service] Inserting new item...
   [Cart Service] Insert success: {...}
   ```

5. If you see an error, the console will show exactly what went wrong

---

## Step 5: Verify Data in Supabase

1. Go back to **Supabase Dashboard**
2. Click **"Table Editor"** → **"cart_items"**
3. You should see your cart items appear in the table
4. Each row should have your user_id and product details

---

## Common Issues & Solutions

### Issue 1: "relation cart_items does not exist"
**Solution:** The table wasn't created. Go back to Step 2 and run the SQL again.

### Issue 2: "Failed to fetch"
**Solution:** Check your `.env.local` file has the correct Supabase URL and key:
```
NEXT_PUBLIC_SUPABASE_URL=https://kpzfnzyqxtiauuxljhzr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Issue 3: "User must be logged in"
**Solution:** Make sure you're logged in. Check localStorage in browser console:
```javascript
localStorage.getItem('user')
```
Should return user data, not null.

### Issue 4: Still getting errors
**Solution:** Open browser console (F12) and share the detailed error logs that start with `[Cart Service]`

---

## Quick Diagnostic Script

Run this in Supabase SQL Editor to check table status:

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'cart_items'
) as table_exists;

-- Show table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'cart_items'
ORDER BY ordinal_position;

-- Count rows
SELECT COUNT(*) as total_items FROM public.cart_items;
```

---

## After Setup is Complete

Once the table is created and working:

✅ You can add items to cart
✅ Cart persists across page reloads
✅ Each user has their own isolated cart
✅ Cart count updates in header
✅ You can update quantities
✅ You can remove items
✅ Cart clears after checkout

---

## Need Help?

If you're still getting errors after following all steps:

1. Open browser console (F12)
2. Try to add an item to cart
3. Copy ALL the console logs (especially lines starting with `[Cart Service]`)
4. Share those logs so I can diagnose the exact issue

---

**Status:** ⚠️ Waiting for you to run the SQL in Step 2
**Time Required:** 2-3 minutes
**Difficulty:** Easy (just copy-paste SQL)
