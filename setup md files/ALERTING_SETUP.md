# 🚨 Prometheus Alerting System Setup

## Overview

Now that your metrics are working, let's set up alerts for critical events like:
- Failed login attempts
- Cart operation failures
- High error rates
- System performance issues

## 📋 Alert Rules Configuration

Create `prometheus/alerts.yml`:

```yaml
groups:
  - name: hypernova_alerts
    interval: 30s
    rules:
      # ============================================================================
      # AUTHENTICATION ALERTS
      # ============================================================================
      
      - alert: HighLoginFailureRate
        expr: |
          (
            sum(rate(hypernova_login_failures_total[5m]))
            / 
            sum(rate(hypernova_auth_attempts_total{type="login"}[5m]))
          ) > 0.5
        for: 2m
        labels:
          severity: warning
          category: security
        annotations:
          summary: "High login failure rate detected"
          description: "More than 50% of login attempts are failing ({{ $value | humanizePercentage }})"
      
      - alert: PossibleBruteForceAttack
        expr: sum(rate(hypernova_login_failures_total[1m])) > 10
        for: 1m
        labels:
          severity: critical
          category: security
        annotations:
          summary: "Possible brute force attack"
          description: "More than 10 failed login attempts per minute detected"
      
      - alert: NoSuccessfulLoginsInHour
        expr: sum(rate(hypernova_auth_attempts_total{status="success",type="login"}[1h])) == 0
        for: 1h
        labels:
          severity: info
          category: business
        annotations:
          summary: "No successful logins in the past hour"
          description: "No users have successfully logged in for 1 hour"

      # ============================================================================
      # CART OPERATION ALERTS
      # ============================================================================
      
      - alert: HighCartOperationFailureRate
        expr: |
          (
            sum(rate(hypernova_cart_operations_total{status="error"}[5m]))
            /
            sum(rate(hypernova_cart_operations_total[5m]))
          ) > 0.2
        for: 3m
        labels:
          severity: warning
          category: business
        annotations:
          summary: "High cart operation failure rate"
          description: "More than 20% of cart operations are failing ({{ $value | humanizePercentage }})"
      
      - alert: CartAbandonmentSpike
        expr: sum(increase(hypernova_cart_operations_total{operation="clear"}[10m])) > 20
        for: 5m
        labels:
          severity: info
          category: business
        annotations:
          summary: "Spike in cart abandonments detected"
          description: "More than 20 carts cleared in the last 10 minutes"

      # ============================================================================
      # SYSTEM PERFORMANCE ALERTS
      # ============================================================================
      
      - alert: HighResponseTime
        expr: |
          histogram_quantile(0.95,
            rate(hypernova_http_request_duration_seconds_bucket[5m])
          ) > 1.0
        for: 5m
        labels:
          severity: warning
          category: performance
        annotations:
          summary: "High API response time"
          description: "95th percentile response time is above 1 second ({{ $value }}s)"
      
      - alert: HighMemoryUsage
        expr: hypernova_process_resident_memory_bytes > 500000000
        for: 5m
        labels:
          severity: warning
          category: system
        annotations:
          summary: "High memory usage"
          description: "Process memory usage is above 500MB ({{ $value | humanize }}B)"
      
      - alert: HighCPUUsage
        expr: rate(hypernova_process_cpu_seconds_total[5m]) > 0.8
        for: 5m
        labels:
          severity: warning
          category: system
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is above 80% ({{ $value | humanizePercentage }})"
      
      - alert: EventLoopLag
        expr: hypernova_nodejs_eventloop_lag_seconds > 0.1
        for: 2m
        labels:
          severity: critical
          category: performance
        annotations:
          summary: "Event loop is lagging"
          description: "Node.js event loop lag is above 100ms ({{ $value }}s)"

      # ============================================================================
      # ERROR ALERTS
      # ============================================================================
      
      - alert: HighErrorRate
        expr: sum(rate(hypernova_errors_total[5m])) > 5
        for: 3m
        labels:
          severity: critical
          category: reliability
        annotations:
          summary: "High error rate detected"
          description: "More than 5 errors per minute ({{ $value }} errors/min)"
      
      - alert: DatabaseErrors
        expr: sum(rate(hypernova_database_errors_total[5m])) > 1
        for: 2m
        labels:
          severity: critical
          category: database
        annotations:
          summary: "Database errors detected"
          description: "Database errors occurring at {{ $value }} per minute"
      
      - alert: HTTP5xxErrors
        expr: sum(rate(hypernova_http_requests_total{status_code=~"5.."}[5m])) > 5
        for: 2m
        labels:
          severity: critical
          category: reliability
        annotations:
          summary: "High rate of 5xx errors"
          description: "More than 5 server errors per minute"

      # ============================================================================
      # AVAILABILITY ALERTS
      # ============================================================================
      
      - alert: ServiceDown
        expr: up{job="hypernova-backend-production"} == 0
        for: 1m
        labels:
          severity: critical
          category: availability
        annotations:
          summary: "Service is down"
          description: "HyperNova backend is not responding to Prometheus scrapes"
      
      - alert: LowRequestRate
        expr: sum(rate(hypernova_http_requests_total[5m])) < 0.1
        for: 10m
        labels:
          severity: info
          category: business
        annotations:
          summary: "Low request rate"
          description: "Very few requests in the last 10 minutes (possible issue or low traffic)"
```

## 🔧 Update Prometheus Configuration

Update your `prometheus.yml` to include the alert rules:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

# Load alert rules
rule_files:
  - 'alerts.yml'

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']  # If using Alertmanager

scrape_configs:
  - job_name: 'hypernova-backend-local'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/metrics'

  - job_name: 'hypernova-backend-production'
    static_configs:
      - targets: ['hypernovaclghackathon-api.onrender.com']
    metrics_path: '/metrics'
    scheme: https
```

## 🚨 Setting Up Alertmanager (Optional)

Alertmanager handles alert notifications (email, Slack, PagerDuty, etc.).

### Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: hypernova-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus/alerts.yml:/etc/prometheus/alerts.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    restart: unless-stopped
    networks:
      - monitoring

  alertmanager:
    image: prom/alertmanager:latest
    container_name: hypernova-alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./prometheus/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager-data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    restart: unless-stopped
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: hypernova-grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    restart: unless-stopped
    networks:
      - monitoring

volumes:
  prometheus-data:
  alertmanager-data:
  grafana-data:

networks:
  monitoring:
    driver: bridge
```

### Create `prometheus/alertmanager.yml`:

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default'

receivers:
  - name: 'default'
    webhook_configs:
      - url: 'http://localhost:3000/api/alerts'  # Your custom webhook
        send_resolved: true

  # Email notifications (configure your SMTP)
  # - name: 'email'
  #   email_configs:
  #     - to: 'your-email@example.com'
  #       from: 'prometheus@hypernova.com'
  #       smarthost: 'smtp.gmail.com:587'
  #       auth_username: 'your-email@gmail.com'
  #       auth_password: 'your-app-password'

  # Slack notifications
  # - name: 'slack'
  #   slack_configs:
  #     - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
  #       channel: '#alerts'
  #       title: '{{ .GroupLabels.alertname }}'
  #       text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname']
```

## 📧 Setting Up Email Alerts (Gmail Example)

1. **Enable 2FA** on your Gmail account
2. **Generate App Password**: Google Account → Security → 2-Step Verification → App passwords
3. **Update alertmanager.yml**:

```yaml
receivers:
  - name: 'email'
    email_configs:
      - to: 'your-email@example.com'
        from: 'hypernova-alerts@gmail.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'your-email@gmail.com'
        auth_password: 'your-16-char-app-password'
        headers:
          Subject: '🚨 HyperNova Alert: {{ .GroupLabels.alertname }}'
```

## 💬 Setting Up Slack Alerts

1. **Create Slack Webhook**:
   - Go to your Slack workspace
   - Create a new app: https://api.slack.com/apps
   - Enable "Incoming Webhooks"
   - Create webhook URL

2. **Update alertmanager.yml**:

```yaml
receivers:
  - name: 'slack'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#hypernova-alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: |
          *Alert:* {{ .GroupLabels.alertname }}
          *Severity:* {{ .GroupLabels.severity }}
          *Description:* {{ .Annotations.description }}
```

## 🧪 Testing Alerts

### Test Failed Login Alert:

```powershell
# Trigger multiple failed logins
for ($i=1; $i -le 15; $i++) {
    Invoke-RestMethod -Uri http://localhost:5000/api/auth/login `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body '{"email":"wrong@example.com","password":"wrong"}'
}
```

### Test High Error Rate:

Create errors to trigger alerts:

```powershell
# Generate errors
for ($i=1; $i -le 20; $i++) {
    Invoke-RestMethod -Uri http://localhost:5000/api/invalid-endpoint
}
```

### View Active Alerts:

- Prometheus: http://localhost:9090/alerts
- Alertmanager: http://localhost:9093

## 📊 Viewing Alerts in Grafana

1. Add Alertmanager data source in Grafana
2. Create dashboard with alert panels
3. Set up notification channels (email, Slack, PagerDuty)

## 🎯 Alert Best Practices

### Severity Levels:

- **Critical**: Immediate action required (service down, high error rate)
- **Warning**: Should investigate soon (high memory, slow response)
- **Info**: Nice to know (low traffic, cart abandonments)

### Alert Fatigue Prevention:

- Use appropriate thresholds
- Add `for:` duration to avoid flapping
- Group related alerts
- Set reasonable repeat intervals

### Alert Response:

1. **Acknowledge**: Check Prometheus/Alertmanager
2. **Investigate**: Look at metrics and logs
3. **Fix**: Apply solution
4. **Verify**: Confirm alert resolves
5. **Document**: Record incident and resolution

## 🚀 Quick Start

```powershell
# 1. Create alerts directory
mkdir prometheus

# 2. Copy alerts.yml to prometheus/ folder
# (Use the content above)

# 3. Start Prometheus with alerts
docker-compose up -d

# 4. View alerts
start http://localhost:9090/alerts

# 5. Test by generating failures
# (Run failed login tests above)
```

## 📚 Additional Resources

- [Prometheus Alerting Rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)
- [Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)
- [Grafana Alerting](https://grafana.com/docs/grafana/latest/alerting/)

---

**Your metrics are now tracked! Once you configure these alerts, you'll be notified of any issues automatically!** 🎉
