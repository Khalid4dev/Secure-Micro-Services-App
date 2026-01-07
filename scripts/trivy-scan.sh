#!/bin/bash
# Trivy Image Scan Script
# This script scans Docker images for vulnerabilities using Trivy

set -e

echo "=========================================="
echo "Scanning Docker Images with Trivy"
echo "=========================================="

# Check if Trivy is installed
if ! command -v trivy &> /dev/null; then
    echo "ERROR: Trivy is not installed!"
    echo "Please install Trivy from: https://github.com/aquasecurity/trivy"
    echo ""
    echo "Quick install (Linux/macOS):"
    echo "  curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin"
    echo ""
    echo "Windows (using Chocolatey):"
    echo "  choco install trivy"
    exit 1
fi

IMAGES=("product-service:latest" "order-service:latest" "api-gateway:latest" "frontend-react:latest")
REPORT_DIR="security-reports/trivy"

mkdir -p "$REPORT_DIR"

for IMAGE in "${IMAGES[@]}"; do
    echo ""
    echo "=========================================="
    echo "Scanning: $IMAGE"
    echo "=========================================="
    
    IMAGE_NAME=$(echo "$IMAGE" | cut -d':' -f1)
    REPORT_FILE="$REPORT_DIR/${IMAGE_NAME}-scan.html"
    JSON_FILE="$REPORT_DIR/${IMAGE_NAME}-scan.json"
    
    # Scan and generate HTML report
    trivy image --format template --template "@contrib/html.tpl" -o "$REPORT_FILE" "$IMAGE"
    
    # Scan and generate JSON report
    trivy image --format json -o "$JSON_FILE" "$IMAGE"
    
    # Display critical and high vulnerabilities
    echo ""
    echo "Critical and High vulnerabilities:"
    trivy image --severity CRITICAL,HIGH "$IMAGE"
    
    echo "Report saved to: $REPORT_FILE"
done

echo ""
echo "=========================================="
echo "All scans completed!"
echo "=========================================="
echo "Reports are located in: $REPORT_DIR/"
ls -lh "$REPORT_DIR/"
