# DevSecOps Security Scanning Guide (Windows)

## Overview

This project includes security scanning tools to identify vulnerabilities in your microservices. On Windows, use the **PowerShell scripts** (`.ps1` files), not the bash scripts (`.sh` files).

---

## Available Scripts

### 1. **Trivy Image Scanning** (`trivy-scan.ps1`)
Scans Docker images for vulnerabilities in OS packages and application dependencies.

### 2. **OWASP Dependency Check** (`security-scan.ps1`)
Scans Maven dependencies for known vulnerabilities (CVEs).

---

## Prerequisites

### For Trivy Scanning:
Trivy will be automatically downloaded on first run, or you can install it manually:

```powershell
# Download Trivy (run from project root)
Invoke-WebRequest -Uri "https://github.com/aquasecurity/trivy/releases/download/v0.48.3/trivy_0.48.3_Windows-64bit.zip" -OutFile "trivy.zip"
Expand-Archive -Path "trivy.zip" -DestinationPath "trivy" -Force
```

### For OWASP Dependency Check:
- Maven must be installed and in your PATH
- Internet connection (to download vulnerability database)

---

## How to Run Security Scans

### Step 1: Start SonarQube (Optional but Recommended)

```powershell
# From project root
docker compose -f docker-compose.devsecops.yml up -d
```

This starts:
- **SonarQube** at http://localhost:9000
- **PostgreSQL** database for SonarQube

Default credentials:
- Username: `admin`
- Password: `admin` (you'll be prompted to change it on first login)

### Step 2: Run Trivy Image Scan

```powershell
# Navigate to scripts directory
cd scripts

# Run Trivy scan
powershell -ExecutionPolicy Bypass -File .\trivy-scan.ps1
```

**What it does:**
- Scans all Docker images: `product-service`, `order-service`, `api-gateway`, `frontend-react`
- Generates reports in `security-reports/trivy/`
- Shows CRITICAL and HIGH vulnerabilities in console

**Output files:**
- `security-reports/trivy/product-service-scan.json` - JSON format
- `security-reports/trivy/product-service-scan.txt` - Table format
- (Same for other services)

### Step 3: Run OWASP Dependency Check

```powershell
# From scripts directory
powershell -ExecutionPolicy Bypass -File .\security-scan.ps1
```

**What it does:**
- Runs unit tests for each service
- Scans Maven dependencies for vulnerabilities
- Generates HTML reports

**Output files:**
- `product-service/target/dependency-check/dependency-check-report.html`
- `order-service/target/dependency-check/dependency-check-report.html`
- `api-gateway/target/dependency-check/dependency-check-report.html`

---

## Understanding the Reports

### Trivy Reports

**Severity Levels:**
- 🔴 **CRITICAL** - Immediate action required
- 🟠 **HIGH** - Should be fixed soon
- 🟡 **MEDIUM** - Fix when possible
- 🔵 **LOW** - Informational

**Example Output:**
```
Total: 45 (CRITICAL: 2, HIGH: 8, MEDIUM: 15, LOW: 20)
```

### OWASP Dependency Check Reports

Open the HTML report in a browser to see:
- List of all dependencies
- Known vulnerabilities (CVEs)
- Severity scores (CVSS)
- Recommended fixes

---

## Viewing Reports

### Trivy Reports (Text)
```powershell
# View in console
Get-Content security-reports\trivy\product-service-scan.txt
```

### OWASP Reports (HTML)
```powershell
# Open in default browser
Start-Process product-service\target\dependency-check\dependency-check-report.html
```

### SonarQube Dashboard
1. Open http://localhost:9000
2. Login with `admin` / `admin`
3. Create a new project for each service
4. Follow the setup wizard to integrate with your Maven projects

---

## Common Issues & Solutions

### Issue: "Trivy not found"
**Solution:** The script will automatically download Trivy, or run:
```powershell
Invoke-WebRequest -Uri "https://github.com/aquasecurity/trivy/releases/download/v0.48.3/trivy_0.48.3_Windows-64bit.zip" -OutFile "trivy.zip"
Expand-Archive -Path "trivy.zip" -DestinationPath "trivy" -Force
```

### Issue: "Maven not found"
**Solution:** Install Maven:
```powershell
# Using Chocolatey
choco install maven

# Or download from: https://maven.apache.org/download.cgi
```

### Issue: "Docker images not found"
**Solution:** Build the images first:
```powershell
docker-compose build
```

### Issue: "chmod command not found"
**Solution:** You're on Windows! Use the `.ps1` scripts, not `.sh` scripts. No need for `chmod`.

### Issue: Scan takes too long
**Solution:** 
- First run downloads vulnerability databases (can take 5-10 minutes)
- Subsequent runs are much faster
- You can scan individual images by modifying the script

---

## Quick Reference Commands

```powershell
# Navigate to project root
cd c:\Users\khali\Desktop\mini-projet-b

# Start DevSecOps tools (SonarQube)
docker compose -f docker-compose.devsecops.yml up -d

# Run Trivy scan
cd scripts
powershell -ExecutionPolicy Bypass -File .\trivy-scan.ps1

# Run OWASP Dependency Check
powershell -ExecutionPolicy Bypass -File .\security-scan.ps1

# View Trivy reports
cd ..\security-reports\trivy
Get-ChildItem

# Open OWASP report
cd ..\..
Start-Process product-service\target\dependency-check\dependency-check-report.html

# Stop DevSecOps tools
docker compose -f docker-compose.devsecops.yml down
```

---

## Integration with CI/CD

These scripts can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run Security Scans
  run: |
    cd scripts
    powershell -ExecutionPolicy Bypass -File .\trivy-scan.ps1
    powershell -ExecutionPolicy Bypass -File .\security-scan.ps1
```

---

## Best Practices

1. **Run scans regularly** - At least weekly, or before each release
2. **Fix CRITICAL vulnerabilities immediately** - Don't deploy with critical issues
3. **Track HIGH vulnerabilities** - Create tickets to fix them
4. **Review reports** - Don't just run scans, actually review the findings
5. **Update dependencies** - Keep your dependencies up to date
6. **Use SonarQube** - For code quality and security analysis

---

## Report Locations Summary

| Tool | Report Location | Format |
|------|----------------|--------|
| Trivy | `security-reports/trivy/*.json` | JSON |
| Trivy | `security-reports/trivy/*.txt` | Table |
| OWASP | `*/target/dependency-check/*.html` | HTML |
| SonarQube | http://localhost:9000 | Web UI |

---

**Note:** The `.sh` scripts are for Linux/Mac. On Windows, always use the `.ps1` PowerShell scripts!
