# ============================================
# VERIFY MONITORING SETUP
# ============================================
# This script verifies all Prometheus monitoring files are configured correctly

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HyperNova Monitoring Setup Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Function to check file existence
function Test-FileExists {
    param(
        [string]$Path,
        [string]$Description
    )
    
    if (Test-Path $Path) {
        Write-Host "✓ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ $Description - NOT FOUND!" -ForegroundColor Red
        return $false
    }
}

# Check Docker Compose
Write-Host "Checking Docker Configuration..." -ForegroundColor Yellow
$allGood = $allGood -and (Test-FileExists "docker-compose.yml" "docker-compose.yml exists")

# Check Prometheus files
Write-Host ""
Write-Host "Checking Prometheus Configuration..." -ForegroundColor Yellow
$allGood = $allGood -and (Test-FileExists "prometheus/prometheus.yml" "prometheus/prometheus.yml exists")
$allGood = $allGood -and (Test-FileExists "prometheus/alert_rules.yml" "prometheus/alert_rules.yml exists")

# Check Alertmanager files
Write-Host ""
Write-Host "Checking Alertmanager Configuration..." -ForegroundColor Yellow
$allGood = $allGood -and (Test-FileExists "alertmanager/alertmanager.yml" "alertmanager/alertmanager.yml exists")

# Check Grafana provisioning
Write-Host ""
Write-Host "Checking Grafana Provisioning..." -ForegroundColor Yellow
$allGood = $allGood -and (Test-FileExists "grafana/provisioning/datasources/prometheus.yml" "Grafana datasource config exists")
$allGood = $allGood -and (Test-FileExists "grafana/provisioning/dashboards/dashboards.yml" "Grafana dashboard config exists")

# Check Backend metrics
Write-Host ""
Write-Host "Checking Backend Metrics Implementation..." -ForegroundColor Yellow
$allGood = $allGood -and (Test-FileExists "backend/src/middleware/metricsExporter.js" "Metrics exporter middleware exists")
$allGood = $allGood -and (Test-FileExists "backend/src/routes/metricsRoutes.js" "Metrics routes exist")

# Check startup scripts
Write-Host ""
Write-Host "Checking Startup Scripts..." -ForegroundColor Yellow
$allGood = $allGood -and (Test-FileExists "start-monitoring.ps1" "Startup script exists")

# Check documentation
Write-Host ""
Write-Host "Checking Documentation..." -ForegroundColor Yellow
$allGood = $allGood -and (Test-FileExists "DOCKER_QUICKSTART.md" "Docker quick start guide exists")
$allGood = $allGood -and (Test-FileExists "PROMETHEUS_SETUP.md" "Prometheus setup guide exists")
$allGood = $allGood -and (Test-FileExists "ALERTING_SETUP.md" "Alerting setup guide exists")

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CONFIGURATION CONTENT VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verify prometheus.yml has local backend target
Write-Host "Checking Prometheus scrape targets..." -ForegroundColor Yellow
$prometheusConfig = Get-Content "prometheus/prometheus.yml" -Raw
if ($prometheusConfig -match "host\.docker\.internal:5000") {
    Write-Host "✓ Local backend target configured (host.docker.internal:5000)" -ForegroundColor Green
} else {
    Write-Host "✗ Local backend target NOT configured!" -ForegroundColor Red
    $allGood = $false
}

if ($prometheusConfig -match "hypernovaclghackathon-api\.onrender\.com") {
    Write-Host "✓ Production backend target configured (Render)" -ForegroundColor Green
    Write-Host "  Note: This will be DOWN until deployed" -ForegroundColor Yellow
} else {
    Write-Host "✗ Production backend target NOT configured!" -ForegroundColor Red
    $allGood = $false
}

# Verify alert rules exist
Write-Host ""
Write-Host "Checking Alert Rules..." -ForegroundColor Yellow
$alertRules = Get-Content "prometheus/alert_rules.yml" -Raw
$alertCount = ([regex]::Matches($alertRules, "- alert:")).Count
if ($alertCount -gt 0) {
    Write-Host "✓ $alertCount alert rules configured" -ForegroundColor Green
} else {
    Write-Host "✗ No alert rules found!" -ForegroundColor Red
    $allGood = $false
}

# Check if prom-client is installed
Write-Host ""
Write-Host "Checking Backend Dependencies..." -ForegroundColor Yellow
$packageJson = Get-Content "backend/package.json" -Raw | ConvertFrom-Json
$promClient = $packageJson.dependencies.'prom-client'
if ($promClient) {
    Write-Host "✓ prom-client dependency installed ($promClient)" -ForegroundColor Green
} else {
    Write-Host "✗ prom-client NOT installed!" -ForegroundColor Red
    Write-Host "  Run: cd backend; npm install prom-client" -ForegroundColor Yellow
    $allGood = $false
}

# Check Docker
Write-Host ""
Write-Host "Checking Docker Installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "✓ Docker installed: $dockerVersion" -ForegroundColor Green
    
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Docker Desktop is running" -ForegroundColor Green
    } else {
        Write-Host "✗ Docker Desktop is NOT running!" -ForegroundColor Red
        Write-Host "  Please start Docker Desktop" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host "✗ Docker not found!" -ForegroundColor Red
    Write-Host "  Please install Docker Desktop" -ForegroundColor Yellow
    $allGood = $false
}

# Final summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($allGood) {
    Write-Host "✓ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your monitoring setup is complete and ready to use!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run: .\start-monitoring.ps1" -ForegroundColor White
    Write-Host "2. Run: cd backend && npm start" -ForegroundColor White
    Write-Host "3. Open: http://localhost:9090/targets" -ForegroundColor White
    Write-Host "4. Verify 'hypernova-backend-local' shows UP" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✗ SOME CHECKS FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the issues above before proceeding." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
