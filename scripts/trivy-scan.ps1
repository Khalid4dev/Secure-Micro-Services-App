# Trivy Image Scan Script (PowerShell) - Updated for local installation
# This script scans Docker images for vulnerabilities using Trivy

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Scanning Docker Images with Trivy" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Navigate to project root
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "Project root: $projectRoot" -ForegroundColor Gray

# Check if Trivy is available
$trivyPath = $null
$localTrivyPath = Join-Path $projectRoot "trivy\trivy.exe"

if (Test-Path $localTrivyPath) {
    $trivyPath = $localTrivyPath
    Write-Host "Using local Trivy installation: $trivyPath" -ForegroundColor Green
}
elseif (Get-Command trivy -ErrorAction SilentlyContinue) {
    $trivyPath = "trivy"
    Write-Host "Using system Trivy installation" -ForegroundColor Green
}
else {
    Write-Host "ERROR: Trivy is not installed!" -ForegroundColor Red
    Write-Host "Please download Trivy from: https://github.com/aquasecurity/trivy/releases" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or run from project root:" -ForegroundColor Cyan
    Write-Host '  Invoke-WebRequest -Uri "https://github.com/aquasecurity/trivy/releases/download/v0.48.3/trivy_0.48.3_Windows-64bit.zip" -OutFile "trivy.zip"' -ForegroundColor White
    Write-Host '  Expand-Archive -Path "trivy.zip" -DestinationPath "trivy" -Force' -ForegroundColor White
    exit 1
}

$images = @("product-service:latest", "order-service:latest", "api-gateway:latest", "frontend-react:latest")
$reportDir = Join-Path $projectRoot "security-reports\trivy"

New-Item -ItemType Directory -Force -Path $reportDir | Out-Null

foreach ($image in $images) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Yellow
    Write-Host "Scanning: $image" -ForegroundColor Yellow
    Write-Host "==========================================" -ForegroundColor Yellow
    
    $imageName = $image.Split(':')[0]
    $reportFile = Join-Path $reportDir "$imageName-scan.html"
    $jsonFile = Join-Path $reportDir "$imageName-scan.json"
    $txtFile = Join-Path $reportDir "$imageName-scan.txt"
    
    # Check if image exists
    $imageExists = docker images -q $image 2>$null
    if (-not $imageExists) {
        Write-Host "WARNING: Image $image not found. Skipping..." -ForegroundColor Yellow
        Write-Host "Build the image first with: docker build -t $image ./$imageName" -ForegroundColor Gray
        continue
    }
    
    try {
        # Scan and generate JSON report
        Write-Host "Generating JSON report..." -ForegroundColor Cyan
        & $trivyPath image --format json -o $jsonFile $image
        
        # Scan and generate table report
        Write-Host "Generating table report..." -ForegroundColor Cyan
        & $trivyPath image --format table -o $txtFile $image
        
        # Display critical and high vulnerabilities
        Write-Host ""
        Write-Host "Critical and High vulnerabilities:" -ForegroundColor Red
        & $trivyPath image --severity CRITICAL, HIGH $image
        
        Write-Host ""
        Write-Host "Reports saved:" -ForegroundColor Cyan
        Write-Host "  - JSON: $jsonFile" -ForegroundColor White
        Write-Host "  - Table: $txtFile" -ForegroundColor White
    }
    catch {
        Write-Host "ERROR: Failed to scan $image" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "All scans completed!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Reports are located in: $reportDir\" -ForegroundColor Cyan

if (Test-Path $reportDir) {
    Get-ChildItem -Path $reportDir -File | Format-Table Name, Length, LastWriteTime
}
else {
    Write-Host "No reports generated" -ForegroundColor Yellow
}
