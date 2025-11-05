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

  // Generic log method (DEPRECATED - use specific methods instead)
  // Each method now handles its own column structure directly
  async logMetric(sheetName, data) {
    console.warn(`⚠️  logMetric() is deprecated. Use specific methods: logAuth(), logCart(), logRequest(), logError(), logMetrics()`);
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
  // YOUR COLUMNS: Timestamp, Type, Status, Email, IP, UserAgent, Reason
  async logAuth(type, status, email, metadata = {}) {
    if (!this.initialized) return;

    try {
      const values = [[
        new Date().toISOString(),                    // Timestamp
        type,                                         // Type
        status,                                       // Status
        email || 'unknown',                          // Email
        metadata.ip || 'unknown',                    // IP
        metadata.userAgent || 'unknown',             // UserAgent
        metadata.reason || ''                        // Reason
      ]];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Authentication!A:G',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      console.log(`📊 Logged to Authentication: ${type} - ${status}`);
    } catch (error) {
      console.error('❌ Failed to log authentication:', error.message);
    }
  }

  // Log cart operations
  // YOUR COLUMNS: Timestamp, Operation, Status, UserID, ProductID, Quantity, ItemCount
  async logCart(operation, status, userId, metadata = {}) {
    if (!this.initialized) return;

    try {
      const values = [[
        new Date().toISOString(),                    // Timestamp
        operation,                                    // Operation
        status,                                       // Status
        userId || 'unknown',                         // UserID
        metadata.productId || '',                    // ProductID
        metadata.quantity || 0,                      // Quantity
        metadata.itemCount || 0                      // ItemCount
      ]];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'CartOperations!A:G',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      console.log(`📊 Logged to CartOperations: ${operation} - ${status}`);
    } catch (error) {
      console.error('❌ Failed to log cart operation:', error.message);
    }
  }

  // Log API requests
  // YOUR COLUMNS: Timestamp, Method, Path, StatusCode, Duration, UserID
  async logRequest(method, path, statusCode, duration, userId = 'anonymous') {
    if (!this.initialized) return;
    if (path === '/metrics') return; // Skip metrics endpoint

    try {
      const values = [[
        new Date().toISOString(),                    // Timestamp
        method,                                       // Method
        path,                                         // Path
        statusCode,                                   // StatusCode
        duration.toFixed(3),                         // Duration
        userId                                        // UserID
      ]];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'APIRequests!A:F',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      console.log(`📊 Logged to APIRequests: ${method} ${path} - ${statusCode}`);
    } catch (error) {
      console.error('❌ Failed to log API request:', error.message);
    }
  }

  // Log errors
  // YOUR COLUMNS: Timestamp, Type, Message, Stack, Endpoint, UserID
  async logError(type, message, stack, metadata = {}) {
    if (!this.initialized) return;

    try {
      const values = [[
        new Date().toISOString(),                    // Timestamp
        type,                                         // Type
        message,                                      // Message
        stack?.substring(0, 500) || '',              // Stack (truncated)
        metadata.endpoint || 'unknown',              // Endpoint
        metadata.userId || 'anonymous'               // UserID
      ]];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Errors!A:F',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      console.log(`📊 Logged to Errors: ${type} - ${message}`);
    } catch (error) {
      console.error('❌ Failed to log error:', error.message);
    }
  }

  // Log Prometheus metrics to Google Sheets
  // YOUR COLUMNS: Timestamp, MetricName, MetricType, Value, Labels, Help, Environment, NodeVersion
  async logMetrics(metricsData) {
    if (!this.initialized) return;

    try {
      const timestamp = new Date().toISOString();
      const rows = [];

      for (const metric of metricsData) {
        rows.push([
          timestamp,                                  // Timestamp
          metric.name || 'unknown',                  // MetricName
          metric.type || 'unknown',                  // MetricType
          metric.value || 0,                         // Value
          JSON.stringify(metric.labels || {}),       // Labels
          metric.help || '',                         // Help
          process.env.NODE_ENV || 'development',     // Environment
          process.version                            // NodeVersion
        ]);
      }

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Metrics!A:H',
        valueInputOption: 'USER_ENTERED',
        resource: { values: rows }
      });

      console.log(`📊 Logged ${rows.length} metrics to Metrics tab`);
    } catch (error) {
      console.error('❌ Failed to log metrics:', error.message);
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
