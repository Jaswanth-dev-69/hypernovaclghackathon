-- ============================================
-- E-Commerce Cart Management Schema (Simplified)
-- ============================================
-- This version doesn't use RLS policies since we filter by user_id in the app

-- Create cart_items table to store user-specific cart data
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

-- Create index for faster user cart lookups
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);

-- Create index for faster product lookups
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
DROP TRIGGER IF EXISTS set_cart_updated_at ON public.cart_items;
CREATE TRIGGER set_cart_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_cart_updated_at();

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Go to https://app.supabase.com/
-- 2. Select your project: kpzfnzyqxtiauuxljhzr
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New Query"
-- 5. Copy and paste this entire SQL script
-- 6. Click "Run" button
-- 7. Verify table created in "Table Editor"
--
-- Note: This version uses TEXT for user_id instead of UUID 
-- and doesn't use RLS policies for simpler integration.
