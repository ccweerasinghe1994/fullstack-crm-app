# API Documentation

Welcome to the CRM API documentation! This directory contains comprehensive documentation for the backend application.

## 📁 Directory Structure

```
docs/
├── README.md              # This file
├── setup/                 # Setup & Configuration Guides
│   ├── PRISMA_SETUP.md
│   ├── TSOA_SETUP.md
│   ├── VITEST_SETUP_SUMMARY.md
│   ├── MIGRATION_ZOD_V4.md
│   └── DATABASE_STATUS.md
├── api/                   # API Documentation
│   ├── API_DOCUMENTATION.md
│   └── IMPLEMENTATION_SUMMARY.md
└── guides/                # Development Guides
    ├── DEVELOPMENT_WORKFLOW.md
    ├── TESTING.md
    └── VITEST_QUICKSTART.md
```

## 🚀 Quick Start

1. **First Time Setup**
   - [Prisma Setup Guide](./setup/PRISMA_SETUP.md) - Database ORM configuration
   - [Database Status](./setup/DATABASE_STATUS.md) - Verify database setup
   - [TSOA Setup Guide](./setup/TSOA_SETUP.md) - OpenAPI/Swagger configuration
   - [Vitest Setup Summary](./setup/VITEST_SETUP_SUMMARY.md) - Testing framework setup

2. **Development Workflow**
   - [Development Workflow](./guides/DEVELOPMENT_WORKFLOW.md) - Standard development process
   - [Testing Guide](./guides/TESTING.md) - Comprehensive testing practices
   - [Vitest Quickstart](./guides/VITEST_QUICKSTART.md) - Quick reference for testing

3. **API Reference**
   - [API Documentation](./api/API_DOCUMENTATION.md) - Available endpoints
   - [Implementation Summary](./api/IMPLEMENTATION_SUMMARY.md) - Architecture overview

## 📚 Key Topics

### Setup & Configuration

- **[Prisma Setup](./setup/PRISMA_SETUP.md)**: Database schema, migrations, and ORM setup
- **[TSOA Setup](./setup/TSOA_SETUP.md)**: OpenAPI/Swagger documentation and runtime validation
- **[Vitest Setup](./setup/VITEST_SETUP_SUMMARY.md)**: Unit testing framework configuration
- **[Zod v4 Migration](./setup/MIGRATION_ZOD_V4.md)**: Breaking changes in Zod v4
- **[Database Status](./setup/DATABASE_STATUS.md)**: Current database state and verification

### Development Guides

- **[Development Workflow](./guides/DEVELOPMENT_WORKFLOW.md)**: Complete guide to the development process, including:
  - Standard development cycle
  - Test commands and TDD workflow
  - Best practices and patterns
  - Common issues and solutions
  - Commit checklist

- **[Testing Guide](./guides/TESTING.md)**: Comprehensive testing documentation, including:
  - Testing philosophy and TDD
  - Writing unit tests
  - Mocking strategies
  - Coverage guidelines
  - E2E testing

- **[Vitest Quickstart](./guides/VITEST_QUICKSTART.md)**: Quick reference for:
  - Running tests
  - Writing test assertions
  - Mocking and spying
  - Common patterns

### API Reference

- **[API Documentation](./api/API_DOCUMENTATION.md)**: Complete API endpoint reference
  - Customer CRUD operations
  - Request/response schemas
  - Error handling
  - OpenAPI/Swagger UI

- **[Implementation Summary](./api/IMPLEMENTATION_SUMMARY.md)**: Architecture details
  - Repository pattern
  - Service layer
  - Controller layer
  - Dependency injection

## 🔗 External Documentation

- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI Spec**: http://localhost:3000/swagger.json
- **Main README**: [../../README.md](../../README.md)
- **Project Structure**: [../../../PROJECT_STRUCTURE.md](../../../PROJECT_STRUCTURE.md)

## 📝 Maintenance

This documentation is organized to help you:
- Get started quickly with setup guides
- Follow best practices with development guides
- Understand the API structure and implementation

If you notice any outdated information or have suggestions for improvement, please update the relevant documentation file.

---

**Need help?** Start with the [Development Workflow](./guides/DEVELOPMENT_WORKFLOW.md) guide!

