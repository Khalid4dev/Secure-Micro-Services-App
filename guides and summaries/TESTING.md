# Testing Guide - Product Management

This guide will help you test the complete product management functionality (Create, Read, Update, Delete) for admin users.

## Prerequisites

Make sure all services are running:

```bash
# Start all services with Docker Compose
docker-compose up -d

# Check if all services are healthy
docker-compose ps
```

You should see all services in "healthy" or "running" state:
- `keycloak` (port 8080)
- `api-gateway` (port 9090)
- `product-service`
- `order-service`
- `frontend` (port 3000)
- PostgreSQL databases

---

## Option 1: Testing via Frontend (Recommended)

### Step 1: Access the Application
1. Open your browser and go to: **http://localhost:3000**

### Step 2: Login as Admin
Use the admin credentials:
- **Username**: `admin`
- **Password**: `admin123` (or whatever password was set in your Keycloak realm)

### Step 3: Navigate to Admin Products Page
- After login, navigate to the **Manage Products** or **Admin Products** page
- You should see a form at the top and a table below showing all products

### Step 4: Test CREATE
1. Fill in the form:
   - **Name**: `Test Laptop`
   - **Description**: `High-performance laptop`
   - **Price**: `999.99`
   - **Stock**: `50`
2. Click **"Create Product"**
3. ✅ You should see an alert: "Product created successfully!"
4. ✅ The new product should appear in the table below

### Step 5: Test UPDATE
1. Find the product you just created in the table
2. Click the **"Edit"** button (green button)
3. ✅ The form should populate with the product's current data
4. ✅ The form title should change to "Edit Product"
5. Modify some fields (e.g., change price to `899.99`)
6. Click **"Update Product"**
7. ✅ You should see an alert: "Product updated successfully!"
8. ✅ The table should refresh with the updated values

### Step 6: Test DELETE
1. Find a product in the table
2. Click the **"Delete"** button (red button)
3. ✅ A confirmation dialog should appear
4. Click **"OK"** to confirm
5. ✅ You should see an alert: "Product deleted successfully!"
6. ✅ The product should disappear from the table

### Step 7: Test Permissions (Optional)
1. Logout from admin account
2. Login as a regular user (CLIENT role)
3. Try to access the Admin Products page
4. ✅ You should be denied access or redirected

---

## Option 2: Testing via API (Using cURL or Postman)

### Step 1: Get an Access Token

First, obtain a JWT token from Keycloak:

```bash
# For Admin user
curl -X POST "http://localhost:8080/realms/microshop/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=microshop-client" \
  -d "grant_type=password" \
  -d "username=admin" \
  -d "password=admin123"
```

Copy the `access_token` from the response. You'll use it in the next requests.

### Step 2: Test CREATE Product

```bash
curl -X POST "http://localhost:9090/api/products" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Mouse",
    "description": "RGB Gaming Mouse with 16000 DPI",
    "price": 79.99,
    "stockQuantity": 100
  }'
```

✅ Expected Response (201 Created):
```json
{
  "id": 1,
  "name": "Gaming Mouse",
  "description": "RGB Gaming Mouse with 16000 DPI",
  "price": 79.99,
  "stockQuantity": 100
}
```

### Step 3: Test READ All Products

```bash
curl -X GET "http://localhost:9090/api/products" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

✅ Expected Response (200 OK):
```json
[
  {
    "id": 1,
    "name": "Gaming Mouse",
    "description": "RGB Gaming Mouse with 16000 DPI",
    "price": 79.99,
    "stockQuantity": 100
  }
]
```

### Step 4: Test READ Single Product

```bash
curl -X GET "http://localhost:9090/api/products/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

✅ Expected Response (200 OK): Same as above

### Step 5: Test UPDATE Product

```bash
curl -X PUT "http://localhost:9090/api/products/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Mouse Pro",
    "description": "RGB Gaming Mouse with 16000 DPI - Updated",
    "price": 69.99,
    "stockQuantity": 150
  }'
```

✅ Expected Response (200 OK):
```json
{
  "id": 1,
  "name": "Gaming Mouse Pro",
  "description": "RGB Gaming Mouse with 16000 DPI - Updated",
  "price": 69.99,
  "stockQuantity": 150
}
```

### Step 6: Test DELETE Product

```bash
curl -X DELETE "http://localhost:9090/api/products/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

✅ Expected Response (204 No Content): Empty response

### Step 7: Test Authorization (CLIENT role)

Get a token for a CLIENT user:

```bash
curl -X POST "http://localhost:8080/realms/microshop/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=microshop-client" \
  -d "grant_type=password" \
  -d "username=client" \
  -d "password=client123"
```

Try to create a product with CLIENT token:

```bash
curl -X POST "http://localhost:9090/api/products" \
  -H "Authorization: Bearer CLIENT_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "description": "Test",
    "price": 10,
    "stockQuantity": 1
  }'
```

✅ Expected Response (403 Forbidden):
```json
{
  "error": "Forbidden",
  "message": "Access Denied"
}
```

---

## Option 3: Testing via Browser DevTools

1. Open **http://localhost:3000** and login as admin
2. Open **Browser DevTools** (F12)
3. Go to the **Network** tab
4. Navigate to the Admin Products page
5. Perform actions (create, edit, delete)
6. Watch the network requests:
   - ✅ `POST /api/products` - Create
   - ✅ `GET /api/products` - List all
   - ✅ `PUT /api/products/{id}` - Update
   - ✅ `DELETE /api/products/{id}` - Delete

---

## Troubleshooting

### Issue: "Failed to load products"
- Check if product-service is running: `docker-compose ps product-service`
- Check logs: `docker-compose logs product-service`
- Verify database connection

### Issue: "401 Unauthorized"
- Your token might be expired (tokens expire after 5-15 minutes)
- Get a new token from Keycloak
- Make sure you're logged in

### Issue: "403 Forbidden"
- You're not logged in as an ADMIN user
- Check your user's role in Keycloak: http://localhost:8080
- Login to Keycloak admin console (admin/admin)
- Go to Users → Select user → Role Mappings

### Issue: Frontend not loading
- Check if frontend is running: `docker-compose ps frontend`
- Clear browser cache
- Check console for errors (F12)

---

## Quick Test Script

Save this as `test-products.sh` for quick API testing:

```bash
#!/bin/bash

# Get admin token
echo "Getting admin token..."
TOKEN_RESPONSE=$(curl -s -X POST "http://localhost:8080/realms/microshop/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=microshop-client" \
  -d "grant_type=password" \
  -d "username=admin" \
  -d "password=admin123")

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "Token obtained!"
echo ""

# Create product
echo "Creating product..."
curl -X POST "http://localhost:9090/api/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "This is a test",
    "price": 99.99,
    "stockQuantity": 50
  }'
echo ""
echo ""

# List products
echo "Listing all products..."
curl -X GET "http://localhost:9090/api/products" \
  -H "Authorization: Bearer $TOKEN"
echo ""
```

Make it executable and run:
```bash
chmod +x test-products.sh
./test-products.sh
```

---

## Success Criteria

✅ Admin can create new products  
✅ Admin can view all products in a table  
✅ Admin can edit existing products  
✅ Admin can delete products  
✅ Regular users (CLIENT role) cannot create/edit/delete products  
✅ All operations show appropriate success/error messages  
✅ Table refreshes automatically after operations  

---

**Happy Testing! 🚀**
