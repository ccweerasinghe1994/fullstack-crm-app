import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";

export interface ApiError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: ApiError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error with context
  logger.error("API Error", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    statusCode: (err as ApiError).statusCode || 500,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Validation Error",
      details: err.issues.map((e) => ({
        field: String(e.path.join(".")),
        message: e.message,
      })),
    });
    return;
  }

  // Handle Prisma errors
  if (err.message.includes("Unique constraint")) {
    res.status(409).json({
      success: false,
      error: "Conflict",
      message: "A record with this information already exists",
    });
    return;
  }

  if (err.message.includes("not found")) {
    res.status(404).json({
      success: false,
      error: "Not Found",
      message: err.message,
    });
    return;
  }

  if (err.message.includes("already exists")) {
    res.status(409).json({
      success: false,
      error: "Conflict",
      message: err.message,
    });
    return;
  }

  // Handle custom status codes
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? "Internal Server Error" : "Error",
    message: statusCode === 500 ? "An unexpected error occurred" : message,
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "The requested resource was not found",
  });
}
