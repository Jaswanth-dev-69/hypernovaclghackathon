-- ============================================
-- USER DETAILS TABLE - COMPLETE SETUP
-- ============================================
-- Store user information when they signup/login
-- This table is automatically populated when users signup

-- Create user_details table
CREATE TABLE user_details (
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
  login_count INTEGER DEFAULT 1
);

-- Create indexes for faster lookups
CREATE INDEX idx_user_details_user_id ON user_details(user_id);
CREATE INDEX idx_user_details_email ON user_details(email);
CREATE INDEX idx_user_details_created_at ON user_details(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own data
CREATE POLICY "Users can view own data"
  ON user_details
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON user_details
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policy: Allow service role to insert (for the trigger)
CREATE POLICY "Service role can insert user data"
  ON user_details
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Users can delete their own data
CREATE POLICY "Users can delete own data"
  ON user_details
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at on row update
DROP TRIGGER IF EXISTS set_updated_at ON user_details;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_details
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Function to automatically create user_details on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_details (user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user_details on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update login tracking
CREATE OR REPLACE FUNCTION update_user_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_details
  SET 
    last_login_at = NEW.last_sign_in_at,
    login_count = login_count + 1
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update login info on successful login
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at)
  EXECUTE FUNCTION update_user_login();