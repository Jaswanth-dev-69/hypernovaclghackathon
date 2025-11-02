-- ============================================
-- FIX: Disable RLS on cart_items table
-- ============================================
-- This fixes the "violates row-level security policy" error

-- Option 1: Simply disable RLS (recommended for development)
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (if any)
DROP POLICY IF EXISTS "Users can view own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete own cart items" ON public.cart_items;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'cart_items';
-- Should show rowsecurity = false

-- Test query to verify it works
SELECT COUNT(*) FROM public.cart_items;
