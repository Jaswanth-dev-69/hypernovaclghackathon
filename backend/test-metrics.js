// Test script to verify metrics endpoint
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/metrics',
  method: 'GET'
};

console.log('Testing metrics endpoint...');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n✅ Metrics endpoint is working!');
    console.log('\n📊 Sample metrics:');
    const lines = data.split('\n').filter(line => 
      line.includes('hypernova') && !line.startsWith('#')
    ).slice(0, 10);
    lines.forEach(line => console.log(line));
    console.log(`\n... and ${data.split('\n').length - lines.length} more metrics`);
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\nMake sure the backend server is running:');
  console.log('  cd backend');
  console.log('  npm start');
});

req.end();
