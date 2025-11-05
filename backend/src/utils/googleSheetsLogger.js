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

  // Log Prometheus metrics to Google Sheets
  async logMetrics(metricsData) {
    if (!this.initialized) {
      console.log('⚠️  Skipping metrics logging (Sheets not initialized)');
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const rows = [];

      // Create rows from metrics data
      for (const metric of metricsData) {
        const row = [
          timestamp,
          metric.name || 'unknown',
          metric.type || 'unknown',
          metric.value || 0,
          JSON.stringify(metric.labels || {}),
          metric.help || '',
          process.env.NODE_ENV || 'development',
          process.version
        ];
        rows.push(row);
      }

      // Append all rows at once (batch operation)
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Metrics!A:H',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: rows
        }
      });

      console.log(`📊 Logged ${rows.length} metrics to Google Sheets Metrics tab`);
    } catch (error) {
      console.error('❌ Failed to log metrics to Google Sheets:', error.message);
    }
  }

  // Parse Prometheus metrics text format
  parsePrometheusMetrics(metricsText) {
    const lines = metricsText.split('\n');
    const metrics = [];
    let currentHelp = '';
    let currentType = '';

    for (const line of lines) {
      if (line.startsWith('# HELP')) {
        // Extract help text
        const parts = line.substring(7).split(' ');
        currentHelp = parts.slice(1).join(' ');
      } else if (line.startsWith('# TYPE')) {
        // Extract type
        const parts = line.substring(7).split(' ');
        currentType = parts[1];
      } else if (line && !line.startsWith('#')) {
        // Parse metric line
        const metric = this.parseMetricLine(line, currentType, currentHelp);
        if (metric) {
          metrics.push(metric);
        }
      }
    }

    return metrics;
  }

  // Parse a single metric line
  parseMetricLine(line, type, help) {
    try {
      // Example: hypernova_http_requests_total{method="GET",route="/health",status_code="200"} 5
      const match = line.match(/^([a-zA-Z_:][a-zA-Z0-9_:]*)\{([^}]*)\}\s+(.+)$/);
      
      if (match) {
        const [, name, labelsStr, value] = match;
        const labels = {};
        
        // Parse labels
        const labelPairs = labelsStr.split(',');
        for (const pair of labelPairs) {
          const [key, val] = pair.split('=');
          if (key && val) {
            labels[key.trim()] = val.trim().replace(/"/g, '');
          }
        }

        return {
          name,
          type,
          value: parseFloat(value),
          labels,
          help
        };
      }

      // Metric without labels
      const simpleMatch = line.match(/^([a-zA-Z_:][a-zA-Z0-9_:]*)\s+(.+)$/);
      if (simpleMatch) {
        const [, name, value] = simpleMatch;
        return {
          name,
          type,
          value: parseFloat(value),
          labels: {},
          help
        };
      }

      return null;
    } catch (error) {
      // Silently skip unparseable lines
      return null;
    }
  }

  // Log metrics snapshot (called periodically)
  async logMetricsSnapshot(metricsText) {
    try {
      const metrics = this.parsePrometheusMetrics(metricsText);
      await this.logMetrics(metrics);
    } catch (error) {
      console.error('❌ Failed to log metrics snapshot:', error.message);
    }
  }
}

// Singleton instance
const logger = new GoogleSheetsLogger();

module.exports = logger;
