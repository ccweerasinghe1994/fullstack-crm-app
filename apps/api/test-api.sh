#!/bin/bash
# Customer API Test Script
# Run this after starting the server with: pnpm dev:api

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api/customers"

echo -e "\n\033[1;36m=== Testing Customer API ===\033[0m"
echo -e "\033[1;33mBase URL: $BASE_URL\n\033[0m"

# Test 1: Health Check
echo -e "\033[1;32m1. Testing Health Check...\033[0m"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)
if [ "$status_code" -eq 200 ]; then
    echo -e "   \033[1;32m✅ Status: $status_code\033[0m"
    echo "   Response: $body"
else
    echo -e "   \033[1;31m❌ Error: Status $status_code\033[0m"
fi
echo ""

# Test 2: Get All Customers
echo -e "\033[1;32m2. Testing GET /api/customers...\033[0m"
response=$(curl -s -w "\n%{http_code}" "$API_URL")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)
if [ "$status_code" -eq 200 ]; then
    echo -e "   \033[1;32m✅ Status: $status_code\033[0m"
    count=$(echo "$body" | jq -r '.count')
    echo "   Count: $count customers"
else
    echo -e "   \033[1;31m❌ Error: Status $status_code\033[0m"
fi
echo ""

# Test 3: Get Customer Count
echo -e "\033[1;32m3. Testing GET /api/customers/count...\033[0m"
response=$(curl -s -w "\n%{http_code}" "$API_URL/count")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)
if [ "$status_code" -eq 200 ]; then
    echo -e "   \033[1;32m✅ Status: $status_code\033[0m"
    echo "   Response: $body"
else
    echo -e "   \033[1;31m❌ Error: Status $status_code\033[0m"
fi
echo ""

# Test 4: Create Customer
echo -e "\033[1;32m4. Testing POST /api/customers (Create)...\033[0m"
random_email="test.user.$RANDOM@example.com"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{
        \"firstName\": \"Test\",
        \"lastName\": \"User\",
        \"email\": \"$random_email\",
        \"phoneNumber\": \"+1-555-TEST\",
        \"city\": \"Test City\",
        \"country\": \"Test Country\"
    }")
status_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)
if [ "$status_code" -eq 201 ]; then
    echo -e "   \033[1;32m✅ Status: $status_code\033[0m"
    customer_id=$(echo "$body" | jq -r '.data.id')
    echo "   Created customer ID: $customer_id"
    
    # Test 5: Get Customer by ID
    echo -e "\n\033[1;32m5. Testing GET /api/customers/:id...\033[0m"
    response=$(curl -s -w "\n%{http_code}" "$API_URL/$customer_id")
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    if [ "$status_code" -eq 200 ]; then
        echo -e "   \033[1;32m✅ Status: $status_code\033[0m"
        name=$(echo "$body" | jq -r '.data.firstName + " " + .data.lastName')
        echo "   Customer: $name"
    else
        echo -e "   \033[1;31m❌ Error: Status $status_code\033[0m"
    fi
    
    # Test 6: Update Customer
    echo -e "\n\033[1;32m6. Testing PUT /api/customers/:id (Update)...\033[0m"
    response=$(curl -s -w "\n%{http_code}" -X PUT "$API_URL/$customer_id" \
        -H "Content-Type: application/json" \
        -d '{"firstName": "Updated", "lastName": "Name"}')
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    if [ "$status_code" -eq 200 ]; then
        echo -e "   \033[1;32m✅ Status: $status_code\033[0m"
        echo "   Response: $body"
    else
        echo -e "   \033[1;31m❌ Error: Status $status_code\033[0m"
    fi
    
    # Test 7: Delete Customer
    echo -e "\n\033[1;32m7. Testing DELETE /api/customers/:id...\033[0m"
    response=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/$customer_id")
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    if [ "$status_code" -eq 200 ]; then
        echo -e "   \033[1;32m✅ Status: $status_code\033[0m"
        echo "   Response: $body"
    else
        echo -e "   \033[1;31m❌ Error: Status $status_code\033[0m"
    fi
else
    echo -e "   \033[1;31m❌ Error: Status $status_code\033[0m"
fi
echo ""

# Test 8: Validation Error Test
echo -e "\033[1;32m8. Testing Validation (Invalid email)...\033[0m"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d '{"firstName": "Invalid", "lastName": "Test", "email": "not-an-email"}')
status_code=$(echo "$response" | tail -n1)
if [ "$status_code" -eq 400 ]; then
    echo -e "   \033[1;32m✅ Correctly returned 400 Bad Request\033[0m"
    echo "   Validation working as expected!"
else
    echo -e "   \033[1;31m❌ Unexpected status code: $status_code\033[0m"
fi
echo ""

# Test 9: Duplicate Email Test
echo -e "\033[1;32m9. Testing Duplicate Email Validation...\033[0m"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d '{"firstName": "John", "lastName": "Doe", "email": "john.doe@example.com"}')
status_code=$(echo "$response" | tail -n1)
if [ "$status_code" -eq 409 ]; then
    echo -e "   \033[1;32m✅ Correctly returned 409 Conflict\033[0m"
    echo "   Duplicate check working!"
else
    echo -e "   \033[1;31m❌ Unexpected status code: $status_code\033[0m"
fi
echo ""

echo -e "\n\033[1;36m=== All Tests Complete ===\033[0m"
echo -e "\033[1;33mCheck results above for any failures.\n\033[0m"

