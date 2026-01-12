# SonarQube Analysis Quick Guide

## Prerequisites

1. **Start SonarQube** (if not already running):
   ```powershell
   docker compose -f docker-compose.devsecops.yml up -d
   ```

2. **Wait for SonarQube to be ready** (takes ~1-2 minutes):
   ```powershell
   docker logs sonarqube -f
   # Wait for: "SonarQube is operational"
   ```

3. **Access SonarQube**: http://localhost:9000
   - Default credentials: `admin` / `admin`
   - You'll be prompted to change the password on first login

## Running SonarQube Analysis

### Option 1: Automation Script (Easiest)
We have created a script to automate this for all services:

```powershell
.\scripts\sonar-scan-all.ps1
```

### Option 2: Manual Execution
If you want to run it manually for specific services:

Navigate to the service directory first:

```powershell
# Product Service
cd product-service
mvn clean verify sonar:sonar `
  -Dsonar.projectKey=product-service `
  -Dsonar.host.url=http://localhost:9000 `
  -Dsonar.login=admin `
  -Dsonar.password=your-new-password

# Order Service
cd ..\order-service
mvn clean verify sonar:sonar `
  -Dsonar.projectKey=order-service `
  -Dsonar.host.url=http://localhost:9000 `
  -Dsonar.login=admin `
  -Dsonar.password=your-new-password

# API Gateway
cd ..\api-gateway
mvn clean verify sonar:sonar `
  -Dsonar.projectKey=api-gateway `
  -Dsonar.host.url=http://localhost:9000 `
  -Dsonar.login=admin `
  -Dsonar.password=your-new-password
```

### Option 2: Use Authentication Token (Recommended)

1. **Generate a token** in SonarQube:
   - Login to http://localhost:9000
   - Go to: My Account → Security → Generate Token
   - Name: `local-analysis`
   - Copy the generated token

2. **Run analysis with token**:
   ```powershell
   cd product-service
   mvn clean verify sonar:sonar `
     -Dsonar.projectKey=product-service `
     -Dsonar.host.url=http://localhost:9000 `
     -Dsonar.token=your-generated-token
   ```

### Option 3: Create a Script for All Services

Create `scripts/sonar-scan.ps1`:

```powershell
# SonarQube Analysis Script
$ErrorActionPreference = "Stop"

Write-Host "Starting SonarQube Analysis for All Services" -ForegroundColor Cyan

# Check if SonarQube is running
$sonarRunning = docker ps --filter "name=sonarqube" --filter "status=running" -q
if (-not $sonarRunning) {
    Write-Host "ERROR: SonarQube is not running!" -ForegroundColor Red
    Write-Host "Start it with: docker compose -f docker-compose.devsecops.yml up -d" -ForegroundColor Yellow
    exit 1
}

# Get SonarQube token from environment or prompt
$token = $env:SONAR_TOKEN
if (-not $token) {
    Write-Host "Please enter your SonarQube token:" -ForegroundColor Yellow
    $token = Read-Host -AsSecureString
    $token = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$services = @("product-service", "order-service", "api-gateway")

foreach ($service in $services) {
    Write-Host "`n========================================" -ForegroundColor Yellow
    Write-Host "Analyzing: $service" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    
    $servicePath = Join-Path $projectRoot $service
    Push-Location $servicePath
    
    try {
        mvn clean verify sonar:sonar `
          -Dsonar.projectKey=$service `
          -Dsonar.host.url=http://localhost:9000 `
          -Dsonar.token=$token
        
        Write-Host "✓ Analysis completed for $service" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Analysis failed for $service" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
    finally {
        Pop-Location
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "All analyses completed!" -ForegroundColor Green
Write-Host "View results at: http://localhost:9000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
```

## Common Issues

### Issue: "No POM in this directory"
**Solution**: You must run `mvn sonar:sonar` from within a service directory, not the project root.

```powershell
# ✗ Wrong (from project root)
mvn clean verify sonar:sonar

# ✓ Correct (from service directory)
cd product-service
mvn clean verify sonar:sonar
```

### Issue: "Authentication failed"
**Solution**: 
1. Make sure you changed the default password
2. Use the new password or generate a token
3. Use `-Dsonar.token=` instead of `-Dsonar.login=` and `-Dsonar.password=`

### Issue: "Connection refused"
**Solution**: Make sure SonarQube is running:
```powershell
docker ps | Select-String sonarqube
```

### Issue: Analysis is slow
**Solution**: This is normal for the first run. Subsequent analyses are faster.

## Viewing Results

1. Open http://localhost:9000
2. Click on the project name (e.g., `product-service`)
3. Review:
   - **Bugs**: Code errors
   - **Vulnerabilities**: Security issues
   - **Code Smells**: Maintainability issues
   - **Security Hotspots**: Require manual review
   - **Coverage**: Test coverage (if tests exist)

## Best Practices

1. **Run analysis before committing** major changes
2. **Fix Critical and High issues** first
3. **Review Security Hotspots** manually
4. **Track metrics over time** to see improvements
5. **Set quality gates** in SonarQube for your standards

## Stopping SonarQube

When you're done:
```powershell
docker compose -f docker-compose.devsecops.yml down
```

To remove data (fresh start):
```powershell
docker compose -f docker-compose.devsecops.yml down -v
```
