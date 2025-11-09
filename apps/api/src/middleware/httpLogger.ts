import type { Request, Response, RequestHandler } from "express";
import morgan from "morgan";
import { stream } from "../config/logger";

/**
 * HTTP Request/Response Logger Middleware
 * Uses Morgan with Winston stream for unified logging
 */

// Custom Morgan token for response time in milliseconds
morgan.token("response-time-ms", (_req: Request, res: Response) => {
  const responseTime = res.getHeader("X-Response-Time");
  return responseTime ? `${responseTime}ms` : "-";
});

// Custom Morgan token for request ID (if we add it later)
morgan.token("request-id", (req: Request) => {
  return (req as any).id || "-";
});

// Development format - detailed and colorized (via Winston)
const devFormat =
  ":method :url :status :res[content-length] - :response-time ms";

// Production format - JSON compatible
const prodFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Choose format based on environment
const format = process.env.NODE_ENV === "production" ? prodFormat : devFormat;

// Skip logging for health check endpoints (optional)
const skipHealthChecks = (req: Request, _res: Response) => {
  return req.url === "/health" || req.url === "/api/health";
};

// Create Morgan middleware with explicit type annotation
export const httpLogger: RequestHandler = morgan(format, {
  stream,
  skip: skipHealthChecks,
}) as RequestHandler;

export default httpLogger;

