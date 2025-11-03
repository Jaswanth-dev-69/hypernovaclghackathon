# ============================================
# START MONITORING STACK
# ============================================
# This script starts the HyperNova monitoring stack
# Prerequisites: Docker Desktop must be running

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HyperNova Monitoring Stack Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}
Write-Host "Docker is running ✓" -ForegroundColor Green
Write-Host ""

# Navigate to project directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Start monitoring stack
Write-Host "Starting monitoring stack..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "Monitoring stack started successfully ✓" -ForegroundColor Green
    Write-Host ""
    
    # Wait for services to be ready
    Write-Host "Waiting for services to initialize (10 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "ACCESS POINTS" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Prometheus:    http://localhost:9090" -ForegroundColor Green
    Write-Host "  - Targets:   http://localhost:9090/targets" -ForegroundColor Gray
    Write-Host "  - Alerts:    http://localhost:9090/alerts" -ForegroundColor Gray
    Write-Host "  - Graph:     http://localhost:9090/graph" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Alertmanager:  http://localhost:9093" -ForegroundColor Green
    Write-Host ""
    Write-Host "Grafana:       http://localhost:3001" -ForegroundColor Green
    Write-Host "  - Username:  admin" -ForegroundColor Gray
    Write-Host "  - Password:  admin" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Node Exporter: http://localhost:9100/metrics" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "BACKEND METRICS ENDPOINTS" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Make sure your backend is running on port 5000!" -ForegroundColor Yellow
    Write-Host "Backend metrics:  http://localhost:5000/metrics" -ForegroundColor Green
    Write-Host "Backend health:   http://localhost:5000/metrics/health" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "QUICK COMMANDS" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "View logs:        docker-compose logs -f [service-name]" -ForegroundColor Gray
    Write-Host "Stop all:         docker-compose down" -ForegroundColor Gray
    Write-Host "Restart service:  docker-compose restart [service-name]" -ForegroundColor Gray
    Write-Host "View status:      docker-compose ps" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Service names: prometheus, alertmanager, grafana, node-exporter" -ForegroundColor Gray
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "NEXT STEPS" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Start your backend server:" -ForegroundColor White
    Write-Host "   cd backend" -ForegroundColor Gray
    Write-Host "   npm start" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Check Prometheus targets:" -ForegroundColor White
    Write-Host "   http://localhost:9090/targets" -ForegroundColor Gray
    Write-Host "   Verify 'hypernova-backend-local' is UP" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Test metrics endpoint:" -ForegroundColor White
    Write-Host "   http://localhost:5000/metrics" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. View metrics in Prometheus:" -ForegroundColor White
    Write-Host "   http://localhost:9090/graph" -ForegroundColor Gray
    Write-Host "   Try query: hypernova_auth_attempts_total" -ForegroundColor Gray
    Write-Host ""
    Write-Host "5. Open Grafana and explore dashboards:" -ForegroundColor White
    Write-Host "   http://localhost:3001 (admin/admin)" -ForegroundColor Gray
    Write-Host ""
    
} else {
    Write-Host "ERROR: Failed to start monitoring stack" -ForegroundColor Red
    Write-Host "Check docker-compose logs for details" -ForegroundColor Red
    exit 1
}
