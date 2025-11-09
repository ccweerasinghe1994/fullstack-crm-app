# Logging Guide

Comprehensive guide to logging in the CRM API using Winston.

## Overview

The API uses [Winston](https://github.com/winstonjs/winston) for structured logging with multiple transports and configurable log levels.

## Log Levels

Logs are prioritized from highest to lowest:

| Level     | Priority | Usage                                | Example                                        |
| --------- | -------- | ------------------------------------ | ---------------------------------------------- |
| **error** | 0        | Errors requiring immediate attention | `logger.error('Database connection failed')`   |
| **warn**  | 1        | Warning messages                     | `logger.warn('Rate limit approaching')`        |
| **info**  | 2        | General informational messages       | `logger.info('Customer created')`              |
| **http**  | 3        | HTTP request/response logs           | Automatic via Morgan                           |
| **debug** | 4        | Detailed debug information           | `logger.debug('Query parameters', { params })` |

## Configuration

### Environment Variables

Set the log level in `.env`:

```bash
# apps/api/.env
LOG_LEVEL=debug  # Options: error, warn, info, http, debug
NODE_ENV=development
```

**Recommended levels by environment**:
- **Development**: `debug` (see everything)
- **Staging**: `info` (general operations)
- **Production**: `warn` (warnings and errors only)

### Logger Configuration

Located in `apps/api/src/config/logger.ts`:

```typescript
import { logger } from './config/logger';

logger.error('Critical error');
logger.warn('Warning message');
logger.info('Info message');
logger.http('HTTP log'); // Usually via Morgan
logger.debug('Debug details', { metadata });
```

## Log Transports

### 1. Console Transport
- **Target**: Terminal/stdout
- **Level**: Configured via `LOG_LEVEL`
- **Format**: Colorized, human-readable
- **Always enabled**: Yes

```
11:30:45 [info]: Customer created successfully: john@example.com {"customerId":"123"}
11:30:46 [error]: API Error {"statusCode":404,"url":"/api/customers/999"}
```

### 2. Combined Log Files
- **Location**: `apps/api/logs/combined-YYYY-MM-DD.log`
- **Level**: `debug` (all logs)
- **Format**: JSON
- **Rotation**: Daily
- **Retention**: 14 days
- **Max size**: 20MB per file

### 3. Error Log Files
- **Location**: `apps/api/logs/error-YYYY-MM-DD.log`
- **Level**: `error` only
- **Format**: JSON
- **Rotation**: Daily
- **Retention**: 30 days
- **Max size**: 20MB per file

### 4. HTTP Log Files
- **Location**: `apps/api/logs/http-YYYY-MM-DD.log`
- **Level**: `http` only
- **Format**: JSON
- **Rotation**: Daily
- **Retention**: 7 days
- **Max size**: 20MB per file

## Usage Examples

### Basic Logging

```typescript
import { logger } from '../config/logger';

// Error with stack trace
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', {
    error: error.message,
    stack: error.stack
  });
}

// Warning
logger.warn('Deprecated API endpoint used', { endpoint: '/old/route' });

// Info
logger.info('Customer created successfully', { 
  customerId: customer.id,
  email: customer.email 
});

// Debug
logger.debug('Query executed', { 
  query: 'SELECT * FROM customers',
  duration: '45ms'
});
```

### Service Layer Logging

```typescript
// apps/api/src/services/customer.service.ts

async createCustomer(input: CreateCustomerInput): Promise<Customer> {
  logger.debug("Creating new customer", { email: input.email });
  
  // ... business logic ...
  
  const customer = await this.customerRepository.create(data);
  
  logger.info(`Customer created successfully: ${customer.email}`, {
    customerId: customer.id,
  });
  
  return customer;
}
```

### HTTP Request Logging

Automatic via Morgan middleware:

```typescript
// apps/api/src/index.ts
import { httpLogger } from './middleware/httpLogger';

app.use(httpLogger);
```

**Example output**:
```
GET /api/customers 200 1234 - 45.123 ms
POST /api/customers 201 567 - 123.456 ms
```

### Error Handler Logging

Automatic logging in error handler:

```typescript
// apps/api/src/middleware/error-handler.ts
logger.error("API Error", {
  error: err.message,
  stack: err.stack,
  method: req.method,
  url: req.url,
  statusCode: statusCode,
});
```

## Log File Structure

### JSON Format Example

```json
{
  "level": "info",
  "message": "Customer created successfully: john@example.com",
  "customerId": "123e4567-e89b-12d3-a456-426614174000",
  "service": "crm-api",
  "timestamp": "2025-11-09 11:30:45"
}
```

### Error Log Example

```json
{
  "level": "error",
  "message": "API Error",
  "error": "Customer with id 999 not found",
  "stack": "Error: Customer with id 999 not found\n    at CustomerService.getCustomerById...",
  "method": "GET",
  "url": "/api/customers/999",
  "statusCode": 404,
  "service": "crm-api",
  "timestamp": "2025-11-09 11:31:10"
}
```

## Log Rotation

Logs are automatically rotated daily using `winston-daily-rotate-file`:

- **Pattern**: `combined-YYYY-MM-DD.log`
- **When**: Daily at midnight
- **Auto-cleanup**: Old logs deleted after retention period
- **Compression**: Not enabled (can be added)

## Best Practices

### ✅ Do's

1. **Use appropriate log levels**
   ```typescript
   logger.error('Database connection failed');  // ✅ Critical
   logger.warn('API rate limit reached');       // ✅ Warning
   logger.info('User logged in');               // ✅ Important event
   logger.debug('Cache hit', { key });          // ✅ Debug details
   ```

2. **Include context with metadata**
   ```typescript
   logger.info('Customer updated', {
     customerId: id,
     fields: Object.keys(updates),
     userId: req.user?.id
   });
   ```

3. **Log errors with stack traces**
   ```typescript
   catch (error) {
     logger.error('Operation failed', {
       error: error.message,
       stack: error.stack
     });
   }
   ```

4. **Use structured logging (JSON)**
   ```typescript
   logger.info('Payment processed', {
     orderId: '123',
     amount: 99.99,
     currency: 'USD'
   });
   ```

### ❌ Don'ts

1. **Don't log sensitive data**
   ```typescript
   logger.info('Login', { password: '...' });  // ❌ NEVER!
   logger.info('Login', { email: 'user@...' }); // ✅ OK
   ```

2. **Don't use console.log**
   ```typescript
   console.log('Customer created');  // ❌ Use logger instead
   logger.info('Customer created');  // ✅ Proper logging
   ```

3. **Don't over-log in loops**
   ```typescript
   customers.forEach(c => {
     logger.debug('Processing', { c }); // ❌ Too verbose
   });
   
   logger.debug(`Processing ${customers.length} customers`); // ✅ Summary
   ```

4. **Don't log without context**
   ```typescript
   logger.error('Failed');  // ❌ What failed?
   logger.error('Customer creation failed', { 
     email: data.email,
     reason: error.message 
   }); // ✅ Clear context
   ```

## Viewing Logs

### Development (Console)

```bash
pnpm dev:api
```

Colorized output in terminal:
```
11:30:45 [info]: 🚀 Server is running on http://localhost:3000
11:30:46 [http]: GET /api/customers 200 - 45 ms
11:30:47 [debug]: Fetching paginated customers {"params":{"page":1,"limit":10}}
```

### Production (Files)

```bash
# View combined logs
tail -f apps/api/logs/combined-2025-11-09.log

# View errors only
tail -f apps/api/logs/error-2025-11-09.log

# View HTTP requests only
tail -f apps/api/logs/http-2025-11-09.log

# Search for specific customer
grep "john@example.com" apps/api/logs/combined-2025-11-09.log

# Filter by level
grep '"level":"error"' apps/api/logs/combined-2025-11-09.log | jq
```

## Log Analysis

### Using jq (JSON processor)

```bash
# Pretty print logs
cat apps/api/logs/combined-2025-11-09.log | jq

# Filter by level
cat apps/api/logs/combined-2025-11-09.log | jq 'select(.level=="error")'

# Count errors
cat apps/api/logs/combined-2025-11-09.log | jq 'select(.level=="error")' | wc -l

# Group by service
cat apps/api/logs/combined-2025-11-09.log | jq -r '.service' | sort | uniq -c
```

## Monitoring

### Log Aggregation (Future)

Winston supports many transports for centralized logging:

- **Elasticsearch**: `winston-elasticsearch`
- **Cloudwatch**: `winston-aws-cloudwatch`
- **Datadog**: `winston-datadog`
- **Sentry**: `winston-transport-sentry-node`
- **Slack**: `winston-slack-webhook-transport`

Example Elasticsearch integration:

```typescript
import { ElasticsearchTransport } from 'winston-elasticsearch';

transports.push(
  new ElasticsearchTransport({
    level: 'info',
    clientOpts: { node: 'http://localhost:9200' },
    index: 'crm-api-logs'
  })
);
```

## Troubleshooting

### No logs appearing

1. Check `LOG_LEVEL` environment variable
2. Verify `logs/` directory exists (created automatically)
3. Check file permissions

### Too many logs

1. Increase `LOG_LEVEL` to `info` or `warn`
2. Reduce retention period in `logger.ts`
3. Enable log compression

### Logs not rotating

1. Ensure `winston-daily-rotate-file` is installed
2. Check `datePattern` in configuration
3. Verify write permissions on `logs/` directory

## Performance Impact

Winston logging is highly optimized:

- **Async writes**: Non-blocking I/O
- **Minimal overhead**: ~0.1ms per log
- **File rotation**: Automatic, no downtime
- **Buffer management**: Efficient memory usage

**Recommendation**: Use `debug` level in development, `info` in production.

## Security

### Sensitive Data Protection

Never log:
- ❌ Passwords
- ❌ API keys/tokens
- ❌ Credit card numbers
- ❌ Personal identification numbers (SSN, etc.)

Safe to log:
- ✅ Email addresses (non-PII in many jurisdictions)
- ✅ User IDs
- ✅ Timestamps
- ✅ Request paths
- ✅ HTTP status codes

### Log Sanitization

If you must log potentially sensitive data, sanitize it first:

```typescript
const sanitize = (data: any) => {
  const sanitized = { ...data };
  if (sanitized.password) sanitized.password = '[REDACTED]';
  if (sanitized.creditCard) sanitized.creditCard = '[REDACTED]';
  return sanitized;
};

logger.info('User action', sanitize(userData));
```

## Testing

Logs are available during test runs:

```bash
pnpm test:run
```

To see logs during tests, set `LOG_LEVEL=debug` in test environment.

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run API tests
  env:
    LOG_LEVEL: warn  # Reduce noise in CI
    NODE_ENV: test
  run: pnpm test:run
```

### Docker

```dockerfile
# Set log level via environment
ENV LOG_LEVEL=info
```

## Related Documentation

- [Winston Documentation](https://github.com/winstonjs/winston)
- [Morgan HTTP Logger](https://github.com/expressjs/morgan)
- [Error Handler](./ERROR_HANDLING.md)
- [Development Workflow](./DEVELOPMENT_WORKFLOW.md)

---

**Last Updated**: November 9, 2025

