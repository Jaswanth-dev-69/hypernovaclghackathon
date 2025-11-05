# 📧 Email Confirmation Quick Setup

## ⚡ Quick Start (5 minutes)

### 1. Supabase Dashboard Settings

Go to: https://supabase.com/dashboard/project/kpzfnzyqxtiauuxljhzr/auth/url-configuration

**Required Settings:**
```
✅ Enable email confirmations: CHECKED
✅ Site URL: http://localhost:3000
✅ Redirect URLs: 
   - http://localhost:3000/auth/callback
   - http://localhost:3000/**
```

### 2. Test Email Setup (Optional but Recommended)

```powershell
cd backend
npm run test:email
```

This will:
- Test Supabase connection
- Create a test user
- Verify email confirmation is enabled
- Show you exactly what will happen

### 3. Start Your Servers

**Backend:**
```powershell
cd backend
npm start
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

### 4. Test Complete Flow

1. Go to: http://localhost:3000/signup
2. Sign up with YOUR REAL EMAIL
3. Check your email inbox (and spam folder!)
4. Click the confirmation link
5. You'll be redirected and logged in automatically

---

## 📊 What Happens When User Signs Up

```
User fills signup form
       ↓
Backend creates user in auth.users
       ↓
Supabase sends email to user
       ↓
Frontend shows "Check your email"
       ↓
User clicks link in email
       ↓
Redirected to /auth/callback
       ↓
Email confirmed automatically
       ↓
User logged in
       ↓
Database trigger creates user_details entry
       ↓
User redirected to home page
```

---

## 🚨 Quick Troubleshooting

### No email received?

1. **Check spam folder** - Most common issue!
2. **Wait 1-2 minutes** - Email can be delayed
3. **Check rate limit** - Free tier: 4 emails/hour
4. **Verify settings** - Email confirmations must be enabled

### Link doesn't work?

1. Check Redirect URLs include: `http://localhost:3000/auth/callback`
2. Make sure link has `#access_token=` in it
3. Check browser console for errors (F12)

### "Invalid credentials" after confirmation?

This means email is confirmed but wrong password. Try:
- Reset password in Supabase Dashboard
- Or signup with a new email

---

## ✅ Pre-Launch Checklist

Before testing:
- [ ] Supabase email confirmations: **ENABLED**
- [ ] Site URL: `http://localhost:3000`
- [ ] Redirect URLs added
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 3000)
- [ ] Real email address ready for testing
- [ ] `user_details` table created (run SQL if not)

---

## 📧 Email Details

**From:** noreply@mail.app.supabase.io  
**Subject:** Confirm your signup  
**Rate Limit:** 4 emails/hour (free tier)  
**Delivery Time:** Usually 10-60 seconds  

---

## 🎯 Success Indicators

✅ After signup:
- Green success message shown
- "Check your email" displayed
- No error in backend logs

✅ Email received:
- From Supabase
- Contains confirmation link
- Link starts with `http://localhost:3000/auth/callback`

✅ After clicking link:
- Loading spinner shown
- Green checkmark appears
- Redirected to home page
- User is logged in

✅ In database:
- `auth.users` has your email with `email_confirmed_at` timestamp
- `user_details` has matching entry
- `login_count` is 0

---

## 🔧 Need Help?

Check the full guide: `EMAIL_SETUP_GUIDE.md`

Run test script:
```powershell
cd backend
npm run test:email
```

Check backend logs:
```powershell
# In backend terminal window
# Look for "User registered successfully" message
```

---

**That's it! You're ready to go! 🚀**
