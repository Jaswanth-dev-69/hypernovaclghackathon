// ============================================================================
// TELEMETRY MODULE
// Simulates production-grade monitoring and observability
// ============================================================================

export interface TelemetryEvent {
  eventName: string;
  timestamp: string;
  metadata?: Record<string, any>;
  sessionId: string;
}

export interface Metric {
  metricName: string;
  value: number;
  timestamp: string;
  unit?: string;
}

export interface ErrorReport {
  error: Error | string;
  timestamp: string;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// In-memory storage for demo purposes
export class TelemetryService {
  private static instance: TelemetryService;
  private sessionId: string;
  private events: TelemetryEvent[] = [];
  private metrics: Metric[] = [];
  private errors: ErrorReport[] = [];
  private healthStatus: 'healthy' | 'degraded' | 'error' = 'healthy';
  
  // Mock metrics that update in real-time
  private cpuUsage: number = 15;
  private memoryUsage: number = 45;
  private responseTime: number = 120;
  private errorCount: number = 0;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.startMetricsSimulation();
  }

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Log an event with optional metadata
   * Use for: user actions, page views, interactions
   */
  public logEvent(eventName: string, metadata?: Record<string, any>): void {
    const event: TelemetryEvent = {
      eventName,
      timestamp: new Date().toISOString(),
      metadata,
      sessionId: this.sessionId,
    };

    this.events.push(event);
    console.log('📊 [TELEMETRY EVENT]', event);

    // Simulate sending to backend
    this.sendToMockAPI('/api/telemetry/events', event);
  }

  /**
   * Record a performance metric
   * Use for: API latency, component render time, custom metrics
   */
  public recordMetric(metricName: string, value: number, unit?: string): void {
    const metric: Metric = {
      metricName,
      value,
      timestamp: new Date().toISOString(),
      unit,
    };

    this.metrics.push(metric);
    console.log('📈 [METRIC]', metric);

    // Update health status based on metrics
    this.updateHealthStatus();

    // Simulate sending to backend
    this.sendToMockAPI('/api/telemetry/metrics', metric);
  }

  /**
   * Report an error for monitoring
   * Use for: caught exceptions, API errors, validation failures
   */
  public reportError(
    error: Error | string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context?: Record<string, any>
  ): void {
    const errorReport: ErrorReport = {
      error,
      timestamp: new Date().toISOString(),
      context,
      severity,
    };

    this.errors.push(errorReport);
    this.errorCount++;
    console.error('❌ [ERROR REPORT]', errorReport);

    // Update health status
    this.healthStatus = severity === 'critical' ? 'error' : 'degraded';

    // Simulate sending to backend
    this.sendToMockAPI('/api/telemetry/errors', errorReport);
  }

  /**
   * Simulate a critical incident (for demo purposes)
   */
  public simulateIncident(): void {
    console.warn('🚨 [SIMULATING INCIDENT]');
    this.healthStatus = 'error';
    this.errorCount += 5;
    this.cpuUsage = 95;
    this.responseTime = 3000;

    this.reportError(
      new Error('Simulated critical system failure'),
      'critical',
      {
        component: 'SystemHealth',
        automated: true,
      }
    );

    // Recover after 10 seconds
    setTimeout(() => {
      this.healthStatus = 'healthy';
      this.cpuUsage = Math.random() * 30 + 10;
      this.responseTime = Math.random() * 100 + 50;
      console.log('✅ [INCIDENT RESOLVED]');
    }, 10000);
  }

  // ============================================================================
  // GETTERS FOR MONITORING DASHBOARD
  // ============================================================================

  public getHealthStatus(): 'healthy' | 'degraded' | 'error' {
    return this.healthStatus;
  }

  public getMetrics() {
    return {
      cpuUsage: this.cpuUsage,
      memoryUsage: this.memoryUsage,
      responseTime: this.responseTime,
      errorCount: this.errorCount,
      eventCount: this.events.length,
      metricsCount: this.metrics.length,
    };
  }

  public getRecentEvents(limit: number = 10): TelemetryEvent[] {
    return this.events.slice(-limit);
  }

  public getRecentErrors(limit: number = 10): ErrorReport[] {
    return this.errors.slice(-limit);
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private sendToMockAPI(endpoint: string, data: any): void {
    // Simulate network delay
    const latency = Math.random() * 100 + 50;
    
    // Send to real Prometheus backend if available
    const metricsUrl = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL}/metrics/emit`
      : 'http://localhost:5000/metrics/emit';

    // Send metrics to backend Prometheus exporter
    if (typeof window !== 'undefined') {
      fetch(metricsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route: endpoint,
          method: 'POST',
          status: '200',
          duration: latency / 1000,
          env: process.env.NEXT_PUBLIC_ENV || 'development'
        })
      }).catch(error => {
        console.warn('Failed to send metrics to backend:', error);
      });
    }
    
    setTimeout(() => {
      console.log(`🌐 [MOCK API] POST ${endpoint}`, {
        status: 200,
        latency: `${latency.toFixed(0)}ms`,
      });
    }, latency);

    // Record the API call as a metric (directly to avoid recursion)
    const metric: Metric = {
      metricName: 'api_latency',
      value: latency,
      timestamp: new Date().toISOString(),
      unit: 'ms',
    };
    this.metrics.push(metric);
  }

  private updateHealthStatus(): void {
    // Simple health check logic
    if (this.errorCount > 10) {
      this.healthStatus = 'error';
    } else if (this.errorCount > 5 || this.cpuUsage > 80) {
      this.healthStatus = 'degraded';
    } else {
      this.healthStatus = 'healthy';
    }
  }

  private startMetricsSimulation(): void {
    // Simulate realistic metric fluctuations every 2 seconds
    setInterval(() => {
      if (this.healthStatus !== 'error') {
        this.cpuUsage = Math.max(10, Math.min(80, this.cpuUsage + (Math.random() - 0.5) * 10));
        this.memoryUsage = Math.max(30, Math.min(70, this.memoryUsage + (Math.random() - 0.5) * 5));
        this.responseTime = Math.max(50, Math.min(500, this.responseTime + (Math.random() - 0.5) * 50));
      }
    }, 2000);
  }
}

// ============================================================================
// EXPORTED CONVENIENCE FUNCTIONS
// ============================================================================

const telemetry = TelemetryService.getInstance();

export const logEvent = (eventName: string, metadata?: Record<string, any>) =>
  telemetry.logEvent(eventName, metadata);

export const recordMetric = (metricName: string, value: number, unit?: string) =>
  telemetry.recordMetric(metricName, value, unit);

export const reportError = (
  error: Error | string,
  severity?: 'low' | 'medium' | 'high' | 'critical',
  context?: Record<string, any>
) => telemetry.reportError(error, severity, context);

export const simulateIncident = () => telemetry.simulateIncident();

export const getHealthStatus = () => telemetry.getHealthStatus();

export const getMetrics = () => telemetry.getMetrics();

export const getRecentEvents = (limit?: number) => telemetry.getRecentEvents(limit);

export const getRecentErrors = (limit?: number) => telemetry.getRecentErrors(limit);

export default telemetry;
