# 📧 Email Confirmation Setup Guide

This guide will help you enable email confirmation for user signups in your HyperNova project.

## ✅ What's Been Done

1. **Backend Updated**: 
   - `authController.js` now sends confirmation emails
   - Redirect URL set to: `http://localhost:3000/auth/callback`

2. **Frontend Created**:
   - Email confirmation page: `/auth/callback`
   - Success/error handling
   - Automatic redirect after confirmation

3. **User Flow**:
   ```
   User signs up → Email sent → User clicks link → Email confirmed → User redirected to home
   ```

---

## 🔧 Supabase Dashboard Configuration

### Step 1: Enable Email Confirmations

1. Go to your Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/kpzfnzyqxtiauuxljhzr/auth/url-configuration
   ```

2. Find **"Enable email confirmations"** checkbox

3. **CHECK** this box (enable it)

4. Click **Save**

### Step 2: Configure Site URL

1. In the same page, find **"Site URL"** field

2. Set it to your frontend URL:
   - **Development**: `http://localhost:3000`
   - **Production**: `https://your-domain.com` (when you deploy)

3. Click **Save**

### Step 3: Configure Redirect URLs

1. Find **"Redirect URLs"** section

2. Add these URLs (one per line):
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

3. For production, also add:
   ```
   https://your-domain.com/auth/callback
   https://your-domain.com/**
   ```

4. Click **Save**

### Step 4: Customize Email Template (Optional)

1. Go to Email Templates:
   ```
   https://supabase.com/dashboard/project/kpzfnzyqxtiauuxljhzr/auth/templates
   ```

2. Select **"Confirm signup"** template

3. Customize the email content (optional):
   ```html
   <h2>Confirm your signup</h2>
   <p>Welcome to HyperNova! Click the link below to confirm your email:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
   ```

4. Make sure `{{ .ConfirmationURL }}` is in the template

5. Click **Save**

---

## 🧪 Testing the Email Flow

### Test Signup:

1. **Start Backend**:
   ```powershell
   cd backend
   npm start
   ```

2. **Start Frontend**:
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Sign Up**:
   - Go to `http://localhost:3000/signup`
   - Fill in the form with a REAL email address (one you can check)
   - Click "Create Account"
   - You should see: **"Success! Check your email"**

4. **Check Email**:
   - Open your email inbox
   - Look for email from: `noreply@mail.app.supabase.io`
   - Subject: "Confirm your signup"
   - Click the confirmation link

5. **Confirm Email**:
   - You'll be redirected to: `http://localhost:3000/auth/callback`
   - See loading spinner → Success checkmark
   - Automatically redirected to home page
   - User is now logged in!

---

## 🔍 Verify User in Database

After email confirmation:

1. Go to Supabase Table Editor:
   ```
   https://supabase.com/dashboard/project/kpzfnzyqxtiauuxljhzr/editor
   ```

2. Click **"auth"** schema → **"users"** table

3. Find your user - check columns:
   - `email_confirmed_at`: Should have a timestamp
   - `confirmed_at`: Should have a timestamp
   - `email`: Your email address

4. Click **"public"** schema → **"user_details"** table

5. Find your user - check columns:
   - `user_id`: Matches the auth.users.id
   - `email`: Your email address
   - `login_count`: Should be 0 (will increment on first login)

---

## 🚨 Troubleshooting

### Email Not Received?

1. **Check Spam Folder**:
   - Supabase emails often land in spam
   - Look for: `noreply@mail.app.supabase.io`

2. **Check Email Settings**:
   - Dashboard → Authentication → Email
   - Verify "Enable email confirmations" is checked
   - Check rate limits (Supabase free tier: 4 emails/hour)

3. **Check Server Logs**:
   ```powershell
   # Backend terminal
   # Look for signup success message
   ```

4. **Resend Confirmation**:
   - Supabase Dashboard → Authentication → Users
   - Find the user
   - Click "..." → "Resend confirmation email"

### Confirmation Link Not Working?

1. **Check Redirect URLs**:
   - Dashboard → Auth → URL Configuration
   - Make sure `http://localhost:3000/auth/callback` is in Redirect URLs

2. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Look for errors on `/auth/callback` page

3. **Check Link Format**:
   - Link should look like: `http://localhost:3000/auth/callback#access_token=...`
   - Should have `#access_token=` in URL

### User Can't Login After Confirmation?

1. **Check Email Confirmed**:
   ```sql
   -- Run in Supabase SQL Editor
   SELECT id, email, email_confirmed_at, confirmed_at 
   FROM auth.users 
   WHERE email = 'your-email@example.com';
   ```

2. **Check RLS Policies**:
   - Make sure `user_details` table has correct policies
   - Run the SQL from `user_details_schema.sql` if needed

3. **Try Login**:
   - Go to `/login` page
   - Enter email and password
   - Should work after email confirmation

---

## 📊 Check Metrics

After successful signup and login:

1. **Backend Metrics**:
   ```
   http://localhost:5000/metrics
   ```
   - Look for: `hypernova_auth_attempts_total{method="signup"}`
   - Look for: `hypernova_auth_attempts_total{method="login"}`

2. **Prometheus** (if running):
   ```
   http://localhost:9090
   ```
   - Query: `hypernova_auth_attempts_total`

---

## 🌐 Production Setup (Render)

When you deploy to Render:

1. **Add Environment Variable**:
   ```
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Update Supabase Settings**:
   - Site URL → Your production domain
   - Redirect URLs → Add production callback URL

3. **Update Email Template**:
   - Make sure it uses `{{ .ConfirmationURL }}` (works for all environments)

---

## 📝 User Flow Summary

```
┌─────────────────────────────────────────────────────────┐
│ 1. User signs up on /signup                              │
│    - Enters username, email, password                    │
│    - Clicks "Create Account"                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Backend creates auth.users entry                      │
│    - User is NOT logged in yet                           │
│    - email_confirmed_at is NULL                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Supabase sends confirmation email                     │
│    - From: noreply@mail.app.supabase.io                  │
│    - Contains magic link                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Frontend shows success message                        │
│    "Success! Check your email"                           │
│    - User waits for email                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. User clicks confirmation link in email                │
│    - Redirected to: /auth/callback#access_token=...      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Callback page sets session                            │
│    - Extracts tokens from URL hash                       │
│    - Calls supabase.auth.setSession()                    │
│    - Shows success checkmark                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 7. Database trigger creates user_details                 │
│    - handle_new_user() function runs                     │
│    - Populates user info                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 8. User redirected to home page                          │
│    - Logged in automatically                             │
│    - Can start shopping!                                 │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

Before testing, make sure:

- [ ] Backend `.env` has `FRONTEND_URL=http://localhost:3000`
- [ ] Supabase "Enable email confirmations" is **CHECKED**
- [ ] Supabase Site URL is set to `http://localhost:3000`
- [ ] Supabase Redirect URLs includes `http://localhost:3000/auth/callback`
- [ ] `user_details` table exists in database
- [ ] Backend server is running (`npm start` in backend/)
- [ ] Frontend server is running (`npm run dev` in frontend/)
- [ ] You have access to a real email address for testing

---

## 🎉 You're All Set!

Email confirmation is now enabled! Users will:
1. ✅ Sign up with email/password
2. ✅ Receive confirmation email
3. ✅ Click link to confirm
4. ✅ Get automatically logged in
5. ✅ Data stored in `user_details` table

**Support**: If you need help, check the troubleshooting section above.
