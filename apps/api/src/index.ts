import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { CustomerController } from "./controllers/customerController";
import { PrismaClient } from "./generated/prisma";
import { RegisterRoutes } from "./generated/routes";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { CustomerRepository } from "./repositories/customer.repository";
import { CustomerService } from "./services/customer.service";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Initialize Prisma Client
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// Initialize layers (Dependency Injection)
const customerRepository = new CustomerRepository(prisma);
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "connected",
  });
});

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

// Serve swagger.json
app.get("/swagger.json", (_req: Request, res: Response) => {
  res.sendFile(`${__dirname}/generated/swagger.json`);
});

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "CRM API Server",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      health: "/health",
      customers: "/api/customers",
      swagger: "/swagger.json",
    },
  });
});

// Register TSOA routes
RegisterRoutes(app);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

export { app, prisma, server };
export default app;
