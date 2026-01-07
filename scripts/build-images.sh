#!/bin/bash
# Build Docker Images Script
# This script builds Docker images for all services

set -e

echo "=========================================="
echo "Building Docker Images"
echo "=========================================="

SERVICES=("product-service" "order-service" "api-gateway" "frontend-react")

for SERVICE in "${SERVICES[@]}"; do
    echo ""
    echo "Building: $SERVICE"
    docker build -t "$SERVICE:latest" "./$SERVICE"
done

echo ""
echo "=========================================="
echo "All images built successfully!"
echo "=========================================="
echo "Built images:"
docker images | grep -E "(product-service|order-service|api-gateway|frontend-react)"
