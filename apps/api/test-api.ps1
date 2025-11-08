# Customer API Test Script
# Run this after starting the server with: pnpm dev:api

$baseUrl = "http://localhost:3000"
$apiUrl = "$baseUrl/api/customers"

Write-Host "`n=== Testing Customer API ===" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl`n" -ForegroundColor Yellow

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -UseBasicParsing
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)`n"
} catch {
    Write-Host "   ❌ Error: $_`n" -ForegroundColor Red
}

# Test 2: Get All Customers
Write-Host "2. Testing GET /api/customers..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method GET -UseBasicParsing
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Count: $($data.count) customers`n"
} catch {
    Write-Host "   ❌ Error: $_`n" -ForegroundColor Red
}

# Test 3: Get Customer Count
Write-Host "3. Testing GET /api/customers/count..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/count" -Method GET -UseBasicParsing
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)`n"
} catch {
    Write-Host "   ❌ Error: $_`n" -ForegroundColor Red
}

# Test 4: Create Customer
Write-Host "4. Testing POST /api/customers (Create)..." -ForegroundColor Green
$newCustomer = @{
    firstName = "Test"
    lastName = "User"
    email = "test.user.$(Get-Random)@example.com"
    phoneNumber = "+1-555-TEST"
    city = "Test City"
    country = "Test Country"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $newCustomer -ContentType "application/json" -UseBasicParsing
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    $createdCustomer = ($response.Content | ConvertFrom-Json).data
    $customerId = $createdCustomer.id
    Write-Host "   Created customer ID: $customerId`n"
    
    # Test 5: Get Customer by ID
    Write-Host "5. Testing GET /api/customers/:id..." -ForegroundColor Green
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/$customerId" -Method GET -UseBasicParsing
        Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "   Customer: $($createdCustomer.firstName) $($createdCustomer.lastName)`n"
    } catch {
        Write-Host "   ❌ Error: $_`n" -ForegroundColor Red
    }
    
    # Test 6: Update Customer
    Write-Host "6. Testing PUT /api/customers/:id (Update)..." -ForegroundColor Green
    $updateData = @{
        firstName = "Updated"
        lastName = "Name"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/$customerId" -Method PUT -Body $updateData -ContentType "application/json" -UseBasicParsing
        Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)`n"
    } catch {
        Write-Host "   ❌ Error: $_`n" -ForegroundColor Red
    }
    
    # Test 7: Delete Customer
    Write-Host "7. Testing DELETE /api/customers/:id..." -ForegroundColor Green
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/$customerId" -Method DELETE -UseBasicParsing
        Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)`n"
    } catch {
        Write-Host "   ❌ Error: $_`n" -ForegroundColor Red
    }
    
} catch {
    Write-Host "   ❌ Error creating customer: $_`n" -ForegroundColor Red
}

# Test 8: Validation Error Test
Write-Host "8. Testing Validation (Invalid email)..." -ForegroundColor Green
$invalidCustomer = @{
    firstName = "Invalid"
    lastName = "Test"
    email = "not-an-email"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $invalidCustomer -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "   ✅ Correctly returned 400 Bad Request" -ForegroundColor Green
        Write-Host "   Validation working as expected!`n"
    } else {
        Write-Host "   ❌ Unexpected status code: $($_.Exception.Response.StatusCode)`n" -ForegroundColor Red
    }
}

# Test 9: Duplicate Email Test
Write-Host "9. Testing Duplicate Email Validation..." -ForegroundColor Green
$existingEmail = @{
    firstName = "John"
    lastName = "Doe"
    email = "john.doe@example.com"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $existingEmail -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "   ✅ Correctly returned 409 Conflict" -ForegroundColor Green
        Write-Host "   Duplicate check working!`n"
    } else {
        Write-Host "   ❌ Unexpected status code: $($_.Exception.Response.StatusCode)`n" -ForegroundColor Red
    }
}

Write-Host "`n=== All Tests Complete ===" -ForegroundColor Cyan
Write-Host "Check results above for any failures.`n" -ForegroundColor Yellow

