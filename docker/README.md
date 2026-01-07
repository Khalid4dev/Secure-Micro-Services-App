# Docker Infrastructure Documentation

This directory contains the core infrastructure for the microservices application.

## Services & Ports

| Service | Host Port | Internal Port | Description |
| :--- | :--- | :--- | :--- |
| **Keycloak** | `8080` | `8080` | IAM Authentication Server |
| **Postgres Product** | `5433` | `5432` | Database for `product-service` |
| **Postgres Order** | `5434` | `5432` | Database for `order-service` |
| **Postgres Keycloak** | N/A | `5432` | Internal DB for Keycloak |

## Environment Variables / Credentials

### Keycloak
- **Admin User**: `admin`
- **Admin Password**: `admin`
- **DB Name**: `keycloak`
- **DB User**: `keycloak`
- **DB Password**: `keycloak`

### Postgres Product
- **DB Name**: `productdb`
- **DB User**: `productuser`
- **DB Password**: `productpassword`
- **Local Connection**: `jdbc:postgresql://localhost:5433/productdb`

### Postgres Order
- **DB Name**: `orderdb`
- **DB User**: `orderuser`
- **DB Password**: `orderpassword`
- **Local Connection**: `jdbc:postgresql://localhost:5434/orderdb`

## Health Checks
All services include healthchecks. You can monitor them via:
`docker compose ps`

## Volumes
The following persistent volumes are used:
- `keycloak_data`: Keycloak configuration and realms.
- `keycloak_db_data`: PostgreSQL data for Keycloak.
- `product_db_data`: PostgreSQL data for Product service.
- `order_db_data`: PostgreSQL data for Order service.
