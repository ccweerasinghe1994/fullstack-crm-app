# Debugging Guide - API

Complete guide for debugging the CRM API application.

## Quick Start

### Method 1: VS Code/Cursor Debugger (Recommended)

1. **Open the project** in VS Code/Cursor
2. **Set breakpoints** by clicking in the gutter (left of line numbers)
3. **Press F5** or go to Run & Debug panel
4. **Select "Debug API"** from the dropdown
5. **Make API requests** and your breakpoints will hit!

### Method 2: Chrome DevTools

```bash
# Start API in debug mode
cd apps/api
pnpm dev:debug

# Open Chrome and navigate to:
chrome://inspect
```

Click "Open dedicated DevTools for Node" and you can debug like a browser!

## Debug Configurations

### Available Configurations (F5 menu)

#### 1. **Debug API** (Main)
- Starts the API server in debug mode
- Automatically attaches debugger
- Hot reload enabled
- **Use this for debugging API endpoints**

#### 2. **Debug API Tests**
- Runs all tests with debugger attached
- Set breakpoints in test files
- **Use this for debugging failing tests**

#### 3. **Debug Current Test File**
- Debugs only the currently open test file
- Faster than running all tests
- **Use this when working on specific tests**

#### 4. **Attach to API (Port 9229)**
- Attaches to already-running process
- Use when API is started with `pnpm dev:debug`
- **Use this for advanced debugging scenarios**

## How to Debug

### Debugging an API Endpoint

**Example: Debug the updateCustomer flow**

1. Open `apps/api/src/services/customer.service.ts`
2. Set a breakpoint on line 61 (inside `updateCustomer`)
   ```typescript
   const { id: _inputId, ...inputWithoutId } = input as any; // ← Click here
   ```
3. Press **F5** and select **"Debug API"**
4. Wait for the server to start (you'll see logs in the terminal)
5. Make a request from your frontend or Postman
6. **Debugger will pause at your breakpoint!** 🎉

**What you can do:**
- Hover over variables to see their values
- Use the Debug Console to evaluate expressions
- Step through code line by line (F10, F11)
- Inspect the call stack
- Watch expressions

### Debugging Tests

1. Open a test file (e.g., `customer.service.test.ts`)
2. Set a breakpoint in the test
3. Press **F5** and select **"Debug API Tests"**
4. Tests will run and pause at your breakpoint

### Debugging with Console Logs

For quick debugging, add console logs:

```typescript
// In customer.service.ts
async updateCustomer(id: string, input: Partial<CreateCustomerInput>): Promise<Customer> {
  console.log('🔍 updateCustomer called with:', { id, input });
  
  const { id: _inputId, ...inputWithoutId } = input as any;
  console.log('📦 Input without ID:', inputWithoutId);
  
  const validatedData = updateCustomerSchema.parse({ id, ...inputWithoutId });
  console.log('✅ Validated data:', validatedData);
  
  // ... rest of code
}
```

**View logs in:**
- Integrated Terminal (when running with `pnpm dev`)
- Debug Console (when debugging with F5)

## Debugging Common Issues

### Issue: Update Customer Failing

**Debug Strategy:**

1. Set breakpoint in `customerController.ts` at the `updateCustomer` method
2. Inspect the incoming `requestBody`
3. Step into the service call (F11)
4. Check what `input` looks like
5. See where the error is thrown

**What to check:**
- Is `id` in the body? (It should be stripped)
- Are empty strings being converted to `null`?
- Is the validation passing?
- Is the repository update working?

### Issue: Validation Error

**Debug Strategy:**

1. Set breakpoint where Zod validation happens
2. Look at the data being validated
3. Check the Debug Console:
   ```javascript
   updateCustomerSchema.parse({ id: "test", firstName: "John" })
   ```

### Issue: Database Error

**Debug Strategy:**

1. Set breakpoint in the repository method
2. Inspect the Prisma query being made
3. Check the data being passed
4. Verify database connection in `.env`

## Debug Console Commands

While paused at a breakpoint, try these in the Debug Console:

```javascript
// Check variable values
input
validatedData
cleanUpdateData

// Test Zod validation
updateCustomerSchema.parse({ id: "test", email: "test@test.com" })

// Inspect objects
JSON.stringify(input, null, 2)

// Call functions
await this.customerRepository.findById(id)
```

## Keyboard Shortcuts

- **F5**: Start/Continue Debugging
- **F9**: Toggle Breakpoint
- **F10**: Step Over (next line)
- **F11**: Step Into (enter function)
- **Shift+F11**: Step Out (exit function)
- **Ctrl+Shift+F5**: Restart Debugger
- **Shift+F5**: Stop Debugging

## Advanced Debugging

### Conditional Breakpoints

Right-click on a breakpoint → "Edit Breakpoint" → Add condition:

```javascript
email === "test@example.com"
id === "921778cb-b938-412c-a55e-e17daa689829"
input.firstName === "ada"
```

The breakpoint will only trigger when the condition is true!

### Logpoints

Right-click in gutter → "Add Logpoint":

```javascript
Input: {input}, ID: {id}
```

Logs to console without stopping execution (like `console.log` but temporary)

### Watch Expressions

In the Debug panel, add expressions to watch:

```javascript
input.email
validatedData
cleanUpdateData.firstName
```

These update in real-time as you step through code!

## Debugging External Tools

### Postman/Thunder Client

Use these to make test requests while debugging:

**Update Customer Request:**
```http
PUT http://localhost:3000/api/customers/921778cb-b938-412c-a55e-e17daa689829
Content-Type: application/json

{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com"
}
```

### cURL Command

```bash
curl -X PUT http://localhost:3000/api/customers/YOUR_ID \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ada",
    "email": "ada@example.com"
  }'
```

## Tips & Tricks

### 1. Debug Both Frontend and Backend

You can debug both at the same time:
1. Start API debugger (F5 → "Debug API")
2. Start frontend in another terminal (`pnpm dev:web`)
3. Set breakpoints in both
4. Trace a request from frontend through to backend!

### 2. Use Source Maps

TypeScript source maps are enabled, so you debug the `.ts` files directly (not compiled `.js`)

### 3. Skip node_modules

The config already skips `node_modules` to avoid stepping into dependencies.

### 4. Restart on File Changes

When debugging, the server will auto-restart when you save files (ts-node-dev).

### 5. Debug Production Build

To debug the compiled JavaScript:

```bash
pnpm build
node --inspect dist/index.js
```

Then use "Attach to API" configuration.

## Troubleshooting

### Breakpoints Not Hitting

1. ✅ Make sure you're using the correct debug configuration
2. ✅ Verify source maps are enabled in `tsconfig.json`
3. ✅ Check that the file is actually being executed
4. ✅ Restart the debugger

### Can't Attach Debugger

1. ✅ Check if port 9229 is available
2. ✅ Try closing and reopening VS Code/Cursor
3. ✅ Kill any hanging Node processes

### Variables Show as "undefined"

1. ✅ Make sure you're not in an async callback that hasn't executed yet
2. ✅ Check the call stack - you might be in a different scope
3. ✅ Use the Debug Console to manually inspect

## Resources

- [VS Code Node.js Debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)
- [Chrome DevTools for Node.js](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [TypeScript Debugging](https://code.visualstudio.com/docs/typescript/typescript-debugging)

---

**Happy Debugging! 🐛🔍**

