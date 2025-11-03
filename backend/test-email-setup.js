// Test Email Configuration
// Run this to verify your Supabase email settings

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testEmailSetup() {
  console.log('\n🧪 Testing Email Configuration...\n');

  // Test 1: Check Supabase connection
  console.log('1️⃣ Testing Supabase connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log('✅ Supabase connected successfully\n');
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return;
  }

  // Test 2: Test signup with email confirmation
  console.log('2️⃣ Testing signup with email confirmation...');
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/callback`,
        data: {
          username: 'testuser',
          full_name: 'Test User'
        }
      }
    });

    if (error) throw error;

    console.log('✅ Signup request successful!');
    console.log('📧 Confirmation email behavior:');
    
    if (data.user && !data.session) {
      console.log('   ✅ Email confirmation is ENABLED');
      console.log('   ✅ User created but not logged in yet');
      console.log('   ✅ Confirmation email should be sent');
      console.log('   📧 Check your email at:', testEmail);
      console.log('\n📊 User Details:');
      console.log('   - User ID:', data.user.id);
      console.log('   - Email:', data.user.email);
      console.log('   - Email Confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No (pending)');
      console.log('   - Created At:', data.user.created_at);
    } else if (data.user && data.session) {
      console.log('   ⚠️  Email confirmation is DISABLED');
      console.log('   ⚠️  User is automatically logged in');
      console.log('   ⚠️  No confirmation email will be sent');
      console.log('\n❗ To enable email confirmation:');
      console.log('   1. Go to Supabase Dashboard → Auth → Settings');
      console.log('   2. Check "Enable email confirmations"');
      console.log('   3. Save settings');
    }

    console.log('\n✅ Email setup test completed!\n');
  } catch (error) {
    console.error('❌ Signup test failed:', error.message);
    console.log('\n💡 Common issues:');
    console.log('   - Rate limit exceeded (4 emails/hour on free tier)');
    console.log('   - Invalid email template in Supabase');
    console.log('   - Email confirmations not enabled in dashboard');
  }
}

// Run the test
testEmailSetup().then(() => {
  console.log('🏁 Test complete. Press Ctrl+C to exit.\n');
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
