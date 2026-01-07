# Secure Microservices Application

A production-ready e-commerce microservices application built with Spring Boot, React, and Keycloak, featuring comprehensive security, role-based access control, and containerized deployment.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project demonstrates a modern microservices architecture implementing an e-commerce platform with secure authentication and authorization. The application consists of multiple independent services communicating through a centralized API gateway, with Keycloak providing enterprise-grade identity and access management.

### Key Highlights

- **Microservices Architecture**: Independently deployable services with clear separation of concerns
- **Security-First Design**: OAuth 2.0/OIDC authentication with JWT tokens and role-based access control
- **Containerized Deployment**: Docker Compose orchestration for all services
- **Database Per Service**: Each microservice maintains its own PostgreSQL database
- **Modern Frontend**: React-based single-page application with responsive design
- **DevSecOps Integration**: Automated security scanning with Trivy and OWASP Dependency-Check

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│                    Port: 3000                                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway                               │
│                    Port: 9090                                │
│              (Route + JWT Validation)                        │
└─────────┬──────────────────────────────┬────────────────────┘
          │                              │
          ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│  Product Service     │      │   Order Service      │
│  Port: 8081          │      │   Port: 8082         │
│  Database: productdb │      │   Database: orderdb  │
└──────────────────────┘      └──────────────────────┘
          │                              │
          └──────────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │     Keycloak         │
              │     Port: 8080       │
              │  (Authentication)    │
              └──────────────────────┘
```

### Service Components

#### 1. Frontend (React)
- **Port**: 3000
- **Technology**: React 18, TypeScript, Vite
- **Purpose**: User interface for browsing products, placing orders, and administration
- **Features**:
  - Product catalog with search functionality
  - Shopping cart and order management
  - Admin dashboard for product and order management
  - Role-based UI rendering

#### 2. API Gateway
- **Port**: 9090
- **Technology**: Spring Cloud Gateway
- **Purpose**: Single entry point for all client requests
- **Responsibilities**:
  - Request routing to appropriate microservices
  - JWT token validation
  - CORS configuration
  - Load balancing

#### 3. Product Service
- **Port**: 8081
- **Database**: PostgreSQL (productdb)
- **Purpose**: Product catalog management
- **Endpoints**:
  - `GET /api/products` - List all products
  - `GET /api/products/{id}` - Get product by ID
  - `POST /api/products` - Create product (ADMIN only)
  - `PUT /api/products/{id}` - Update product (ADMIN only)
  - `DELETE /api/products/{id}` - Delete product (ADMIN only)

#### 4. Order Service
- **Port**: 8082
- **Database**: PostgreSQL (orderdb)
- **Purpose**: Order processing and management
- **Endpoints**:
  - `POST /api/orders` - Create order (CLIENT, ADMIN)
  - `GET /api/orders/my` - Get user's orders (Authenticated)
  - `GET /api/orders` - Get all orders (ADMIN only)

#### 5. Keycloak
- **Port**: 8080
- **Database**: PostgreSQL (keycloak)
- **Purpose**: Identity and access management
- **Features**:
  - User authentication
  - OAuth 2.0 / OpenID Connect
  - Role-based access control (RBAC)
  - JWT token issuance and validation

## Features

### User Features

- **Product Browsing**: View product catalog with details (name, description, price, stock)
- **Product Search**: Search products by ID
- **Shopping**: Add products to cart with customizable quantities
- **Order Management**: View order history with detailed information
- **Order Tracking**: Monitor order status (PENDING, COMPLETED, CANCELLED)

### Admin Features

- **Product Management**: Full CRUD operations on products
- **Inventory Control**: Manage stock quantities
- **Order Oversight**: View all orders from all users
- **User Management**: Through Keycloak admin console

### Security Features

- **Authentication**: OAuth 2.0 / OIDC with Keycloak
- **Authorization**: Role-based access control (ADMIN, CLIENT)
- **JWT Tokens**: Stateless authentication with signed tokens
- **Password Security**: Bcrypt hashing via Keycloak
- **HTTPS Ready**: SSL/TLS configuration support
- **CORS Protection**: Configured cross-origin resource sharing

### Technical Features

- **Microservices**: Independent, scalable services
- **Database Isolation**: Separate databases per service
- **Service Discovery**: Internal service communication
- **Health Checks**: Actuator endpoints for monitoring
- **Containerization**: Docker-based deployment
- **Security Scanning**: Automated vulnerability detection

## Technology Stack

### Backend

- **Java**: 21 (LTS)
- **Spring Boot**: 3.2.4
- **Spring Security**: OAuth2 Resource Server
- **Spring Data JPA**: Database access
- **Spring Cloud Gateway**: API Gateway
- **PostgreSQL**: 15
- **Keycloak**: 24.0.1
- **Maven**: 3.8+

### Frontend

- **React**: 18
- **TypeScript**: 5
- **Vite**: Build tool
- **Axios**: HTTP client
- **React Router**: Navigation

### DevOps

- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Trivy**: Container vulnerability scanning
- **OWASP Dependency-Check**: Dependency vulnerability scanning
- **SonarQube**: Code quality analysis (optional)

## Prerequisites

### Required Software

- **Docker**: 20.10 or higher
- **Docker Compose**: 2.0 or higher
- **Java**: 21 (for local development)
- **Maven**: 3.8+ (for local development)
- **Node.js**: 18+ (for frontend development)

### System Requirements

- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: 10GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)

## Getting Started

### Quick Start (Docker Compose)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Khalid4dev/Secure-Micro-Services-App.git
   cd Secure-Micro-Services-App
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Wait for services to be healthy** (approximately 2-3 minutes)
   ```bash
   docker-compose ps
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Keycloak Admin: http://localhost:8080/admin
   - API Gateway: http://localhost:9090

5. **Login credentials**
   - **Admin User**: `admin` / `admin123`
   - **Client User**: `client` / `client123`
   - **Keycloak Admin**: `admin` / `admin`

### Stopping Services

```bash
docker-compose down
```

To remove volumes (databases):
```bash
docker-compose down -v
```

## Configuration

### Environment Variables

Services can be configured via environment variables in `docker-compose.yml`:

#### Keycloak Configuration
```yaml
KEYCLOAK_ADMIN: admin
KEYCLOAK_ADMIN_PASSWORD: admin
KC_DB_URL: jdbc:postgresql://keycloak-db:5432/keycloak
```

#### Product Service Configuration
```yaml
SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-product:5432/productdb
SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI: http://localhost:8080/realms/microshop
```

#### Order Service Configuration
```yaml
SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-order:5432/orderdb
APPLICATION_CONFIG_PRODUCT_SERVICE_URL: http://product-service:8081/api/products
```

### Database Configuration

Each service has its own PostgreSQL database:

- **Keycloak DB**: Port 5432 (internal)
- **Product DB**: Port 5433 (exposed)
- **Order DB**: Port 5434 (exposed)

### Keycloak Realm Configuration

The application uses a pre-configured realm (`microshop`) with:
- **Roles**: ADMIN, CLIENT
- **Users**: admin, client
- **Client**: gateway-client (confidential)

Realm configuration: `infra/keycloak/realm-export.json`

## API Documentation

### Authentication

All API requests (except health checks) require a valid JWT token.

**Obtaining a token:**
```bash
curl -X POST "http://localhost:8080/realms/microshop/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=gateway-client" \
  -d "client_secret=gateway-client-secret" \
  -d "grant_type=password" \
  -d "username=admin" \
  -d "password=admin123"
```

**Using the token:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:9090/api/products
```

### Product Service Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | CLIENT, ADMIN | List all products |
| GET | `/api/products/{id}` | CLIENT, ADMIN | Get product by ID |
| POST | `/api/products` | ADMIN | Create new product |
| PUT | `/api/products/{id}` | ADMIN | Update product |
| DELETE | `/api/products/{id}` | ADMIN | Delete product |

**Example: Create Product**
```bash
curl -X POST "http://localhost:9090/api/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stockQuantity": 50
  }'
```

### Order Service Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | CLIENT, ADMIN | Create order |
| GET | `/api/orders/my` | Authenticated | Get user's orders |
| GET | `/api/orders` | ADMIN | Get all orders |

**Example: Create Order**
```bash
curl -X POST "http://localhost:9090/api/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": 1, "quantity": 2},
      {"productId": 3, "quantity": 1}
    ]
  }'
```

## Security

### Authentication Flow

1. User submits credentials to Keycloak
2. Keycloak validates and issues JWT token
3. Client includes token in Authorization header
4. API Gateway validates token signature and claims
5. Gateway forwards request to appropriate service
6. Service validates token and checks roles

### Role-Based Access Control

| Resource | ADMIN | CLIENT |
|----------|-------|--------|
| View Products | Yes | Yes |
| Search Products | Yes | Yes |
| Create Products | Yes | No |
| Update Products | Yes | No |
| Delete Products | Yes | No |
| Create Orders | Yes | Yes |
| View Own Orders | Yes | Yes |
| View All Orders | Yes | No |

### Security Best Practices

- **Never commit secrets**: Use environment variables
- **Rotate credentials**: Change default passwords in production
- **Use HTTPS**: Enable SSL/TLS in production
- **Regular updates**: Keep dependencies up to date
- **Security scanning**: Run automated scans regularly
- **Audit logs**: Monitor authentication and authorization events

### Running Security Scans

**Trivy (Container Scanning):**
```bash
cd scripts
./trivy-scan.ps1  # Windows
./trivy-scan.sh   # Linux/Mac
```

**OWASP Dependency Check:**
```bash
cd scripts
./security-scan.ps1  # Windows
./security-scan.sh   # Linux/Mac
```

See [SECURITY.md](SECURITY.md) for detailed security documentation.

## Testing

### Manual Testing

Comprehensive testing guide available in [TESTING.md](TESTING.md).

**Quick API Test:**
```powershell
# Get token
$response = Invoke-RestMethod -Uri "http://localhost:8080/realms/microshop/protocol/openid-connect/token" -Method Post -Body @{client_id="gateway-client"; client_secret="gateway-client-secret"; grant_type="password"; username="admin"; password="admin123"} -ContentType "application/x-www-form-urlencoded"
$token = $response.access_token

# Test product endpoint
$headers = @{"Authorization" = "Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:9090/api/products" -Method Get -Headers $headers
```

### Frontend Testing

1. Open http://localhost:3000
2. Login as admin (`admin` / `admin123`)
3. Test features:
   - Search products by ID
   - Create/edit/delete products (Admin Products page)
   - Place orders with custom quantities
   - View order history
   - View all orders (Admin Orders page)

### Unit Tests

Run tests for individual services:
```bash
cd product-service
mvn test

cd ../order-service
mvn test

cd ../api-gateway
mvn test
```

## Deployment

### Production Considerations

1. **Environment Variables**
   - Use secrets management (e.g., Docker Secrets, Kubernetes Secrets)
   - Never use default credentials

2. **Database**
   - Use managed database services (AWS RDS, Azure Database)
   - Enable automated backups
   - Configure connection pooling

3. **Keycloak**
   - Use external database (not embedded)
   - Configure HTTPS
   - Enable clustering for high availability

4. **Monitoring**
   - Configure Spring Boot Actuator
   - Use monitoring tools (Prometheus, Grafana)
   - Set up log aggregation (ELK Stack, Splunk)

5. **Scaling**
   - Use Kubernetes for orchestration
   - Configure horizontal pod autoscaling
   - Implement circuit breakers (Resilience4j)

### Docker Compose Production

Update `docker-compose.yml` for production:
```yaml
services:
  product-service:
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: ${DB_URL}
      SPRING_DATASOURCE_USERNAME: ${DB_USER}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
```

### Kubernetes Deployment

Example deployment manifests available in `k8s/` directory (if applicable).

## Development

### Local Development Setup

1. **Start infrastructure services**
   ```bash
   docker-compose up -d keycloak postgres-product postgres-order
   ```

2. **Run services locally**
   ```bash
   # Product Service
   cd product-service
   mvn spring-boot:run

   # Order Service
   cd order-service
   mvn spring-boot:run

   # API Gateway
   cd api-gateway
   mvn spring-boot:run
   ```

3. **Run frontend**
   ```bash
   cd frontend-react
   npm install
   npm run dev
   ```

### Project Structure

```
.
├── api-gateway/              # API Gateway service
├── product-service/          # Product management service
├── order-service/            # Order processing service
├── frontend-react/           # React frontend application
├── infra/                    # Infrastructure configuration
│   └── keycloak/            # Keycloak realm configuration
├── scripts/                  # Utility scripts
│   ├── trivy-scan.ps1       # Security scanning (Windows)
│   ├── trivy-scan.sh        # Security scanning (Linux/Mac)
│   ├── security-scan.ps1    # Dependency check (Windows)
│   └── security-scan.sh     # Dependency check (Linux/Mac)
├── security-reports/         # Security scan results
├── docker-compose.yml        # Main orchestration file
├── docker-compose.devsecops.yml  # DevSecOps tools (SonarQube)
└── README.md                 # This file
```

### Adding a New Service

1. Create service directory with Spring Boot structure
2. Add database configuration to `docker-compose.yml`
3. Configure security (OAuth2 Resource Server)
4. Add routes to API Gateway
5. Update documentation

### Code Style

- **Java**: Follow Google Java Style Guide
- **TypeScript/React**: Use ESLint and Prettier
- **Formatting**: Use IDE formatters (IntelliJ, VS Code)

## Troubleshooting

### Common Issues

**Issue: Services not starting**
```bash
# Check logs
docker-compose logs [service-name]

# Restart specific service
docker-compose restart [service-name]
```

**Issue: Database connection errors**
```bash
# Check database health
docker-compose ps

# Verify connection
docker exec -it [postgres-container] psql -U [user] -d [database]
```

**Issue: Authentication failures**
- Verify Keycloak is running: http://localhost:8080
- Check realm configuration
- Ensure correct client credentials
- Verify token expiration

**Issue: CORS errors**
- Check API Gateway CORS configuration
- Verify allowed origins include frontend URL
- Check browser console for specific errors

**Issue: Port conflicts**
```bash
# Check port usage
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Linux/Mac

# Stop conflicting process or change port in docker-compose.yml
```

### Logs and Debugging

**View all logs:**
```bash
docker-compose logs -f
```

**View specific service logs:**
```bash
docker-compose logs -f product-service
```

**Enable debug logging:**
```yaml
# In docker-compose.yml
environment:
  LOGGING_LEVEL_ROOT: DEBUG
```

### Health Checks

Check service health:
- Product Service: http://localhost:8081/actuator/health
- Order Service: http://localhost:8082/actuator/health
- API Gateway: http://localhost:9090/actuator/health

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write unit tests for new features
- Update documentation
- Follow code style guidelines
- Run security scans before submitting PR
- Ensure all tests pass

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Additional Documentation

- [Security Guide](SECURITY.md) - Comprehensive security documentation
- [Testing Guide](TESTING.md) - Manual and automated testing procedures
- [Admin Guide](ADMIN-GUIDE.md) - Administrator interface documentation
- [DevSecOps Guide](DEVSECOPS-WINDOWS.md) - Security scanning on Windows
- [Order Enhancements](ORDER-ENHANCEMENTS.md) - Recent feature additions
- [Verification Guide](VERIFICATION.md) - System verification procedures

## Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Contact the development team
- Review existing documentation

## Acknowledgments

- Spring Boot team for excellent framework
- Keycloak team for robust authentication
- React team for modern frontend library
- Open source community for tools and libraries
