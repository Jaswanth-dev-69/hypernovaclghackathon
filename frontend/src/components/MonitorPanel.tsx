'use client';

import { useEffect, useState } from 'react';
import { getMetrics, simulateIncident, logEvent } from '@/lib/telemetry';

export default function MonitorPanel() {
  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    responseTime: 0,
    errorCount: 0,
    eventCount: 0,
    metricsCount: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Update metrics every 2 seconds
    const interval = setInterval(() => {
      setMetrics(getMetrics());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSimulateIncident = () => {
    logEvent('manual_incident_triggered', { source: 'monitor_panel' });
    simulateIncident();
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'bg-red-500';
    if (value >= thresholds.warning) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="font-medium">Monitor</span>
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="card w-80 p-4 shadow-2xl animate-in slide-in-from-bottom">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold gradient-text">System Monitor</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            {/* CPU Usage */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                <span
                  className={`text-sm font-bold ${getStatusColor(metrics.cpuUsage, {
                    warning: 60,
                    critical: 80,
                  })}`}
                >
                  {metrics.cpuUsage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                    metrics.cpuUsage,
                    { warning: 60, critical: 80 }
                  )}`}
                  style={{ width: `${metrics.cpuUsage}%` }}
                />
              </div>
            </div>

            {/* Memory Usage */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                <span
                  className={`text-sm font-bold ${getStatusColor(metrics.memoryUsage, {
                    warning: 70,
                    critical: 85,
                  })}`}
                >
                  {metrics.memoryUsage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                    metrics.memoryUsage,
                    { warning: 70, critical: 85 }
                  )}`}
                  style={{ width: `${metrics.memoryUsage}%` }}
                />
              </div>
            </div>

            {/* Response Time */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Avg Response Time</span>
                <span
                  className={`text-sm font-bold ${getStatusColor(metrics.responseTime, {
                    warning: 300,
                    critical: 1000,
                  })}`}
                >
                  {metrics.responseTime.toFixed(0)}ms
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                    Math.min((metrics.responseTime / 1000) * 100, 100),
                    { warning: 30, critical: 70 }
                  )}`}
                  style={{ width: `${Math.min((metrics.responseTime / 500) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">Errors</p>
                <p className="text-lg font-bold text-red-600">{metrics.errorCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Events</p>
                <p className="text-lg font-bold text-blue-600">{metrics.eventCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Metrics</p>
                <p className="text-lg font-bold text-purple-600">{metrics.metricsCount}</p>
              </div>
            </div>

            {/* Simulate Incident Button */}
            <button
              onClick={handleSimulateIncident}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Simulate Incident</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">Real-time monitoring active</p>
          </div>
        </div>
      )}
    </div>
  );
}
