# DevSecOps Quick Start Guide

## ✅ Installation Complete

All DevSecOps tools are now configured and ready to use!

## 🛠️ Installed Tools

1. **OWASP Dependency-Check** - Maven plugin (configured in all services)
2. **SonarQube** - Docker Compose service (docker-compose.devsecops.yml)
3. **Trivy** - Downloaded to `trivy/trivy.exe`

## 🚀 Quick Start Commands

### 1. Run OWASP Dependency Check

```powershell
cd scripts
.\security-scan.ps1
```

**What it does:**
- Runs unit tests for all services
- Scans Maven dependencies for known vulnerabilities
- Generates HTML reports

**Reports location:**
- `product-service\target\dependency-check\dependency-check-report.html`
- `order-service\target\dependency-check\dependency-check-report.html`
- `api-gateway\target\dependency-check\dependency-check-report.html`

### 2. Start SonarQube

```powershell
docker compose -f docker-compose.devsecops.yml up -d
```

**Access:** http://localhost:9000  
**Credentials:** admin / admin (change on first login)

**Run analysis for a service:**
```powershell
cd product-service
mvn clean verify sonar:sonar `
  -Dsonar.projectKey=product-service `
  -Dsonar.host.url=http://localhost:9000 `
  -Dsonar.login=admin `
  -Dsonar.password=your-password
```

### 3. Scan Docker Images with Trivy

```powershell
cd scripts
.\trivy-scan.ps1
```

**What it does:**
- Scans all Docker images for vulnerabilities
- Generates JSON and text reports
- Shows CRITICAL and HIGH vulnerabilities in console

**Reports location:**
- `security-reports\trivy\product-service-scan.json`
- `security-reports\trivy\order-service-scan.json`
- `security-reports\trivy\api-gateway-scan.json`
- `security-reports\trivy\frontend-react-scan.json`

## 📊 Manual Trivy Commands

Scan a specific image:
```powershell
.\trivy\trivy.exe image product-service:latest
```

Scan with specific severity:
```powershell
.\trivy\trivy.exe image --severity CRITICAL,HIGH product-service:latest
```

Generate HTML report (requires template):
```powershell
.\trivy\trivy.exe image --format json -o report.json product-service:latest
```

## 🔍 Understanding Scan Results

### OWASP Dependency-Check
- **CVSS Score**: 0-10 (10 = most severe)
- **Configured threshold**: 7.0 (build fails if vulnerabilities ≥ 7.0)
- **Fix**: Update dependency version in pom.xml

### SonarQube
- **Bugs**: Code errors that need fixing
- **Vulnerabilities**: Security issues
- **Code Smells**: Maintainability issues
- **Security Hotspots**: Require manual review

### Trivy
- **CRITICAL**: Fix immediately
- **HIGH**: Fix soon
- **MEDIUM**: Fix when possible
- **LOW**: Monitor
- **Fix**: Update base image or rebuild with latest patches

## 🔧 Common Fixes

### Update Maven Dependency
```xml
<!-- In pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.5</version> <!-- Updated version -->
</dependency>
```

### Update Docker Base Image
```dockerfile
# In Dockerfile
FROM eclipse-temurin:21.0.2_13-jre-alpine  # Updated version
```

### Suppress False Positives (OWASP)
Create `dependency-check-suppressions.xml` in service root:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<suppressions xmlns="https://jeremylong.github.io/DependencyCheck/dependency-suppression.1.3.xsd">
    <suppress>
        <notes>False positive - not applicable</notes>
        <cve>CVE-2023-12345</cve>
    </suppress>
</suppressions>
```

Add to pom.xml:
```xml
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <configuration>
        <suppressionFile>dependency-check-suppressions.xml</suppressionFile>
    </configuration>
</plugin>
```

## 📅 Recommended Scan Schedule

- **Daily**: Trivy scans on CI/CD
- **Weekly**: Full OWASP Dependency-Check
- **Per PR**: SonarQube analysis
- **Monthly**: Manual security review

## 📚 Additional Resources

- Full documentation: [SECURITY.md](SECURITY.md)
- OWASP Dependency-Check: https://owasp.org/www-project-dependency-check/
- SonarQube Docs: https://docs.sonarqube.org/
- Trivy Docs: https://aquasecurity.github.io/trivy/

## 🆘 Troubleshooting

**Trivy not found:**
```powershell
# Use full path
.\trivy\trivy.exe image product-service:latest
```

**SonarQube not starting:**
```powershell
# Check logs
docker compose -f docker-compose.devsecops.yml logs sonarqube
```

**Maven dependency check slow:**
```powershell
# First run downloads CVE database (takes 5-10 minutes)
# Subsequent runs are faster
```

## ✨ Next Steps

1. Review the generated reports
2. Fix CRITICAL and HIGH vulnerabilities
3. Set up CI/CD integration (see SECURITY.md)
4. Configure automated scans on pull requests
5. Establish security baseline and track improvements

---

**Need help?** Refer to [SECURITY.md](SECURITY.md) for detailed instructions and examples.
