#!/bin/bash
# Security Scan Script: Test and Dependency Check
# This script runs unit tests and OWASP dependency checks for all services

set -e

echo "=========================================="
echo "Running Security Scans"
echo "=========================================="

SERVICES=("product-service" "order-service" "api-gateway")

for SERVICE in "${SERVICES[@]}"; do
    echo ""
    echo "=========================================="
    echo "Scanning: $SERVICE"
    echo "=========================================="
    
    cd "$SERVICE"
    
    echo "Running tests..."
    mvn clean test
    
    echo "Running OWASP Dependency-Check..."
    mvn dependency-check:check
    
    echo "Report location: $SERVICE/target/dependency-check/dependency-check-report.html"
    
    cd ..
done

echo ""
echo "=========================================="
echo "All scans completed!"
echo "=========================================="
echo "Reports are located in:"
for SERVICE in "${SERVICES[@]}"; do
    echo "  - $SERVICE/target/dependency-check/dependency-check-report.html"
done
