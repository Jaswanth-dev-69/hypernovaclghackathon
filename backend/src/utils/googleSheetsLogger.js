const { google } = require('googleapis');

class GoogleSheetsLogger {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    this.initialized = false;
  }

  async initialize() {
    try {
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        console.log('⚠️  Google Sheets logging disabled (no credentials)');
        return false;
      }

      // Parse service account credentials
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

      // Create auth client
      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      this.initialized = true;
      
      console.log('✅ Google Sheets Logger initialized');
      console.log(`📊 Spreadsheet ID: ${this.spreadsheetId}`);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets:', error.message);
      return false;
    }
  }

  async logMetric(sheetName, data) {
    if (!this.initialized) {
      console.log(`⚠️  Skipping log to ${sheetName} (Sheets not initialized)`);
      return;
    }

    try {
      const values = [
        [
          new Date().toISOString(),
          ...Object.values(data)
        ]
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      console.log(`📊 Logged to ${sheetName}:`, data);
    } catch (error) {
      console.error(`❌ Failed to log to ${sheetName}:`, error.message);
    }
  }

  // Log authentication events
  async logAuth(type, status, email, metadata = {}) {
    await this.logMetric('Authentication', {
      type,
      status,
      email,
      ip: metadata.ip || 'unknown',
      userAgent: metadata.userAgent || 'unknown',
      reason: metadata.reason || '',
    });
  }

  // Log cart operations
  async logCart(operation, status, userId, metadata = {}) {
    await this.logMetric('CartOperations', {
      operation,
      status,
      userId,
      productId: metadata.productId || '',
      quantity: metadata.quantity || 0,
      itemCount: metadata.itemCount || 0,
      totalValue: metadata.totalValue || 0,
    });
  }

  // Log API requests
  async logRequest(method, path, statusCode, duration, userId = 'anonymous') {
    // Skip metrics endpoint to avoid recursion
    if (path === '/metrics') return;
    
    await this.logMetric('APIRequests', {
      method,
      path,
      statusCode,
      duration: duration.toFixed(3),
      userId,
    });
  }

  // Log errors
  async logError(type, message, stack, metadata = {}) {
    await this.logMetric('Errors', {
      type,
      message,
      stack: stack?.substring(0, 500), // Limit stack trace length
      endpoint: metadata.endpoint || 'unknown',
      userId: metadata.userId || 'unknown',
    });
  }
}

// Singleton instance
const logger = new GoogleSheetsLogger();

module.exports = logger;
