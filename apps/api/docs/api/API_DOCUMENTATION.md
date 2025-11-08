# Customer API Documentation

Base URL: `http://localhost:3000`

All customer endpoints are prefixed with `/api`

## Endpoints

### 1. Get All Customers

**GET** `/api/customers`

Returns a list of all customers.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+1-555-0101",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "createdAt": "2024-11-08T09:42:48.000Z",
      "updatedAt": "2024-11-08T09:42:48.000Z"
    }
  ],
  "count": 5
}
```

### 2. Get Customer by ID

**GET** `/api/customers/:id`

Returns a single customer by ID.

**Parameters:**
- `id` (path) - Customer UUID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1-555-0101",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "createdAt": "2024-11-08T09:42:48.000Z",
    "updatedAt": "2024-11-08T09:42:48.000Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Customer with id {id} not found"
}
```

### 3. Create Customer

**POST** `/api/customers`

Creates a new customer.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phoneNumber": "+1-555-0102",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "country": "USA"
}
```

**Required Fields:**
- `firstName` (string)
- `lastName` (string)
- `email` (string, must be valid email, unique)

**Optional Fields:**
- `phoneNumber` (string | null)
- `address` (string | null)
- `city` (string | null)
- `state` (string | null)
- `country` (string | null)

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "+1-555-0102",
    "address": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "country": "USA",
    "createdAt": "2024-11-08T09:42:48.000Z",
    "updatedAt": "2024-11-08T09:42:48.000Z"
  },
  "message": "Customer created successfully"
}
```

**Error Response:** `400 Bad Request` (Validation Error)
```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**Error Response:** `409 Conflict` (Duplicate Email)
```json
{
  "success": false,
  "error": "Conflict",
  "message": "Customer with email jane.smith@example.com already exists"
}
```

### 4. Update Customer

**PUT** `/api/customers/:id`

Updates an existing customer.

**Parameters:**
- `id` (path) - Customer UUID

**Request Body:** (all fields optional)
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumber": "+1-555-9999"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.smith@example.com",
    "phoneNumber": "+1-555-9999",
    "address": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "country": "USA",
    "createdAt": "2024-11-08T09:42:48.000Z",
    "updatedAt": "2024-11-08T10:30:00.000Z"
  },
  "message": "Customer updated successfully"
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Customer with id {id} not found"
}
```

### 5. Delete Customer

**DELETE** `/api/customers/:id`

Deletes a customer by ID.

**Parameters:**
- `id` (path) - Customer UUID

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Customer with id {id} not found"
}
```

### 6. Get Customer Count

**GET** `/api/customers/count`

Returns the total number of customers.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

## General Endpoints

### Health Check

**GET** `/health`

Check if the API is running and database is connected.

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2024-11-08T10:00:00.000Z",
  "database": "connected"
}
```

### API Info

**GET** `/`

Get API information and available endpoints.

**Response:** `200 OK`
```json
{
  "message": "CRM API Server",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "customers": "/api/customers"
  }
}
```

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": "Not Found",
  "message": "The requested resource was not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Testing with cURL

### Get all customers
```bash
curl http://localhost:3000/api/customers
```

### Get customer by ID
```bash
curl http://localhost:3000/api/customers/{id}
```

### Create customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com"
  }'
```

### Update customer
```bash
curl -X PUT http://localhost:3000/api/customers/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated"
  }'
```

### Delete customer
```bash
curl -X DELETE http://localhost:3000/api/customers/{id}
```

### Get customer count
```bash
curl http://localhost:3000/api/customers/count
```

## Architecture

The API follows a layered architecture:

1. **Controllers** (`src/controllers/`) - Handle HTTP requests/responses
2. **Services** (`src/services/`) - Business logic and validation
3. **Repositories** (`src/repositories/`) - Data access layer (Prisma)
4. **Routes** (`src/routes/`) - Define API endpoints
5. **Middleware** (`src/middleware/`) - Error handling, logging, etc.

### Dependency Injection

All layers use dependency injection for better testability:

```typescript
// Initialize layers
const customerRepository = new CustomerRepository(prisma);
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);
```

## Validation

All input is validated using Zod schemas from `@crm/shared`:

- `createCustomerSchema` - For creating new customers
- `updateCustomerSchema` - For updating existing customers

Validation errors return detailed information about which fields failed validation.

## Database

- **PostgreSQL 18** via Docker
- **Prisma ORM** for type-safe database access
- **Repository Pattern** for data access abstraction

## Next Steps

- [ ] Add pagination to GET /api/customers
- [ ] Add filtering and sorting
- [ ] Add API authentication
- [ ] Add rate limiting
- [ ] Add API versioning
- [ ] Add request logging

---

**Last Updated**: November 8, 2024

