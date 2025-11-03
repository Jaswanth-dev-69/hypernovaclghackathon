// Quick check if user_details table exists in Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function checkTable() {
  console.log('\n🔍 Checking if user_details table exists...\n');

  try {
    const { data, error } = await supabase
      .from('user_details')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('❌ user_details table DOES NOT EXIST!\n');
        console.log('📝 You need to create it. Follow these steps:\n');
        console.log('1. Go to Supabase Dashboard SQL Editor:');
        console.log('   https://supabase.com/dashboard/project/kpzfnzyqxtiauuxljhzr/sql/new\n');
        console.log('2. Copy ALL content from: backend/database/user_details_schema.sql\n');
        console.log('3. Paste in SQL Editor and click RUN\n');
        console.log('4. Run this script again to verify\n');
      } else {
        console.log('❌ Error checking table:', error.message);
      }
      process.exit(1);
    }

    console.log('✅ user_details table EXISTS!\n');
    console.log('🎉 Your database is ready for email signups!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkTable();
