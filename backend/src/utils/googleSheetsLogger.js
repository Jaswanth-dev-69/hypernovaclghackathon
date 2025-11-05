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
  // Columns: Timestamp, Type, Status, Email, IP, UserAgent, Reason
  async logAuth(type, status, email, metadata = {}) {
    await this.logMetric('Authentication', {
      type,           // Type column
      status,         // Status column
      email,          // Email column
      ip: metadata.ip || 'unknown',           // IP column
      userAgent: metadata.userAgent || 'unknown',  // UserAgent column
      reason: metadata.reason || '',          // Reason column
    });
  }

  // Log cart operations
  // Columns: Timestamp, Operation, Status, UserID, ProductID, Quantity, ItemCount
  async logCart(operation, status, userId, metadata = {}) {
    await this.logMetric('CartOperations', {
      operation,      // Operation column
      status,         // Status column
      userId,         // UserID column
      productId: metadata.productId || '',     // ProductID column
      quantity: metadata.quantity || 0,        // Quantity column
      itemCount: metadata.itemCount || 0,      // ItemCount column
    });
  }

  // Log API requests
  // Columns: Timestamp, Method, Path, StatusCode, Duration, UserID
  async logRequest(method, path, statusCode, duration, userId = 'anonymous') {
    // Skip metrics endpoint to avoid recursion
    if (path === '/metrics') return;
    
    await this.logMetric('APIRequests', {
      method,         // Method column
      path,           // Path column
      statusCode,     // StatusCode column
      duration: duration.toFixed(3),  // Duration column
      userId,         // UserID column
    });
  }

  // Log errors
  // Columns: Timestamp, Type, Message, Stack, Endpoint, UserID
  async logError(type, message, stack, metadata = {}) {
    await this.logMetric('Errors', {
      type,           // Type column
      message,        // Message column
      stack: stack?.substring(0, 500) || '',  // Stack column (limit length)
      endpoint: metadata.endpoint || 'unknown',  // Endpoint column
      userId: metadata.userId || 'anonymous',    // UserID column
    });
  }

  // Log Prometheus metrics to Google Sheets
  // Columns: Timestamp, MetricName, MetricType, Value, Labels, Help, Environment, NodeVersion
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
          timestamp,                              // Timestamp column
          metric.name || 'unknown',               // MetricName column
          metric.type || 'unknown',               // MetricType column
          metric.value || 0,                      // Value column
          JSON.stringify(metric.labels || {}),    // Labels column
          metric.help || '',                      // Help column
          process.env.NODE_ENV || 'development',  // Environment column
          process.version                         // NodeVersion column
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
