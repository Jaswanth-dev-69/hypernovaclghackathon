const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('🗄️  USER DETAILS TABLE SETUP FOR SUPABASE');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('📄 SQL Schema File: backend/database/user_details_schema.sql\n');

console.log('⚠️  This requires MANUAL execution in Supabase Dashboard');
console.log('   (Service Role Key needed for automated setup)\n');

console.log('═══════════════════════════════════════════════════════════════');
console.log('📋 STEP-BY-STEP INSTRUCTIONS:');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('STEP 1: Open Supabase Dashboard');
console.log('   🌐 Go to: https://supabase.com/dashboard\n');

console.log('STEP 2: Select Your Project');
console.log('   📂 Project: kpzfnzyqxtiauuxljhzr\n');

console.log('STEP 3: Open SQL Editor');
console.log('   ⚡ Click: SQL Editor (left sidebar)\n');

console.log('STEP 4: Create New Query');
console.log('   ➕ Click: "New Query" button\n');

console.log('STEP 5: Copy SQL Content');
console.log('   📋 File location: J:\\hypernovahackathon\\backend\\database\\user_details_schema.sql\n');

try {
  const sqlFilePath = path.join(__dirname, 'user_details_schema.sql');
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  console.log('✅ SQL file loaded successfully!');
  console.log(`   Total lines: ${sqlContent.split('\n').length}\n`);
  
  console.log('STEP 6: Paste & Execute');
  console.log('   1. Open the file: backend/database/user_details_schema.sql');
  console.log('   2. Copy ALL content (Ctrl+A, Ctrl+C)');
  console.log('   3. Paste into Supabase SQL Editor');
  console.log('   4. Click "Run" button (or press Ctrl+Enter)\n');

  console.log('STEP 7: Verify Success');
  console.log('   ✅ You should see success messages in the output');
  console.log('   ✅ Go to: Table Editor → user_details table should exist\n');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 WHAT THIS SQL DOES:');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Creates:');
  console.log('   ✅ user_details table (stores user info)');
  console.log('   ✅ RLS policies (security)');
  console.log('   ✅ Auto-signup trigger (creates entry on new user)');
  console.log('   ✅ Auto-login trigger (tracks login count & timestamp)');
  console.log('   ✅ Indexes (fast queries)\n');

  console.log('Columns:');
  console.log('   • id (UUID)');
  console.log('   • user_id (references auth.users)');
  console.log('   • email');
  console.log('   • full_name');
  console.log('   • avatar_url');
  console.log('   • phone');
  console.log('   • address (JSONB)');
  console.log('   • preferences (JSONB)');
  console.log('   • created_at');
  console.log('   • updated_at');
  console.log('   • last_login_at');
  console.log('   • login_count\n');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🧪 TESTING AFTER SETUP:');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('1. Test Signup:');
  console.log('   • Create new user in your app');
  console.log('   • Check Supabase → user_details table');
  console.log('   • New entry should appear automatically!\n');

  console.log('2. Test Login:');
  console.log('   • Login with existing user');
  console.log('   • Check user_details table');
  console.log('   • last_login_at and login_count should update!\n');

  console.log('3. Verify in SQL Editor:');
  console.log('   SELECT * FROM user_details ORDER BY created_at DESC;\n');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🚀 READY TO START!');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Copy this path and open the file:');
  console.log('📂 J:\\hypernovahackathon\\backend\\database\\user_details_schema.sql\n');

} catch (error) {
  console.error('❌ Error reading SQL file:', error.message);
  console.log('\nMake sure the file exists at:');
  console.log('   J:\\hypernovahackathon\\backend\\database\\user_details_schema.sql\n');
}
