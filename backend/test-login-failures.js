// Test Login Failures - Generate Metrics for IBM Data Prep Kit
const http = require('http');

const API_URL = 'http://localhost:5000';

// Simple fetch wrapper using http
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          text: () => Promise.resolve(data),
          json: () => Promise.resolve(JSON.parse(data))
        });
      });
    });
    
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// Test credentials (all should fail)
const wrongCredentials = [
  { email: 'wrong1@test.com', password: 'wrongpass123' },
  { email: 'wrong2@test.com', password: 'badpassword' },
  { email: 'fake@example.com', password: 'incorrect' },
  { email: 'notreal@test.com', password: 'wrongpw456' },
  { email: 'invalid@mail.com', password: 'badcreds' },
];

async function testFailedLogin(email, password) {
  try {
    console.log(`\n🔐 Testing failed login: ${email}`);
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.status === 401) {
      console.log(`   ❌ Login failed (as expected): ${data.message}`);
      return true;
    } else {
      console.log(`   ⚠️  Unexpected response: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    return false;
  }
}

async function getMetrics() {
  try {
    const response = await fetch(`${API_URL}/metrics`);
    const metricsText = await response.text();
    
    // Extract login failure metrics
    const lines = metricsText.split('\n');
    const loginFailures = lines.filter(line => 
      line.includes('hypernova_login_failures_total') && 
      !line.startsWith('#')
    );
    
    console.log('\n📊 Current Login Failure Metrics:');
    console.log('─'.repeat(60));
    
    if (loginFailures.length === 0) {
      console.log('   No failed logins yet');
    } else {
      loginFailures.forEach(line => {
        const match = line.match(/reason="([^"]+)".*?(\d+)$/);
        if (match) {
          console.log(`   ❌ ${match[1]}: ${match[2]} failures`);
        }
      });
    }
    
    // Extract total auth attempts
    const authAttempts = lines.filter(line => 
      line.includes('hypernova_auth_attempts_total') && 
      !line.startsWith('#')
    );
    
    console.log('\n📈 Total Auth Attempts:');
    console.log('─'.repeat(60));
    authAttempts.forEach(line => {
      const statusMatch = line.match(/status="([^"]+)".*?type="([^"]+)".*?(\d+)$/);
      if (statusMatch) {
        console.log(`   ${statusMatch[1] === 'success' ? '✅' : '❌'} ${statusMatch[2]}: ${statusMatch[3]} attempts`);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to fetch metrics:', error.message);
  }
}

async function runTest() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  LOGIN FAILURE METRICS TEST - IBM DATA PREP KIT READY ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  // Show metrics before test
  console.log('\n📊 BEFORE TEST:');
  await getMetrics();
  
  // Run failed login attempts
  console.log('\n\n🧪 TESTING FAILED LOGINS:');
  console.log('─'.repeat(60));
  
  let successCount = 0;
  for (const creds of wrongCredentials) {
    const result = await testFailedLogin(creds.email, creds.password);
    if (result) successCount++;
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  }
  
  console.log('\n\n✅ Test completed: Generated ' + successCount + ' failed login attempts');
  
  // Show updated metrics
  console.log('\n\n📊 AFTER TEST:');
  await getMetrics();
  
  // Show how to access metrics
  console.log('\n\n🔗 ACCESS METRICS:');
  console.log('─'.repeat(60));
  console.log(`   Direct endpoint: ${API_URL}/metrics`);
  console.log('   Browser: http://localhost:5000/metrics');
  console.log('   \n   For IBM Data Prep Kit:');
  console.log('   1. Scrape http://localhost:5000/metrics');
  console.log('   2. Parse Prometheus text format');
  console.log('   3. Extract hypernova_login_failures_total metrics');
  
  console.log('\n\n🎯 NEXT STEPS:');
  console.log('─'.repeat(60));
  console.log('   1. Open: http://localhost:5000/metrics');
  console.log('   2. Search for: hypernova_login_failures_total');
  console.log('   3. See updated failure counts');
  console.log('   4. Use in IBM Data Prep Kit pipeline');
  
  console.log('\n\n📝 PROMETHEUS SETUP (Optional):');
  console.log('─'.repeat(60));
  console.log('   If you want historical data:');
  console.log('   1. Install Docker Desktop');
  console.log('   2. Run: docker compose up -d');
  console.log('   3. Access: http://localhost:9090');
  console.log('   4. Query: hypernova_login_failures_total');
  
  console.log('\n' + '═'.repeat(60) + '\n');
}

// Run the test
runTest().catch(err => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
