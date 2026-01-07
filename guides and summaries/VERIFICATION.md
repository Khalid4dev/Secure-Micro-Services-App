# DevSecOps - Verification Guide

## ✅ All Tools Installed and Configured

This guide shows you exactly how to run each security tool and what to expect.

## 🚀 Running Security Scans

### Option 1: Run All Scans (Recommended)

From the **project root** directory:

```powershell
# Run OWASP Dependency Check
.\scripts\security-scan.ps1

# Scan Docker images with Trivy
.\scripts\trivy-scan.ps1
```

### Option 2: Run Individual Service Scans

**OWASP Dependency Check (single service):**
```powershell
cd product-service
mvn dependency-check:check
```

**Trivy (single image):**
```powershell
.\trivy\trivy.exe image product-service:latest
```

**SonarQube Analysis:**
```powershell
# 1. Start SonarQube
docker compose -f docker-compose.devsecops.yml up -d

# 2. Wait for startup (check http://localhost:9000)
# Default login: admin/admin

# 3. Run analysis
cd product-service
mvn clean verify sonar:sonar `
  -Dsonar.projectKey=product-service `
  -Dsonar.host.url=http://localhost:9000 `
  -Dsonar.login=admin `
  -Dsonar.password=your-password
```

## 📊 Expected Outputs

### OWASP Dependency-Check

**Console Output:**
```
==========================================
Running Security Scans
==========================================
Project root: C:\Users\khali\Desktop\mini-projet-b

==========================================
Scanning: product-service
==========================================
Running tests...
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0

Running OWASP Dependency-Check...
[INFO] Checking for updates
[INFO] Check for updates complete
[INFO] Analysis Started
[INFO] Finished Archive Analyzer (0 seconds)
[INFO] Finished File Name Analyzer (0 seconds)
[INFO] Finished Jar Analyzer (2 seconds)
[INFO] Finished Central Analyzer (5 seconds)
[INFO] Finished Dependency Merging Analyzer (0 seconds)
[INFO] Finished Version Filter Analyzer (0 seconds)
[INFO] Finished Hint Analyzer (0 seconds)
[INFO] Created CPE Index (1 seconds)
[INFO] Finished CPE Analyzer (2 seconds)
[INFO] Finished False Positive Analyzer (0 seconds)
[INFO] Finished NVD CVE Analyzer (3 seconds)
[INFO] Analysis Complete (15 seconds)
[INFO] Writing report to: target/dependency-check/dependency-check-report.html

Report location: C:\Users\khali\Desktop\mini-projet-b\product-service\target\dependency-check\dependency-check-report.html
```

**Report Location:**
- `product-service\target\dependency-check\dependency-check-report.html`
- Open in browser to view detailed vulnerability information

**Sample Report Content:**
```
Dependency-Check Analysis Report
=================================
Generated: 2026-01-03 21:15:00

Summary
-------
Dependencies Scanned: 45
Vulnerable Dependencies: 2

Vulnerabilities by Severity:
  Critical: 0
  High: 1
  Medium: 1
  Low: 0

Vulnerable Dependencies
-----------------------
1. spring-boot-starter-web-3.2.4.jar
   CVE-2024-XXXXX (High) - CVSS: 7.5
   Description: Potential security vulnerability in Spring Framework
   Recommendation: Update to version 3.2.5 or later
   
2. postgresql-42.6.0.jar
   CVE-2024-YYYYY (Medium) - CVSS: 5.3
   Description: SQL injection vulnerability
   Recommendation: Update to version 42.7.0 or later
```

### Trivy Scan

**Console Output:**
```
==========================================
Scanning Docker Images with Trivy
==========================================
Project root: C:\Users\khali\Desktop\mini-projet-b
Using local Trivy installation: C:\Users\khali\Desktop\mini-projet-b\trivy\trivy.exe

==========================================
Scanning: product-service:latest
==========================================
Generating JSON report...
Generating table report...

Critical and High vulnerabilities:

product-service:latest (alpine 3.18.4)
======================================
Total: 15 (CRITICAL: 2, HIGH: 5, MEDIUM: 6, LOW: 2, UNKNOWN: 0)

┌────────────────┬────────────────┬──────────┬────────────┬───────────────────┬───────────────┐
│    Library     │ Vulnerability  │ Severity │  Installed │  Fixed Version    │     Title     │
├────────────────┼────────────────┼──────────┼────────────┼───────────────────┼───────────────┤
│ libssl3        │ CVE-2023-6129  │ CRITICAL │ 3.1.2-r0   │ 3.1.4-r5          │ openssl: ...  │
│ libcrypto3     │ CVE-2023-6129  │ CRITICAL │ 3.1.2-r0   │ 3.1.4-r5          │ openssl: ...  │
│ busybox        │ CVE-2023-42363 │ HIGH     │ 1.36.1-r2  │ 1.36.1-r15        │ busybox: ...  │
└────────────────┴────────────────┴──────────┴────────────┴───────────────────┴───────────────┘

Reports saved:
  - JSON: security-reports\trivy\product-service-scan.json
  - Table: security-reports\trivy\product-service-scan.txt
```

**Report Files:**
- JSON format: `security-reports\trivy\product-service-scan.json`
- Text format: `security-reports\trivy\product-service-scan.txt`

### SonarQube Analysis

**Console Output:**
```
[INFO] ANALYSIS SUCCESSFUL, you can browse http://localhost:9000/dashboard?id=product-service
[INFO] Note that you will be able to access the updated dashboard once the server has processed the submitted analysis report
[INFO] More about the report processing at http://localhost:9000/api/ce/task?id=AYxxx
```

**Dashboard Metrics:**
- Bugs: 0
- Vulnerabilities: 2
- Security Hotspots: 3
- Code Smells: 15
- Coverage: 65.5%
- Duplications: 2.3%

## 🔧 Common Issues and Solutions

### Issue 1: "Cannot find path"
**Solution:** Make sure you run the scripts from the `scripts` directory or use the full path:
```powershell
.\scripts\security-scan.ps1
```

### Issue 2: "mvn: command not found"
**Solution:** Ensure Maven is installed and in your PATH:
```powershell
mvn --version
```

### Issue 3: "Docker image not found"
**Solution:** Build the images first:
```powershell
docker compose build
```

### Issue 4: "Trivy database download slow"
**Solution:** First run takes 5-10 minutes to download vulnerability databases. Subsequent runs are much faster.

### Issue 5: SonarQube "Unauthorized"
**Solution:** Change default password on first login at http://localhost:9000

## 📈 Interpreting Results

### CVSS Severity Levels

| CVSS Score | Severity | Action Required |
|------------|----------|-----------------|
| 9.0 - 10.0 | Critical | Fix immediately |
| 7.0 - 8.9  | High     | Fix within 1 week |
| 4.0 - 6.9  | Medium   | Fix within 1 month |
| 0.1 - 3.9  | Low      | Fix when possible |

### Trivy Severity

- **CRITICAL**: Exploitable vulnerabilities, fix immediately
- **HIGH**: Serious vulnerabilities, fix soon
- **MEDIUM**: Moderate risk, plan to fix
- **LOW**: Minor issues, monitor

### SonarQube Quality Gates

- **Bugs**: Code errors that need fixing
- **Vulnerabilities**: Security issues (OWASP Top 10)
- **Security Hotspots**: Require manual review
- **Code Smells**: Maintainability issues

## 🎯 Next Steps

1. **Review all generated reports**
2. **Fix CRITICAL and HIGH severity issues**
3. **Update dependencies** in `pom.xml`
4. **Rebuild Docker images** with updated base images
5. **Re-run scans** to verify fixes
6. **Set up CI/CD integration** (see SECURITY.md)

## 📚 Report Locations Summary

```
mini-projet-b/
├── product-service/target/dependency-check/
│   ├── dependency-check-report.html
│   ├── dependency-check-report.xml
│   └── dependency-check-report.json
├── order-service/target/dependency-check/
│   └── (same as above)
├── api-gateway/target/dependency-check/
│   └── (same as above)
└── security-reports/trivy/
    ├── product-service-scan.json
    ├── product-service-scan.txt
    ├── order-service-scan.json
    ├── order-service-scan.txt
    ├── api-gateway-scan.json
    ├── api-gateway-scan.txt
    ├── frontend-react-scan.json
    └── frontend-react-scan.txt
```

## ✅ Verification Checklist

- [ ] OWASP Dependency-Check reports generated for all 3 services
- [ ] Trivy scans completed for all 4 Docker images
- [ ] SonarQube dashboard accessible at http://localhost:9000
- [ ] All CRITICAL vulnerabilities documented
- [ ] Remediation plan created for HIGH vulnerabilities
- [ ] Reports reviewed by team

---

For detailed remediation guidance, see [SECURITY.md](../SECURITY.md)
