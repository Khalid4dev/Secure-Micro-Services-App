# Security Scan Script: Test and Dependency Check (PowerShell)
# This script runs unit tests and OWASP dependency checks for all services

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Running Security Scans" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Navigate to project root (parent of scripts directory)
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "Project root: $projectRoot" -ForegroundColor Gray

# Validate NVD_API_KEY is set
if (-not $env:NVD_API_KEY) {
    Write-Host ""
    Write-Host "ERROR: NVD_API_KEY environment variable is not set!" -ForegroundColor Red
    Write-Host "Please set it with:" -ForegroundColor Yellow
    Write-Host "  [System.Environment]::SetEnvironmentVariable('NVD_API_KEY', 'your-key', 'User')" -ForegroundColor White
    Write-Host "Then restart your terminal and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "NVD_API_KEY is set: $($env:NVD_API_KEY.Substring(0, 8))..." -ForegroundColor Green
Write-Host ""

$services = @("product-service", "order-service", "api-gateway")

foreach ($service in $services) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Yellow
    Write-Host "Scanning: $service" -ForegroundColor Yellow
    Write-Host "==========================================" -ForegroundColor Yellow
    
    $servicePath = Join-Path $projectRoot $service
    
    if (-not (Test-Path $servicePath)) {
        Write-Host "WARNING: Service directory not found: $servicePath" -ForegroundColor Red
        continue
    }
    
    Push-Location $servicePath
    
    try {
        Write-Host "Running tests..." -ForegroundColor Green
        mvn clean test
        
        Write-Host "Running OWASP Dependency-Check..." -ForegroundColor Green
        Write-Host "Note: This may take 15-30 minutes on first run due to API rate limiting..." -ForegroundColor Yellow
        
        # Pass NVD_API_KEY explicitly to Maven using call operator
        # Build the argument as a single string to avoid PowerShell parsing issues
        $apiKeyArg = "-Dnvd.api.key=" + $env:NVD_API_KEY
        & mvn dependency-check:check $apiKeyArg
        
        $reportPath = Join-Path $servicePath "target\dependency-check\dependency-check-report.html"
        Write-Host "Report location: $reportPath" -ForegroundColor Cyan
    }
    catch {
        Write-Host "ERROR: Failed to scan $service" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
    finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "All scans completed!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Reports are located in:" -ForegroundColor Cyan
foreach ($service in $services) {
    $reportPath = Join-Path $projectRoot "$service\target\dependency-check\dependency-check-report.html"
    if (Test-Path $reportPath) {
        Write-Host "  [OK] $reportPath" -ForegroundColor White
    }
    else {
        Write-Host "  [X] $reportPath (not generated)" -ForegroundColor Gray
    }
}
