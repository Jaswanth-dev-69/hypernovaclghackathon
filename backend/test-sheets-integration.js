/**
 * Test script to verify Google Sheets integration
 * This will test all 5 tabs with sample data
 * 
 * Run with: node test-sheets-integration.js
 */

require('dotenv').config();
const sheetsLogger = require('./src/utils/googleSheetsLogger');

async function testSheetsIntegration() {
  console.log('🧪 Testing Google Sheets Integration...\n');
  
  // Initialize logger
  console.log('1️⃣  Initializing Google Sheets Logger...');
  const initialized = await sheetsLogger.initialize();
  
  if (!initialized) {
    console.error('❌ Failed to initialize Google Sheets Logger');
    console.error('Make sure GOOGLE_SHEETS_ID and GOOGLE_SERVICE_ACCOUNT_KEY are set in .env');
    process.exit(1);
  }
  
  console.log('✅ Google Sheets Logger initialized successfully\n');

  // Test 1: Authentication Tab
  console.log('2️⃣  Testing Authentication tab...');
  console.log('   Columns: Timestamp, Type, Status, Email, IP, UserAgent, Reason');
  await sheetsLogger.logAuth('login', 'success', 'test@example.com', {
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Test Browser)',
    reason: 'valid_credentials'
  });
  console.log('✅ Authentication test logged\n');

  // Wait a bit between requests
  await sleep(1000);

  // Test 2: CartOperations Tab
  console.log('3️⃣  Testing CartOperations tab...');
  console.log('   Columns: Timestamp, Operation, Status, UserID, ProductID, Quantity, ItemCount');
  await sheetsLogger.logCart('add', 'success', 'user-123', {
    productId: 'prod-456',
    quantity: 2,
    itemCount: 5
  });
  console.log('✅ CartOperations test logged\n');

  await sleep(1000);

  // Test 3: APIRequests Tab
  console.log('4️⃣  Testing APIRequests tab...');
  console.log('   Columns: Timestamp, Method, Path, StatusCode, Duration, UserID');
  await sheetsLogger.logRequest('GET', '/api/cart/user-123', 200, 0.145, 'user-123');
  console.log('✅ APIRequests test logged\n');

  await sleep(1000);

  // Test 4: Errors Tab
  console.log('5️⃣  Testing Errors tab...');
  console.log('   Columns: Timestamp, Type, Message, Stack, Endpoint, UserID');
  const testError = new Error('Test error for integration testing');
  await sheetsLogger.logError('test_error', testError.message, testError.stack, {
    endpoint: '/api/test',
    userId: 'test-user'
  });
  console.log('✅ Errors test logged\n');

  await sleep(1000);

  // Test 5: Metrics Tab
  console.log('6️⃣  Testing Metrics tab...');
  console.log('   Columns: Timestamp, MetricName, MetricType, Value, Labels, Help, Environment, NodeVersion');
  const testMetrics = [
    {
      name: 'test_metric_counter',
      type: 'counter',
      value: 42,
      labels: { env: 'test', status: 'success' },
      help: 'Test counter metric'
    },
    {
      name: 'test_metric_gauge',
      type: 'gauge',
      value: 3.14,
      labels: { env: 'test' },
      help: 'Test gauge metric'
    }
  ];
  await sheetsLogger.logMetrics(testMetrics);
  console.log('✅ Metrics test logged\n');

  console.log('🎉 All tests completed successfully!');
  console.log('\n📊 Check your Google Sheets to verify all 5 tabs received data:');
  console.log(`   https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}/edit`);
  console.log('\nExpected results:');
  console.log('  ✓ Authentication tab: 1 new row (login success)');
  console.log('  ✓ CartOperations tab: 1 new row (add item)');
  console.log('  ✓ APIRequests tab: 1 new row (GET request)');
  console.log('  ✓ Errors tab: 1 new row (test error)');
  console.log('  ✓ Metrics tab: 2 new rows (counter + gauge)\n');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run tests
testSheetsIntegration()
  .then(() => {
    console.log('✅ Test script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test script failed:', error);
    process.exit(1);
  });
