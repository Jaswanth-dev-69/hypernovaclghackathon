// fetchSheet.js - Google Sheets to CSV for Power BI
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SHEET_ID = process.env.SHEET_ID;
const SERVICE_ACCOUNT_JSON_PATH = process.env.SERVICE_ACCOUNT_JSON_PATH || './service-account.json';
const OUTPUT_DIR = './data';

async function getCreds() {
  if (!fs.existsSync(SERVICE_ACCOUNT_JSON_PATH)) {
    throw new Error(`Service account JSON not found at ${SERVICE_ACCOUNT_JSON_PATH}`);
  }
  const content = fs.readFileSync(SERVICE_ACCOUNT_JSON_PATH, 'utf8');
  return JSON.parse(content);
}

async function fetchSheetData(sheetName, outputFile) {
  console.log(`\n📊 Fetching ${sheetName}...`);
  
  const creds = await getCreds();
  
  const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  
  console.log(`📄 Connected to: ${doc.title}`);
  
  // Find sheet by name
  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) {
    console.log(`⚠️  Sheet "${sheetName}" not found. Skipping...`);
    return null;
  }
  
  const rows = await sheet.getRows();
  const headers = sheet.headerValues;

  console.log(`   Headers: ${headers.join(', ')}`);
  console.log(`   Rows: ${rows.length}`);

  // Create data dir if missing
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const records = rows.map(r => {
    const obj = {};
    headers.forEach(h => {
      obj[h] = r.get(h) ?? '';
    });
    return obj;
  });

  if (records.length === 0) {
    console.log(`   ⚠️  No data rows found in ${sheetName}`);
    // Create empty CSV with headers
    const csvWriter = createCsvWriter({
      path: outputFile,
      header: headers.map(h => ({ id: h, title: h })),
    });
    await csvWriter.writeRecords([]);
    console.log(`   ✅ Created empty CSV with headers`);
    return 0;
  }

  const csvWriter = createCsvWriter({
    path: outputFile,
    header: headers.map(h => ({ id: h, title: h })),
  });

  await csvWriter.writeRecords(records);
  console.log(`   ✅ Wrote ${records.length} rows to ${outputFile}`);
  return records.length;
}

async function fetchAllSheets() {
  console.log('🚀 Google Sheets → CSV Export for Power BI');
  console.log('=' .repeat(50));
  
  const sheets = [
    { name: 'APIRequests', file: 'api_requests.csv' },
    { name: 'Errors', file: 'errors.csv' },
    { name: 'Metrics', file: 'metrics.csv' },
    { name: 'Authentication', file: 'authentication.csv' },
    { name: 'CartOperations', file: 'cart_operations.csv' }
  ];

  let totalRows = 0;
  const results = [];

  for (const sheet of sheets) {
    try {
      const outputFile = path.join(OUTPUT_DIR, sheet.file);
      const rowCount = await fetchSheetData(sheet.name, outputFile);
      if (rowCount !== null) {
        totalRows += rowCount;
        results.push({ sheet: sheet.name, file: sheet.file, rows: rowCount });
      }
    } catch (error) {
      console.error(`   ❌ Error fetching ${sheet.name}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 EXPORT SUMMARY');
  console.log('='.repeat(50));
  results.forEach(r => {
    console.log(`✅ ${r.sheet}: ${r.rows} rows → data/${r.file}`);
  });
  console.log('='.repeat(50));
  console.log(`\n🎉 Total: ${totalRows} rows exported across ${results.length} sheets`);
  console.log(`📁 Files location: ${path.resolve(OUTPUT_DIR)}`);
  console.log('\n🎯 Next Steps:');
  console.log('   1. Open Power BI Desktop');
  console.log('   2. Get Data → Text/CSV');
  console.log('   3. Select CSV files from data/ folder');
  console.log('   4. Load and visualize!\n');
}

// Execute
fetchAllSheets().catch(err => {
  console.error('❌ Fatal Error:', err);
  process.exit(1);
});
