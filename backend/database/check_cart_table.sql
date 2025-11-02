-- Quick diagnostic query to check cart_items table status
-- Run this in Supabase SQL Editor to see if table exists

-- Check if cart_items table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'cart_items'
) as table_exists;

-- If table exists, check its structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cart_items'
ORDER BY ordinal_position;

-- Check if there are any rows
SELECT COUNT(*) as total_items FROM public.cart_items;

-- View sample data (if any)
SELECT * FROM public.cart_items LIMIT 5;
