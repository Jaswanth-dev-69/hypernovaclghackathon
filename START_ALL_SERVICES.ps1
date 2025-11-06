
<#
.SYNOPSIS
    HyperNova Project - Complete Startup Script
    
.DESCRIPTION
    Starts all services: Backend, Frontend, Streamlit Dashboard
    Also provides test commands for Google Sheets integration
    
.NOTES
    Run this from J:\hypernovahackathon directory
#>

Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host ("=" * 79) -ForegroundColor Cyan
Write-Host "🚀 HYPERNOVA E-COMMERCE PLATFORM - STARTUP SCRIPT" -ForegroundColor Cyan
Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host ("=" * 79) -ForegroundColor Cyan
Write-Host ""

# Project root
$PROJECT_ROOT = "J:\hypernovahackathon"
Set-Location $PROJECT_ROOT

Write-Host "📂 Project Root: $PROJECT_ROOT" -ForegroundColor Green
Write-Host ""

# ============================================================================
# 1. BACKEND - Express.js API Server
# ============================================================================
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "1️⃣  BACKEND - Express.js API Server" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

Write-Host "📍 Location: backend/" -ForegroundColor Cyan
Write-Host "🌐 Port: 5000" -ForegroundColor Cyan
Write-Host "📊 Features: REST API, Google Sheets Logging, Prometheus Metrics" -ForegroundColor Cyan
Write-Host ""

Write-Host "▶️  Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PROJECT_ROOT\backend'; npm run dev"
) -WindowStyle Normal

Write-Host "✅ Backend started in new window" -ForegroundColor Green
Write-Host "   URL: http://localhost:5000" -ForegroundColor White
Write-Host "   Health: http://localhost:5000/health" -ForegroundColor White
Write-Host "   Metrics: http://localhost:5000/metrics" -ForegroundColor White
Write-Host ""

Start-Sleep -Seconds 2

# ============================================================================
# 2. FRONTEND - Next.js Web Application
# ============================================================================
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "2️⃣  FRONTEND - Next.js Web Application" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

Write-Host "📍 Location: frontend/" -ForegroundColor Cyan
Write-Host "🌐 Port: 3000" -ForegroundColor Cyan
Write-Host "📊 Features: Next.js 14, TypeScript, Tailwind CSS, Shopping Cart" -ForegroundColor Cyan
Write-Host ""

Write-Host "▶️  Starting Frontend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PROJECT_ROOT\frontend'; npm run dev"
) -WindowStyle Normal

Write-Host "✅ Frontend started in new window" -ForegroundColor Green
Write-Host "   URL: http://localhost:3000" -ForegroundColor White
Write-Host ""

Start-Sleep -Seconds 2

# ============================================================================
# 3. STREAMLIT DASHBOARD - Real-time Analytics
# ============================================================================
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "3️⃣  STREAMLIT DASHBOARD - Real-time Analytics" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

Write-Host "📍 Location: streamlit-dashboard/" -ForegroundColor Cyan
Write-Host "🌐 Port: 8501" -ForegroundColor Cyan
Write-Host "📊 Features: Live Google Sheets Data, Interactive Charts, Dark Mode" -ForegroundColor Cyan
Write-Host ""

Write-Host "▶️  Starting Streamlit Dashboard..." -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PROJECT_ROOT\streamlit-dashboard'; python -m streamlit run app.py"
) -WindowStyle Normal

Write-Host "✅ Streamlit Dashboard started in new window" -ForegroundColor Green
Write-Host "   URL: http://localhost:8501" -ForegroundColor White
Write-Host ""

Start-Sleep -Seconds 2

# ============================================================================
# SUMMARY
# ============================================================================
Write-Host ""
Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host ("=" * 79) -ForegroundColor Cyan
Write-Host "🎉 ALL SERVICES STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host ("=" * 79) -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 SERVICE URLS:" -ForegroundColor Yellow
Write-Host "   • Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "   • Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "   • Dashboard: http://localhost:8501" -ForegroundColor White
Write-Host ""

Write-Host "🔗 IMPORTANT ENDPOINTS:" -ForegroundColor Yellow
Write-Host "   • Backend Health:  http://localhost:5000/health" -ForegroundColor White
Write-Host "   • Prometheus:      http://localhost:5000/metrics" -ForegroundColor White
Write-Host "   • API Docs:        http://localhost:5000/api" -ForegroundColor White
Write-Host ""

Write-Host "📊 GOOGLE SHEETS:" -ForegroundColor Yellow
Write-Host "   • Sheet ID: 1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E" -ForegroundColor White
Write-Host "   • Auto-logging: Enabled (Backend)" -ForegroundColor White
Write-Host "   • Dashboard: Auto-refresh every 5 minutes" -ForegroundColor White
Write-Host ""

Write-Host "💡 TIPS:" -ForegroundColor Yellow
Write-Host "   • Use Ctrl+C in each window to stop services" -ForegroundColor White
Write-Host "   • Check each window for any errors" -ForegroundColor White
Write-Host "   • Backend must be running for frontend API calls" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to open all URLs in browser..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open URLs
Start-Process "http://localhost:3000"
Start-Sleep -Seconds 1
Start-Process "http://localhost:5000/health"
Start-Sleep -Seconds 1
Start-Process "http://localhost:8501"

Write-Host ""
Write-Host "✅ All URLs opened in browser!" -ForegroundColor Green
Write-Host ""
Write-Host "Keep this window open. Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
