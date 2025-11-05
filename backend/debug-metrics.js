// Test script to debug metrics parsing
const { register } = require('prom-client');

async function testMetrics() {
  try {
    const metricsText = await register.metrics();
    console.log('=== RAW METRICS ===');
    console.log(metricsText);
    console.log('\n=== METRICS LENGTH ===');
    console.log(`Total length: ${metricsText.length} characters`);
    console.log(`Lines: ${metricsText.split('\n').length}`);
    
    // Parse metrics
    const lines = metricsText.split('\n');
    let metricCount = 0;
    let currentHelp = '';
    let currentType = '';
    
    console.log('\n=== PARSING METRICS ===');
    for (const line of lines) {
      if (line.startsWith('# HELP')) {
        const parts = line.substring(7).split(' ');
        currentHelp = parts.slice(1).join(' ');
        console.log(`HELP: ${currentHelp}`);
      } else if (line.startsWith('# TYPE')) {
        const parts = line.substring(7).split(' ');
        currentType = parts[1];
        console.log(`TYPE: ${currentType}`);
      } else if (line && !line.startsWith('#')) {
        metricCount++;
        console.log(`METRIC ${metricCount}: ${line.substring(0, 100)}...`);
      }
    }
    
    console.log(`\n=== TOTAL METRICS FOUND: ${metricCount} ===`);
  } catch (error) {
    console.error('Error:', error);
  }
}

testMetrics();
