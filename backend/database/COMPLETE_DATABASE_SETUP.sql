-- ============================================
-- 🚀 HYPERNOVA HACKATHON - COMPLETE DATABASE SETUP
-- ============================================
-- ONE QUERY TO SET UP EVERYTHING
-- Run this ONCE in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: CLEAN UP (Remove old tables/functions)
-- ============================================

-- Drop existing tables
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.user_details CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_cart_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_login() CASCADE;

-- ============================================
-- STEP 2: CREATE CART TABLE (Shopping Cart)
-- ============================================

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

-- Cart indexes for performance
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON public.cart_items(product_id);

-- Cart: NO RLS (Row Level Security disabled for simplicity)
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: CREATE USER DETAILS TABLE
-- ============================================

CREATE TABLE public.user_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(50),
  address JSONB,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  login_count INTEGER DEFAULT 0
);

-- User details indexes
CREATE INDEX idx_user_details_user_id ON public.user_details(user_id);
CREATE INDEX idx_user_details_email ON public.user_details(email);
CREATE INDEX idx_user_details_created_at ON public.user_details(created_at DESC);

-- User details: ENABLE RLS (security for user data)
ALTER TABLE public.user_details ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own data
CREATE POLICY "Users can view own data"
  ON public.user_details FOR SELECT
  USING (auth.uid() = user_id);

-- RLS: Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.user_details FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS: Service role can insert (for database triggers)
CREATE POLICY "Service role can insert user data"
  ON public.user_details FOR INSERT
  WITH CHECK (true);

-- RLS: Users can delete their own data
CREATE POLICY "Users can delete own data"
  ON public.user_details FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 4: CREATE FUNCTIONS
-- ============================================

-- Function 1: Auto-update cart timestamp
CREATE OR REPLACE FUNCTION public.handle_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Auto-update user_details timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 3: Create user_details when email is confirmed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create entry if email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.user_details (
      user_id, 
      email, 
      full_name, 
      avatar_url, 
      login_count
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'username',
        SPLIT_PART(NEW.email, '@', 1)
      ),
      NEW.raw_user_meta_data->>'avatar_url',
      0
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 4: Track user login activity
CREATE OR REPLACE FUNCTION public.update_user_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_details
  SET 
    last_login_at = NEW.last_sign_in_at,
    login_count = login_count + 1
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 5: CREATE TRIGGERS
-- ============================================

-- Trigger 1: Update cart timestamp
CREATE TRIGGER set_cart_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_cart_updated_at();

-- Trigger 2: Update user_details timestamp
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_details
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger 3: Create user_details after email confirmation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger 4: Track login activity
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
  EXECUTE FUNCTION public.update_user_login();

-- ============================================
-- STEP 6: VERIFICATION & SUCCESS MESSAGES
-- ============================================

-- Verify cart_items table
SELECT 
  'cart_items' as table_name,
  CASE 
    WHEN rowsecurity THEN '❌ RLS Enabled (Should be disabled)'
    ELSE '✅ RLS Disabled (Correct)'
  END as rls_status,
  'Stores shopping cart items' as description
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'cart_items';

-- Verify user_details table
SELECT 
  'user_details' as table_name,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled (Correct)'
    ELSE '❌ RLS Disabled (Should be enabled)'
  END as rls_status,
  'Stores user profile data' as description
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'user_details';

-- List all functions created
SELECT 
  routine_name as function_name,
  '✅ Created' as status,
  CASE routine_name
    WHEN 'handle_cart_updated_at' THEN 'Updates cart timestamp'
    WHEN 'handle_updated_at' THEN 'Updates user_details timestamp'
    WHEN 'handle_new_user' THEN 'Creates user_details on signup'
    WHEN 'update_user_login' THEN 'Tracks login activity'
  END as purpose
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'handle_cart_updated_at',
    'handle_updated_at',
    'handle_new_user',
    'update_user_login'
  )
ORDER BY routine_name;

-- List all triggers created
SELECT 
  trigger_name,
  event_object_table as on_table,
  '✅ Active' as status,
  CASE trigger_name
    WHEN 'set_cart_updated_at' THEN 'Auto-updates cart modified time'
    WHEN 'set_updated_at' THEN 'Auto-updates user modified time'
    WHEN 'on_auth_user_created' THEN 'Creates user_details after email confirmation'
    WHEN 'on_auth_user_login' THEN 'Updates login count and timestamp'
  END as purpose
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Final success message
SELECT 
  '🎉 SETUP COMPLETE!' as status,
  '✅ cart_items table ready' as cart,
  '✅ user_details table ready' as users,
  '✅ 4 functions created' as functions,
  '✅ 4 triggers active' as triggers,
  '📧 Ready for email signups!' as next_step;

-- ============================================
-- 📝 WHAT THIS QUERY DOES:
-- ============================================
-- 1. ✅ Creates cart_items table (NO RLS)
--    - Stores shopping cart data
--    - One cart item per user per product
-- 
-- 2. ✅ Creates user_details table (WITH RLS)
--    - Stores user profile information
--    - Auto-populated when users confirm email
-- 
-- 3. ✅ Creates 4 functions:
--    - handle_cart_updated_at(): Updates cart timestamps
--    - handle_updated_at(): Updates user timestamps
--    - handle_new_user(): Creates user_details on signup
--    - update_user_login(): Tracks login activity
-- 
-- 4. ✅ Creates 4 triggers:
--    - Automatically manages timestamps
--    - Creates user_details after email confirmation
--    - Tracks user login count
-- 
-- 5. ✅ Security:
--    - cart_items: No RLS (open access)
--    - user_details: RLS enabled (users see own data)
-- 
-- ============================================
-- 🚀 NEXT STEPS AFTER RUNNING THIS:
-- ============================================
-- 1. Configure Supabase email settings
-- 2. Enable email confirmations
-- 3. Set redirect URLs
-- 4. Test signup flow
-- 
-- See: COMPLETE_FIX_GUIDE.md for details
-- ============================================
