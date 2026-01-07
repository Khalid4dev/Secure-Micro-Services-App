# Security Guide

This document explains how to run security scans on the microservices application and how to address common security findings.

## Table of Contents

1. [Security Tools Overview](#security-tools-overview)
2. [Running Security Scans](#running-security-scans)
3. [Understanding Reports](#understanding-reports)
4. [Fixing Common Vulnerabilities](#fixing-common-vulnerabilities)
5. [CI/CD Integration](#cicd-integration)

## Security Tools Overview

This project uses three main security scanning tools:

### 1. OWASP Dependency-Check
- **Purpose**: Identifies known vulnerabilities in project dependencies
- **Scope**: Maven dependencies (Java libraries)
- **Reports**: HTML, XML, JSON, CSV
- **Location**: `{service}/target/dependency-check/`

### 2. SonarQube
- **Purpose**: Static code analysis for code quality and security issues
- **Scope**: Source code (bugs, code smells, security hotspots)
- **Reports**: Web dashboard at `http://localhost:9000`
- **Location**: SonarQube server

### 3. Trivy
- **Purpose**: Container image vulnerability scanning
- **Scope**: Docker images and their OS packages
- **Reports**: HTML, JSON, terminal output
- **Location**: `security-reports/trivy/`

## Running Security Scans

### Prerequisites

- **Java 21** and **Maven 3.8+** installed
- **Docker** and **Docker Compose** installed
- **Trivy** installed (for container scanning)

### 1. OWASP Dependency Check

Run dependency checks for all services:

**Bash (Linux/macOS/Git Bash):**
```bash
cd scripts
chmod +x security-scan.sh
./security-scan.sh
```

**PowerShell (Windows):**
```powershell
cd scripts
.\security-scan.ps1
```

**Manual (per service):**
```bash
cd product-service
mvn dependency-check:check
```

**Reports Location:**
- `product-service/target/dependency-check/dependency-check-report.html`
- `order-service/target/dependency-check/dependency-check-report.html`
- `api-gateway/target/dependency-check/dependency-check-report.html`

### 2. SonarQube Analysis

**Start SonarQube:**
```bash
docker compose -f docker-compose.devsecops.yml up -d
```

Wait for SonarQube to start (check `http://localhost:9000`). Default credentials: `admin/admin` (you'll be prompted to change on first login).

**Run analysis for each service:**
```bash
cd product-service
mvn clean verify sonar:sonar \
  -Dsonar.projectKey=product-service \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=admin \
  -Dsonar.password=your-new-password
```

Repeat for `order-service` and `api-gateway`.

**View Reports:**
Open `http://localhost:9000` and navigate to your project.

### 3. Trivy Container Scanning

**Build images first:**
```bash
cd scripts
chmod +x build-images.sh trivy-scan.sh
./build-images.sh
```

**Run Trivy scans:**
```bash
./trivy-scan.sh
```

**PowerShell:**
```powershell
.\trivy-scan.ps1
```

**Manual scan (single image):**
```bash
trivy image product-service:latest
```

**Reports Location:**
- `security-reports/trivy/product-service-scan.html`
- `security-reports/trivy/order-service-scan.html`
- `security-reports/trivy/api-gateway-scan.html`
- `security-reports/trivy/frontend-react-scan.html`

## Understanding Reports

### OWASP Dependency-Check Report

The HTML report shows:
- **Severity**: Critical, High, Medium, Low
- **CVE ID**: Common Vulnerabilities and Exposures identifier
- **Dependency**: Affected library and version
- **Description**: Vulnerability details
- **Recommendation**: Update version or apply patch

**Example:**
```
CVE-2023-12345 (Critical)
Dependency: spring-web-5.3.20.jar
Description: Remote Code Execution in Spring Framework
Recommendation: Update to version 5.3.30 or later
```

### SonarQube Dashboard

Key metrics:
- **Bugs**: Actual code errors
- **Vulnerabilities**: Security issues
- **Code Smells**: Maintainability issues
- **Coverage**: Test coverage percentage
- **Duplications**: Duplicate code blocks

**Security Hotspots** require manual review to determine if they're actual vulnerabilities.

### Trivy Report

Shows vulnerabilities in:
- **OS Packages**: Base image vulnerabilities (Alpine, Debian, etc.)
- **Application Dependencies**: JAR files, npm packages
- **Severity Levels**: CRITICAL, HIGH, MEDIUM, LOW, UNKNOWN

**Example:**
```
alpine-baselayout (CVE-2023-1234)
Severity: HIGH
Installed Version: 3.2.0-r18
Fixed Version: 3.2.0-r22
```

## Fixing Common Vulnerabilities

### 1. Dependency Vulnerabilities (OWASP)

**Problem**: Outdated or vulnerable dependencies

**Solution:**
1. Identify the vulnerable dependency in the report
2. Check for updated version:
   ```bash
   mvn versions:display-dependency-updates
   ```
3. Update `pom.xml`:
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
       <version>3.2.5</version> <!-- Updated version -->
   </dependency>
   ```
4. Re-run tests:
   ```bash
   mvn clean test
   ```
5. Re-scan:
   ```bash
   mvn dependency-check:check
   ```

**Suppressing False Positives:**

Create `dependency-check-suppressions.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<suppressions xmlns="https://jeremylong.github.io/DependencyCheck/dependency-suppression.1.3.xsd">
    <suppress>
        <notes>False positive - not applicable to our usage</notes>
        <cve>CVE-2023-12345</cve>
    </suppress>
</suppressions>
```

Add to `pom.xml`:
```xml
<configuration>
    <suppressionFile>dependency-check-suppressions.xml</suppressionFile>
</configuration>
```

### 2. Container Image Vulnerabilities (Trivy)

**Problem**: Vulnerable OS packages or base image

**Solutions:**

**A. Update Base Image:**
```dockerfile
# Before
FROM eclipse-temurin:21-jre-alpine

# After (use newer version)
FROM eclipse-temurin:21.0.2_13-jre-alpine
```

**B. Use Distroless Images:**
```dockerfile
# Multi-stage build with distroless
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM gcr.io/distroless/java21-debian12
COPY --from=build /app/target/*.jar /app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

**C. Rebuild Images Regularly:**
```bash
docker compose build --no-cache
```

**D. Ignore Unfixable Vulnerabilities:**

Create `.trivyignore`:
```
# Vulnerability in base image with no fix available yet
CVE-2023-12345
```

### 3. Code Quality Issues (SonarQube)

**Common Issues and Fixes:**

**A. SQL Injection:**
```java
// Bad
String query = "SELECT * FROM users WHERE id = " + userId;

// Good
String query = "SELECT * FROM users WHERE id = ?";
PreparedStatement stmt = connection.prepareStatement(query);
stmt.setLong(1, userId);
```

**B. Hardcoded Secrets:**
```java
// Bad
String apiKey = "sk-1234567890abcdef";

// Good
@Value("${api.key}")
private String apiKey;
```

**C. Weak Cryptography:**
```java
// Bad
MessageDigest md = MessageDigest.getInstance("MD5");

// Good
MessageDigest md = MessageDigest.getInstance("SHA-256");
```

**D. Missing Input Validation:**
```java
// Add validation
@NotNull
@Size(min = 1, max = 100)
private String productName;
```

### 4. Authentication/Authorization Issues

**Common Fixes:**

**A. Ensure JWT Validation:**
```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/microshop
          jwk-set-uri: http://localhost:8080/realms/microshop/protocol/openid-connect/certs
```

**B. Role-Based Access Control:**
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/products")
public ResponseEntity<Product> createProduct(@RequestBody Product product) {
    // ...
}
```

**C. CORS Configuration:**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    // ...
}
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/security-scan.yml`:

```yaml
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  dependency-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Run OWASP Dependency Check
        run: |
          cd product-service && mvn dependency-check:check
          cd ../order-service && mvn dependency-check:check
          cd ../api-gateway && mvn dependency-check:check
      
      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: dependency-check-reports
          path: '**/target/dependency-check/*.html'

  trivy-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: docker compose build
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'product-service:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

### GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - security

dependency-check:
  stage: security
  image: maven:3.9-eclipse-temurin-21
  script:
    - cd product-service && mvn dependency-check:check
    - cd ../order-service && mvn dependency-check:check
    - cd ../api-gateway && mvn dependency-check:check
  artifacts:
    paths:
      - '**/target/dependency-check/*.html'
    expire_in: 1 week

trivy-scan:
  stage: security
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - apk add --no-cache curl
    - curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
  script:
    - docker build -t product-service:latest ./product-service
    - trivy image --exit-code 1 --severity CRITICAL product-service:latest
```

## Best Practices

1. **Run scans regularly**: At minimum, weekly and on every PR
2. **Fix Critical/High vulnerabilities immediately**: Don't let them accumulate
3. **Keep dependencies updated**: Use Dependabot or Renovate
4. **Review SonarQube hotspots**: Manual review is important
5. **Use minimal base images**: Distroless or Alpine
6. **Enable security headers**: HSTS, CSP, X-Frame-Options
7. **Implement rate limiting**: Prevent brute force attacks
8. **Log security events**: Authentication failures, authorization denials
9. **Encrypt sensitive data**: At rest and in transit
10. **Regular security training**: Keep team updated on security practices

## Support and Resources

- **OWASP Dependency-Check**: https://owasp.org/www-project-dependency-check/
- **SonarQube**: https://docs.sonarqube.org/
- **Trivy**: https://aquasecurity.github.io/trivy/
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CWE Database**: https://cwe.mitre.org/
- **NVD**: https://nvd.nist.gov/

## Contact

For security issues, please contact the security team or create a private security advisory on GitHub.
