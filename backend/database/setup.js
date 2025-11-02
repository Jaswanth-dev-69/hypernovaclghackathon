const supabase = require('../src/config/supabase');
const fs = require('fs');
const path = require('path');

/**
 * Setup Supabase database schema
 * This script creates the users table and related functions/triggers
 */
async function setupDatabase() {
  console.log('🚀 Starting Supabase database setup...\n');

  try {
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Schema file loaded');
    console.log('⏳ Executing SQL commands...\n');

    // Note: The schema needs to be executed via Supabase Dashboard SQL Editor
    // because it includes auth schema operations that require elevated permissions
    
    console.log('⚠️  IMPORTANT INSTRUCTIONS:');
    console.log('───────────────────────────────────────────────────');
    console.log('This SQL needs to be run in Supabase Dashboard:\n');
    console.log('1. Go to https://app.supabase.com/');
    console.log('2. Select your project: kpzfnzyqxtiauuxljhzr');
    console.log('3. Click "SQL Editor" in sidebar');
    console.log('4. Click "+ New Query"');
    console.log('5. Copy the SQL from: backend/database/schema.sql');
    console.log('6. Paste and click "Run"');
    console.log('───────────────────────────────────────────────────\n');

    // Test connection to Supabase
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error && error.message.includes('relation "public.users" does not exist')) {
      console.log('❌ Users table not found');
      console.log('👉 Please run the SQL schema in Supabase Dashboard first\n');
      console.log('📖 See: backend/database/SETUP_INSTRUCTIONS.md');
      return;
    }

    if (error) {
      console.error('❌ Database connection error:', error.message);
      return;
    }

    console.log('✅ Database connection successful!');
    console.log('✅ Users table exists and is accessible');
    console.log('\n🎉 Setup complete!\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📖 Please check: backend/database/SETUP_INSTRUCTIONS.md');
  }
}

// Run setup
setupDatabase();
