# 📊 Supabase Database Setup Instructions

## Quick Setup (5 minutes)

### Step 1: Access Supabase SQL Editor

1. Go to **[Supabase Dashboard](https://app.supabase.com/)**
2. Select your project: **kpzfnzyqxtiauuxljhzr**
3. Click **"SQL Editor"** in the left sidebar
4. Click **"+ New Query"** button

### Step 2: Run the Schema

1. Open the file: `backend/database/schema.sql`
2. Copy the **entire SQL script**
3. Paste it into the Supabase SQL Editor
4. Click the **"Run"** button (or press F5)
5. Wait for "Success. No rows returned" message

### Step 3: Verify Table Creation

1. Click **"Table Editor"** in the left sidebar
2. You should see a new table called **"users"**
3. Click on the table to view its structure

### Step 4: Test the Setup

Run this test query in SQL Editor:
```sql
SELECT * FROM public.users;
```

You should see an empty table with these columns:
- id
- email
- username
- full_name
- avatar_url
- created_at
- updated_at
- last_login
- is_active
- metadata

---

## What This Creates

### 📋 Users Table
Stores additional user information beyond Supabase Auth:
- **id**: UUID linked to auth.users
- **email**: User's email (unique)
- **username**: Display name (unique)
- **full_name**: Optional full name
- **avatar_url**: Profile picture URL
- **created_at**: Registration timestamp
- **updated_at**: Last modification time
- **last_login**: Last login timestamp
- **is_active**: Account status
- **metadata**: Additional JSON data

### 🔒 Security Features
- **Row Level Security (RLS)** enabled
- Users can only see their own data
- Users can only update their own data
- Automatic triggers for new users

### ⚡ Automatic Features
- **Auto-creates user profile** when someone signs up
- **Auto-updates timestamps** on data changes
- **Indexes** for fast email/username lookups

---

## Alternative: Run via API

If you prefer, you can also execute this via the backend:

```javascript
// In backend, run once:
const { supabase } = require('./src/config/supabase');
const fs = require('fs');

async function setupDatabase() {
  const schema = fs.readFileSync('./database/schema.sql', 'utf8');
  const { error } = await supabase.rpc('exec_sql', { sql: schema });
  
  if (error) console.error('Error:', error);
  else console.log('✅ Database setup complete!');
}

setupDatabase();
```

---

## Troubleshooting

### Error: "permission denied for schema auth"
- This is normal - the trigger needs to be created by Supabase
- Use the SQL Editor method above

### Error: "relation already exists"
- Table is already created
- You can safely ignore this

### Table not appearing
1. Refresh the Table Editor page
2. Check you're in the correct project
3. Verify the SQL ran without errors

---

## Next Steps

After running the SQL:
1. ✅ Table is created
2. ✅ Restart backend server
3. ✅ Try creating a new user via signup
4. ✅ Check Supabase Table Editor - user should appear!

---

**Ready to test!** 🚀
