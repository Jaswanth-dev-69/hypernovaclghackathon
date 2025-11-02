-- ============================================
-- COMPLETE CART SETUP (Run this to fix everything)
-- ============================================
-- This drops the existing table and creates a new one without RLS

-- Drop existing table (if exists)
DROP TABLE IF EXISTS public.cart_items CASCADE;

-- Drop existing function (if exists)
DROP FUNCTION IF EXISTS public.handle_cart_updated_at() CASCADE;

-- Create cart_items table WITHOUT RLS
CREATE TABLE public.cart_items (
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

-- Create indexes for performance
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON public.cart_items(product_id);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION public.handle_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER set_cart_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_cart_updated_at();

-- Verify table is created WITHOUT RLS
SELECT 
  tablename, 
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '❌ RLS Enabled (BAD)'
    ELSE '✅ RLS Disabled (GOOD)'
  END as status
FROM pg_tables 
WHERE tablename = 'cart_items';

-- Show table structure
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cart_items'
ORDER BY ordinal_position;

-- Success message
SELECT '✅ Cart table created successfully! You can now add items to cart.' as message;
