# Technical Test: Full-Stack CRM Application with AI-Assisted Development

---

## Objective

You are tasked with building a thin, full-stack CRM application using Node.js/TypeScript and a modern frontend framework. The goal is to create a working prototype that supports full CRUD (Create, Read, Update, Delete) operations for customer accounts. **You must record your screen and narrate us through the usage of AI tools as you work through the test.**

The test is designed to evaluate how quickly and effectively you can build a functional application using advanced AI productivity tools like Cursor or Claude Code. You are expected to record your coding session using AI tools so we can assess your development process, prompt engineering skills, and ability to leverage AI-powered workflows.

## Use Case

We are building a new Customer Relationship Management (CRM) system for managing customer accounts. The system needs to:

* Display a list of all customer accounts
* Allow the creation of new customer accounts
* Enable updating existing customer accounts
* Support the deletion of customer accounts
* Store customer data in a PostgreSQL database

The system should follow clean architecture principles with clear separation of concerns between data access, business logic, and presentation layers.

## Functional Requirements

You need to implement the following CRUD operations:

* Create a new customer account
* Read customer account details (list and individual)
* Update customer account details
* Delete a customer account

## Data Model

Each customer account should have the following 10 fields:

1.  **Account ID** - Auto-generated primary key (UUID or serial)
2.  **First Name** - String (Required)
3.  **Last Name** - String (Required)
4.  **Email** - String (Required, unique)
5.  **Phone Number** - String (Optional)
6.  **Address** - String (Optional)
7.  **City** - String (Optional)
8.  **State** - String (Optional)
9.  **Country** - String (Optional)
10. **Date Created** - Timestamp (Auto-generated)

## Technical Requirements

### Backend

* Use **Node.js with TypeScript** for backend development
* Use **PostgreSQL** for data persistence
* Implement a **Repository pattern** for data access layer
* Create a **Service layer** for business logic and validation
* Use dependency injection or a modular architecture
* Implement proper error handling and validation middleware
* Use environment variables for configuration (.env file)

### Frontend

* Use **React
* Create a responsive single-page interface that supports:
    * Display all customer accounts in a table or card layout
    * "Add New Account" functionality
    * Edit/Update functionality (modal or inline)
    * Delete with confirmation
    * Form validation for required fields
    * Loading states and error handling

### Database

* Use **PostgreSQL** to store customer data
* Implement database migrations (using Prisma)
* Include proper indexes on frequently queried fields (e.g., email)
* Use connection pooling for efficient database access

### Testing

* Write **unit tests** using **Vitest** for:
    * Service layer business logic
    * Repository layer data operations
    * API endpoint handlers
* Implement **end-to-end tests** using **Playwright** for:
    * Complete CRUD workflows
    * Form validation scenarios
    * Error handling paths
* Aim for meaningful test coverage (not 100%, but critical paths)

### AI Usage Guidelines

> **This is a core evaluation criterion - demonstrate advanced AI tool usage:**
>
1.  **You must use Cursor AI coding assistants during development**

2.  **Record your screen** while developing, showing:
     * How you craft prompts to generate code
     * How you iterate and refine AI suggestions
     * How you use AI for debugging and problem-solving
     * Any automation workflows you create (e.g., using AI to generate tests, migrations, or boilerplate)

3.  **Demonstrate prompt engineering skills:**
     * Show how you provide context to the AI
     * How you break down complex tasks into smaller prompts
     * How you validate and refine AI-generated code

4.  **Advanced AI techniques** (bonus points):
     * Using AI to generate test cases
     * Automated code reviews or refactoring suggestions
     * Using AI to debug errors or optimize performance
     * Creating reusable prompt templates or workflows

## Non-Functional Requirements

* Clean, readable, and well-documented code
* Proper error handling (e.g., duplicate emails, database connection errors, validation failures)
* Type safety throughout (leverage TypeScript)
* RESTful API design principles
* Meaningful commit history with clear commit messages
* Follow best practices for separation of concerns
* Include a README with setup instructions

## Deliverables

Your submission must include:

1.  **Full project code** (GitHub repository or ZIP file)
2.  **Video recording** (15-30 minutes) showing:
    * Your development process with AI tool usage
    * Running the application and demonstrating CRUD operations
    * Running the test suite
    * Brief explanation of architectural decisions
3.  **README.md** with:
    * Setup instructions
    * How to run the application
    * How to run tests
    * Database setup/migration steps
    * Brief explanation of your AI workflow
4.  **Test results** showing passing unit and e2e tests

---

## Evaluation Criteria

**1. AI Tool Usage & Prompt Engineering (40%)**

* Effectiveness of AI tool usage throughout development
* Quality of prompt engineering (clear, specific, iterative)
* Ability to refine and adapt AI-generated code
* Use of advanced AI features (automation, debugging, test generation)
* Balance between AI assistance and demonstrating code understanding
* Narration showing thought process when working with AI

**2. Code Quality & Architecture (25%)**

* Clean, maintainable, and type-safe code
* Proper separation of concerns (repository, service, API layers)



* Following clean architecture principles
* Effective use of TypeScript features
* Code organization and project structure

**3. Functionality & Completeness (20%)**

* All CRUD operations working correctly
* Proper data persistence in PostgreSQL
* Form validation and error handling
* Responsive and intuitive UI
* Database migrations implemented correctly

**4. Testing (10%)**

* Meaningful unit test coverage with Vitest
* Working end-to-end tests with Playwright
* Tests demonstrate understanding of testing best practices
* Tests are maintainable and well-organized

**5. Problem-Solving & Technical Judgment (5%)**

* How quickly and effectively issues were resolved
* Troubleshooting of AI-generated code or errors
* Technical decisions and trade-offs explained
* Use of debugging tools and techniques

## Bonus Points

* Advanced PostgreSQL features (triggers, stored procedures, full-text search)
* API documentation (OpenAPI/Swagger)
* Containerization with Docker
* CI/CD pipeline configuration
* Performance optimizations

* Advanced AI workflows or custom automation

## Time Expectation

---

This test should take **2-4 hours** to complete. We value quality over speed, but the use of AI tools should significantly accelerate your development process.

---

*Good luck! We're excited to see how you leverage AI tools to build this application efficiently.*






















# Tech Stack 

## Frontend (@crm/web)

**Core:**
- React 19.2.0
- TypeScript 5.7.2
- Vite 7.1.7

**Routing & State:**
- TanStack Router 1.132.0 (file-based routing)
- TanStack Query 5.66.5 (data fetching & caching)

**UI & Styling:**
- Tailwind CSS 4.0.6
- shadcn/ui (component library)
- Lucide React (icons)
- class-variance-authority (CVA)
- clsx + tailwind-merge (utilities)

**Forms & Validation:**
- React Hook Form (planned)
- Zod (validation schemas)

**Development Tools:**
- Biome 2.2.4 (linting & formatting)
- Vitest 3.0.5 (unit tests)
- @testing-library/react 16.2.0
- @vitejs/plugin-react

**DevOps:**
- Port: 5173

## Backend (@crm/api)

**Core:**
- Node.js
- Express 5.1.0 (latest)
- TypeScript 5.9.3

**Database:**
- PostgreSQL
- Prisma ORM (latest)

**Validation & Utilities:**
- Zod 4.1.12 (latest)
- dotenv 17.2.3 (latest)
- cors 2.8.5

**Development Tools:**
- ts-node 10.9.2
- ts-node-dev 2.0.0 (hot reload)
- Vitest 4.0.8 (unit tests)
- @types/node 24.10.0
- @types/express 5.0.5
- @types/cors 2.8.19

**Architecture:**
- Repository Pattern
- Service Layer
- Controller Layer
- Dependency Injection

**DevOps:**
- Port: 3000

## Shared Packages

**@crm/shared:**
- Shared TypeScript types
- Zod validation schemas
- Constants and utilities

## Testing

**Unit Tests:**
- Vitest (frontend & backend)
- @testing-library/react (frontend components)
- jsdom (DOM simulation)

**E2E Tests (planned):**
- Playwright (full CRUD workflows)

## Development Tools

**Monorepo:**
- pnpm 10.11.0 (package manager)
- pnpm workspaces

**Type Checking:**
- TypeScript strict mode
- ts-node for development

**Code Quality:**
- Biome (frontend - linting/formatting)
- ESLint (planned for backend)

## Additional Libraries Status

- ✅ React Hook Form (form handling) - ADDED
- ✅ @hookform/resolvers (Zod integration) - ADDED
- ✅ Playwright (E2E testing) - ADDED & CONFIGURED
- ✅ Winston (backend logging) - ADDED & CONFIGURED
- ✅ tsx (TypeScript runtime for Docker) - ADDED
- [ ] helmet (backend security) - OPTIONAL
- [ ] express-validator (backup validation) - NOT NEEDED (using Zod + TSOA)
- [ ] supertest (API testing) - NOT NEEDED (using Vitest)