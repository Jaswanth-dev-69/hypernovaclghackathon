# 🎯 Complete Authentication with Supabase Table Setup

## 📋 What This Does

This setup creates a **custom users table** in Supabase that stores:
- ✅ User email and password (via Supabase Auth)
- ✅ Username and full name
- ✅ Creation and login timestamps
- ✅ User profile data
- ✅ **Automatically reflects in Supabase Dashboard**

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create the Database Table

#### Option A: Via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com/
   - Login and select project: **kpzfnzyqxtiauuxljhzr**

2. **Open SQL Editor**
   - Click **"SQL Editor"** in left sidebar
   - Click **"+ New Query"** button

3. **Run the Schema**
   - Open file: `backend/database/schema.sql`
   - **Copy ALL the SQL code**
   - Paste into Supabase SQL Editor
   - Click **"Run"** (or press F5)
   - Wait for success message

4. **Verify Table Created**
   - Click **"Table Editor"** in left sidebar
   - You should see **"users"** table
   - Click on it to see the structure

#### Option B: Via Command Line

```bash
cd backend
npm run db:setup
```

Then follow the instructions to run SQL in dashboard.

---

### Step 2: Test Database Connection

Run the test script:

```bash
cd backend
npm run db:test
```

You should see:
```
✅ PASSED: Users table exists
✅ PASSED: Found 0 user(s)
✅ PASSED: Database permissions OK
```

---

### Step 3: Restart Backend Server

Make sure backend picks up the new database service:

```bash
cd backend
npm start
```

Backend should show:
```
🚀 Server running on port 5000
🔐 Supabase URL: https://kpzfnzyqxtiauuxljhzr.supabase.co
```

---

## 📊 Database Schema

The **users** table has these columns:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (linked to auth.users) |
| `email` | VARCHAR | User's email (unique) |
| `username` | VARCHAR | Display name (unique) |
| `full_name` | VARCHAR | Optional full name |
| `avatar_url` | TEXT | Profile picture URL |
| `created_at` | TIMESTAMP | When account was created |
| `updated_at` | TIMESTAMP | Last profile update |
| `last_login` | TIMESTAMP | Last successful login |
| `is_active` | BOOLEAN | Account status (true/false) |
| `metadata` | JSONB | Additional custom data |

---

## 🔄 How It Works

### When a user signs up:

1. **Frontend** sends email, password, username to backend
2. **Supabase Auth** creates authentication account
3. **Database Trigger** automatically creates user profile in `users` table
4. **Backend** verifies table entry was created
5. **User data appears in Supabase Dashboard** → Table Editor → users

### When a user logs in:

1. **Supabase Auth** validates credentials
2. **Backend** fetches complete profile from `users` table
3. **Backend** updates `last_login` timestamp
4. **Frontend** receives user data + session token

---

## 🧪 Testing the Setup

### Test 1: Check Database

```bash
cd backend
npm run db:test
```

Expected output:
```
Test 1: Checking users table...
✅ PASSED: Users table exists

Test 2: Fetching existing users...
✅ PASSED: Found X user(s)

Test 3: Checking database permissions...
✅ PASSED: Database permissions OK
```

### Test 2: Create a Test User

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

2. **Open browser:** http://localhost:3000

3. **Sign up:**
   - Click "Sign up"
   - Enter: email, username, password
   - Click "Create Account"

4. **Check Supabase Dashboard:**
   - Go to Table Editor → users
   - **Your user should appear!** ✅

### Test 3: Check API Endpoints

```bash
# Get all users (for testing)
curl http://localhost:5000/api/auth/users
```

Expected response:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "uuid-here",
      "email": "test@example.com",
      "username": "testuser",
      "created_at": "2025-11-02T...",
      "last_login": "2025-11-02T...",
      "is_active": true
    }
  ]
}
```

---

## 📁 Updated Files

### Backend Files Created:
```
backend/
├── database/
│   ├── schema.sql              ← SQL to create users table
│   ├── SETUP_INSTRUCTIONS.md   ← Detailed setup guide
│   ├── setup.js                ← Setup helper script
│   └── test.js                 ← Test database connection
├── src/
│   ├── services/
│   │   └── userService.js      ← Database operations
│   └── controllers/
│       └── authController.js   ← Updated with table operations
```

### New Features in Backend:

1. **User Service** (`src/services/userService.js`)
   - `createUser()` - Insert new user in table
   - `getUserById()` - Get user by ID
   - `getUserByEmail()` - Get user by email
   - `updateLastLogin()` - Update login timestamp
   - `updateUserProfile()` - Update user data
   - `getAllUsers()` - List all users

2. **Updated Auth Controller** (`src/controllers/authController.js`)
   - Signup now creates table entry
   - Login fetches complete profile
   - Login updates last_login timestamp
   - New endpoint: GET `/api/auth/users`

---

## 🔐 Security Features

### Row Level Security (RLS)
- ✅ Users can only see their own data
- ✅ Users can only update their own data
- ✅ Automatic user creation via trigger

### Automatic Features
- ✅ Auto-generates user profile on signup
- ✅ Auto-updates timestamps
- ✅ Indexed for fast lookups
- ✅ Linked to Supabase Auth (cascade delete)

---

## 📱 API Endpoints

### Authentication

**POST** `/api/auth/signup`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe",
  "full_name": "John Doe"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response includes:**
```json
{
  "success": true,
  "data": {
    "user": { ... },      // Supabase auth user
    "session": { ... },   // JWT token
    "profile": {          // Custom table data ✨
      "id": "...",
      "email": "...",
      "username": "...",
      "created_at": "...",
      "last_login": "..."
    }
  }
}
```

**GET** `/api/auth/users` - Get all users (testing only)

---

## 🎯 Verification Checklist

After setup, verify these:

- [ ] SQL ran successfully in Supabase Dashboard
- [ ] `users` table visible in Table Editor
- [ ] Backend server starts without errors
- [ ] `npm run db:test` shows all tests passed
- [ ] Can create new user via signup page
- [ ] New user appears in Supabase Table Editor
- [ ] Login works and updates last_login
- [ ] User data persists across sessions

---

## 🐛 Troubleshooting

### Issue: "relation public.users does not exist"

**Solution:** The SQL hasn't been run yet.
1. Go to Supabase Dashboard
2. Run the SQL from `backend/database/schema.sql`
3. Restart backend server

### Issue: "permission denied for schema auth"

**Solution:** This is normal - use the Supabase Dashboard SQL Editor method.

### Issue: User created but not in table

**Solution:** 
1. Check if database trigger is working
2. Manually verify in Supabase Dashboard → Authentication → Users
3. Run: `npm run db:test` to check table

### Issue: Duplicate key error

**Solution:** User already exists with that email or username.
- Use different email/username
- Or delete old user from Supabase

---

## 🎉 Success!

Once setup is complete:

1. ✅ Users table created in Supabase
2. ✅ Backend connected to database
3. ✅ Signup creates both auth + table entry
4. ✅ Login fetches complete user profile
5. ✅ All user data visible in Supabase Dashboard
6. ✅ **Every new user automatically appears in the table!**

---

## 📖 Next Steps

Now you can:
- View all users in Supabase Table Editor
- Track user login activity
- Add custom user fields to metadata
- Build user profiles
- Add user management features

---

**Ready to test!** 🚀

Create a new user and watch it appear in your Supabase dashboard!
