# Manual Test Script for Product Service
# This isolates the issue to a single service with explicit parameter passing

$ErrorActionPreference = "Stop"

Write-Host "Checking for NVD_API_KEY..." -ForegroundColor Cyan
if (-not $env:NVD_API_KEY) {
    Write-Host "ERROR: NVD_API_KEY is not set!" -ForegroundColor Red
    exit 1
}
Write-Host "API Key found: $($env:NVD_API_KEY.Substring(0, 8))..." -ForegroundColor Green

Write-Host "Clearing local cache (just in case)..." -ForegroundColor Cyan
Remove-Item -Recurse -Force "$env:USERPROFILE\.m2\dependency-check-data" -ErrorAction SilentlyContinue

Set-Location "product-service"
Write-Host "Running Maven Dependency Check for Product Service..." -ForegroundColor Cyan
Write-Host "Using Plugin Version: 10.0.3" -ForegroundColor Gray

# Construct the argument carefully
$arg = "-Dnvd.api.key=" + $env:NVD_API_KEY

# Run Maven
& mvn dependency-check:check $arg

Write-Host "Done." -ForegroundColor Cyan
