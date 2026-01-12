# SonarQube Scan Script (PowerShell)
# This script runs SonarQube analysis for all services

$ErrorActionPreference = "Stop"

# Configuration - Change these if needed
$sonarHost = "http://localhost:9000"
$sonarLogin = "admin"
$sonarPassword = "admin1" 

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Running SonarQube Analysis" -ForegroundColor Cyan
Write-Host "Server: $sonarHost" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Navigate to project root (parent of scripts directory)
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$services = @("product-service", "order-service", "api-gateway")

foreach ($service in $services) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Yellow
    Write-Host "Analyzing: $service" -ForegroundColor Yellow
    Write-Host "==========================================" -ForegroundColor Yellow
    
    $servicePath = Join-Path $projectRoot $service
    
    if (-not (Test-Path $servicePath)) {
        Write-Host "WARNING: Service directory not found: $servicePath" -ForegroundColor Red
        continue
    }
    
    Push-Location $servicePath
    
    try {
        # Construct arguments with quotes to avoid PowerShell parsing issues
        # We use variables in quotes which PowerShell expands, but we pass separate string arguments to the command
        $projectKeyArg = "-Dsonar.projectKey=$service"
        $hostArg = "-Dsonar.host.url=$sonarHost"
        $loginArg = "-Dsonar.login=$sonarLogin"
        $passwordArg = "-Dsonar.password=$sonarPassword"

        Write-Host "Executing Maven SonarQube Goal..." -ForegroundColor Green
        
        # Execute Maven with property arguments
        # Note: In PowerShell, passing arguments like this ensures they are treated as separate parameters
        & mvn clean verify sonar:sonar $projectKeyArg $hostArg $loginArg $passwordArg
        
        if ($LASTEXITCODE -eq 0) {
             Write-Host "SUCCESS: Analysis for $service completed." -ForegroundColor Green
        } else {
             Write-Host "ERROR: Maven command failed for $service with exit code $LASTEXITCODE" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "ERROR: Failed to analyze $service" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
    finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "All analyses completed!" -ForegroundColor Green
Write-Host "Check dashboard at: $sonarHost" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Green
