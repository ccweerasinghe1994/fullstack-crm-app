# API Changelog

## Express 5.1.0 Migration

### Breaking Changes from Express 4 to 5

Express 5 includes several breaking changes. Here's what to be aware of:

1. **Promise Rejection Handling**
   - Express 5 automatically handles rejected promises in route handlers
   - No need for `.catch()` or `try/catch` with async/await in route handlers

2. **`app.router` Removed**
   - The `app.router` property has been removed

3. **`req.host` Changes**
   - Now returns hostname with port if present
   - Use `req.hostname` to get hostname without port

4. **`res.send()` Changes**
   - Stricter type checking
   - More consistent behavior across different data types

5. **Path Route Matching**
   - Improved and more consistent path-to-regexp matching
   - Some edge cases may behave differently

### New Features in Express 5

1. **Better Promise Support**
   - Automatic error handling for async route handlers
   - No need for `express-async-errors` or similar packages

2. **Improved Performance**
   - Faster routing
   - Better memory management

3. **Enhanced Security**
   - Security improvements and updates
   - Better handling of edge cases

### Migration Checklist

- [x] Update package.json to Express 5.1.0
- [x] Update @types/express to 5.0.0
- [ ] Test all route handlers (especially async ones)
- [ ] Review any custom error handling
- [ ] Check for deprecated middleware usage
- [ ] Test with existing CORS configuration

### Resources

- [Express 5 Migration Guide](https://expressjs.com/en/guide/migrating-5.html)
- [Express 5 Changelog](https://github.com/expressjs/express/blob/5.0/History.md)

