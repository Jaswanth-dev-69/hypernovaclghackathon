const supabase = require('../src/config/supabase');

/**
 * Test script to verify database setup and user creation
 */
async function testDatabase() {
  console.log('🧪 Testing Supabase Database Setup\n');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // Test 1: Check if users table exists
    console.log('Test 1: Checking users table...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (tableError) {
      console.log('❌ FAILED: Users table does not exist');
      console.log('   Error:', tableError.message);
      console.log('\n👉 Run the SQL schema first!');
      console.log('   See: backend/database/SETUP_INSTRUCTIONS.md\n');
      return;
    }

    console.log('✅ PASSED: Users table exists\n');

    // Test 2: Query existing users
    console.log('Test 2: Fetching existing users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.log('❌ FAILED:', usersError.message);
      return;
    }

    console.log(`✅ PASSED: Found ${users.length} user(s)\n`);

    if (users.length > 0) {
      console.log('📋 Existing Users:');
      console.log('─────────────────────────────────────────────────');
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
        console.log(`   Last Login: ${user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}`);
        console.log(`   Active: ${user.is_active ? 'Yes' : 'No'}`);
        console.log('');
      });
    } else {
      console.log('ℹ️  No users found yet. Try creating one via signup!\n');
    }

    // Test 3: Check database permissions
    console.log('Test 3: Checking database permissions...');
    const { data: permCheck, error: permError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (permError) {
      console.log('⚠️  WARNING: Permission issue');
      console.log('   This might affect RLS policies');
      console.log('   Error:', permError.message);
    } else {
      console.log('✅ PASSED: Database permissions OK\n');
    }

    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 Database test completed!\n');
    console.log('Next steps:');
    console.log('1. Start the backend: npm start');
    console.log('2. Start the frontend: npm run dev');
    console.log('3. Create a new user via signup page');
    console.log('4. Check Supabase Dashboard > Table Editor > users\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n📖 See: backend/database/SETUP_INSTRUCTIONS.md');
  }
}

// Run tests
testDatabase();
