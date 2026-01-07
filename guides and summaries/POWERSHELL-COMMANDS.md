# PowerShell Commands for Testing Product Management

## Get Admin Token (Single Line)
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/realms/microshop/protocol/openid-connect/token" -Method Post -Body @{client_id="gateway-client"; client_secret="gateway-client-secret"; grant_type="password"; username="admin"; password="admin123"} -ContentType "application/x-www-form-urlencoded"
$token = $response.access_token
Write-Host "Token obtained: $($token.Substring(0, 50))..."
```

## Create Product
```powershell
$headers = @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"}
$body = '{"name":"Test Laptop","description":"High-performance laptop","price":999.99,"stockQuantity":50}'
Invoke-RestMethod -Uri "http://localhost:9090/api/products" -Method Post -Headers $headers -Body $body
```

## Get All Products
```powershell
Invoke-RestMethod -Uri "http://localhost:9090/api/products" -Method Get -Headers $headers
```

## Get Single Product (replace {id} with actual ID)
```powershell
Invoke-RestMethod -Uri "http://localhost:9090/api/products/1" -Method Get -Headers $headers
```

## Update Product (replace {id} with actual ID)
```powershell
$body = '{"name":"Updated Laptop","description":"Updated description","price":899.99,"stockQuantity":75}'
Invoke-RestMethod -Uri "http://localhost:9090/api/products/1" -Method Put -Headers $headers -Body $body
```

## Delete Product (replace {id} with actual ID)
```powershell
Invoke-RestMethod -Uri "http://localhost:9090/api/products/1" -Method Delete -Headers $headers
```

## Using curl.exe (if you prefer curl syntax)
```powershell
# Get Token
curl.exe -X POST "http://localhost:8080/realms/microshop/protocol/openid-connect/token" -H "Content-Type: application/x-www-form-urlencoded" -d "client_id=gateway-client&client_secret=gateway-client-secret&grant_type=password&username=admin&password=admin123"

# Create Product (set $TOKEN variable first)
curl.exe -X POST "http://localhost:9090/api/products" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{\"name\":\"Test Product\",\"description\":\"Test\",\"price\":99.99,\"stockQuantity\":10}'

# Get All Products
curl.exe -X GET "http://localhost:9090/api/products" -H "Authorization: Bearer $TOKEN"

# Update Product
curl.exe -X PUT "http://localhost:9090/api/products/1" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{\"name\":\"Updated\",\"description\":\"Updated\",\"price\":79.99,\"stockQuantity\":20}'

# Delete Product
curl.exe -X DELETE "http://localhost:9090/api/products/1" -H "Authorization: Bearer $TOKEN"
```

## Test with CLIENT Role (Should Fail for Create/Update/Delete)
```powershell
$clientResponse = Invoke-RestMethod -Uri "http://localhost:8080/realms/microshop/protocol/openid-connect/token" -Method Post -Body @{client_id="gateway-client"; client_secret="gateway-client-secret"; grant_type="password"; username="client"; password="client123"} -ContentType "application/x-www-form-urlencoded"
$clientToken = $clientResponse.access_token

# This should return 403 Forbidden
$clientHeaders = @{"Authorization" = "Bearer $clientToken"; "Content-Type" = "application/json"}
$body = '{"name":"Test","description":"Test","price":10,"stockQuantity":1}'
Invoke-RestMethod -Uri "http://localhost:9090/api/products" -Method Post -Headers $clientHeaders -Body $body
```
