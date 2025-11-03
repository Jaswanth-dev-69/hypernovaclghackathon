// Complete Database Verification Script
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function verifySetup() {
  console.log('\n🔍 VERIFYING COMPLETE DATABASE SETUP\n');
  console.log('='.repeat(60));
  
  let allGood = true;

  // Test 1: Check cart_items table
  console.log('\n📦 1. Checking cart_items table...');
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('count')
      .limit(1);

    if (error) {
      console.log('   ❌ cart_items table NOT FOUND');
      console.log(`   Error: ${error.message}`);
      allGood = false;
    } else {
      console.log('   ✅ cart_items table EXISTS');
    }
  } catch (err) {
    console.log('   ❌ cart_items table ERROR:', err.message);
    allGood = false;
  }

  // Test 2: Check user_details table
  console.log('\n👤 2. Checking user_details table...');
  try {
    const { data, error } = await supabase
      .from('user_details')
      .select('count')
      .limit(1);

    if (error) {
      console.log('   ❌ user_details table NOT FOUND');
      console.log(`   Error: ${error.message}`);
      allGood = false;
    } else {
      console.log('   ✅ user_details table EXISTS');
    }
  } catch (err) {
    console.log('   ❌ user_details table ERROR:', err.message);
    allGood = false;
  }

  // Test 3: Check Supabase connection
  console.log('\n🌐 3. Checking Supabase connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message !== 'no session') {
      console.log('   ⚠️  Supabase auth warning:', error.message);
    } else {
      console.log('   ✅ Supabase connection OK');
    }
  } catch (err) {
    console.log('   ❌ Supabase connection ERROR:', err.message);
    allGood = false;
  }

  // Test 4: Check environment variables
  console.log('\n⚙️  4. Checking environment variables...');
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'FRONTEND_URL', 'PORT'];
  let envGood = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName} is set`);
    } else {
      console.log(`   ❌ ${varName} is MISSING`);
      envGood = false;
      allGood = false;
    }
  });

  // Final Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 VERIFICATION SUMMARY:\n');

  if (allGood) {
    console.log('✅ ALL CHECKS PASSED!');
    console.log('\n🎉 Your database is ready for signups!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure backend is running: npm start');
    console.log('   2. Make sure frontend is running: npm run dev');
    console.log('   3. Configure Supabase email settings (see COMPLETE_FIX_GUIDE.md)');
    console.log('   4. Test signup at: http://localhost:3000/signup\n');
  } else {
    console.log('❌ SOME CHECKS FAILED!');
    console.log('\n🔧 Fix required:');
    console.log('   1. Go to Supabase SQL Editor');
    console.log('   2. Copy content from: backend/database/COMPLETE_DATABASE_SETUP.sql');
    console.log('   3. Paste and click RUN');
    console.log('   4. Run this script again to verify\n');
  }

  console.log('='.repeat(60) + '\n');
}

// Run verification
verifySetup().catch(err => {
  console.error('\n❌ Verification failed:', err.message);
  process.exit(1);
});
