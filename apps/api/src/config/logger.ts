import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

/**
 * Winston Logger Configuration
 * 
 * Log Levels (highest to lowest priority):
 * - error: 0 - Errors that require immediate attention
 * - warn: 1 - Warning messages
 * - info: 2 - General informational messages
 * - http: 3 - HTTP request/response logs
 * - debug: 4 - Detailed debug information
 */

const logDir = path.join(__dirname, "../../logs");

// Custom log format with timestamp
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }), // Include stack traces for errors
  winston.format.splat(), // String interpolation
  winston.format.json()
);

// Pretty format for console (development)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present (exclude common Express fields)
    const { service, ...rest } = metadata;
    if (Object.keys(rest).length > 0) {
      msg += ` ${JSON.stringify(rest)}`;
    }
    
    return msg;
  })
);

// Create transports
const transports: winston.transport[] = [];

// Console transport (always enabled)
transports.push(
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || "debug",
    format: consoleFormat,
  })
);

// File transport - All logs
transports.push(
  new DailyRotateFile({
    filename: path.join(logDir, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
    level: "debug",
    format: customFormat,
  })
);

// File transport - Error logs only
transports.push(
  new DailyRotateFile({
    filename: path.join(logDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "30d",
    level: "error",
    format: customFormat,
  })
);

// File transport - HTTP logs
transports.push(
  new DailyRotateFile({
    filename: path.join(logDir, "http-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "7d",
    level: "http",
    format: customFormat,
  })
);

// Create the logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: customFormat,
  defaultMeta: { service: "crm-api" },
  transports,
});

// Handle logger errors
logger.on("error", (error) => {
  console.error("Logger error:", error);
});

// Stream for Morgan HTTP logging
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;

