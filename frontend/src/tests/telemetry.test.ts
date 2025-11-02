// Simple test example - expand as needed
import { logEvent, recordMetric, reportError } from '@/lib/telemetry';

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};

describe('Telemetry Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log events with correct structure', () => {
    logEvent('test_event', { test: true });
    expect(console.log).toHaveBeenCalled();
  });

  it('should record metrics', () => {
    recordMetric('test_metric', 100, 'ms');
    expect(console.log).toHaveBeenCalled();
  });

  it('should report errors', () => {
    reportError(new Error('Test error'), 'low');
    expect(console.error).toHaveBeenCalled();
  });
});
