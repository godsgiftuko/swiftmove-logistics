import winston from "winston";
import { Request } from "express";
import { HttpError } from "./errors/http.error";
import { HTTP_STATUS } from "../../shared/constants";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const devFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports: winston.transport[] = [];

if (process.env.NODE_ENV !== "production") {
  transports.push(new winston.transports.Console({ format: devFormat }));
} else {
  // On Vercel, only use console logging
  transports.push(new winston.transports.Console({ format: prodFormat }));
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels,
  transports,
  exitOnError: false,
});

export default logger;

export const logError = (
  err: Error & { statusCode?: number },
  req: Request & { requestId?: string }
): void => {
  const errorInfo = {
    stack: err.stack,
    requestId: req?.requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    userAgent: req.get("User-Agent"),
    ip: req.ip || req.connection.remoteAddress,
    timestamp: new Date().toISOString(),
    ...err,
  };

  if (
    err instanceof HttpError &&
    errorInfo?.statusCode &&
    errorInfo?.statusCode < HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) {
    logger.warn("Client Error:", errorInfo);
  } else {
    logger.error("Server Error:", errorInfo);
  }
};

// import winston from "winston";
// import DailyRotateFile from "winston-daily-rotate-file";
// import path from "path";
// import { Request } from "express";
// import { HttpError } from "./errors/http.error";
// import { HTTP_STATUS } from "../../shared/constants";

// // Define log levels
// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   debug: 4,
// };

// // Define colors for each level
// const colors = {
//   error: "red",
//   warn: "yellow",
//   info: "green",
//   http: "magenta",
//   debug: "white",
// };

// // Configure winston colors
// winston.addColors(colors);

// // Create format for development
// const devFormat = winston.format.combine(
//   winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
//   winston.format.colorize({ all: true }),
//   winston.format.printf(
//     (info) => `${info.timestamp} ${info.level}: ${info.message}`
//   )
// );

// // Create format for production
// const prodFormat = winston.format.combine(
//   winston.format.timestamp(),
//   winston.format.errors({ stack: true }),
//   winston.format.json()
// );

// // Create transports array
// const transports: winston.transport[] = [];

// // Console transport
// if (process.env.NODE_ENV !== "production") {
//   transports.push(
//     new winston.transports.Console({
//       format: devFormat,
//     })
//   );
// } else {
//   transports.push(
//     new winston.transports.Console({
//       format: prodFormat,
//     })
//   );
// }

// // File transports for production
// if (process.env.NODE_ENV === "production") {
//   // Daily rotate file for general logs
//   transports.push(
//     new DailyRotateFile({
//       filename: path.join("logs", "application-%DATE%.log"),
//       datePattern: "YYYY-MM-DD",
//       zippedArchive: true,
//       maxSize: "20m",
//       maxFiles: "14d",
//       format: prodFormat,
//     })
//   );

//   // Error logs
//   transports.push(
//     new winston.transports.File({
//       filename: path.join("logs", "error.log"),
//       level: "error",
//       format: prodFormat,
//     })
//   );
// } else {
//   // Development file logs
//   transports.push(
//     new winston.transports.File({
//       filename: path.join("logs", "development.log"),
//       format: prodFormat,
//     })
//   );
// }

// // Create and export logger
// const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || "info",
//   levels,
//   transports,
//   exitOnError: false,
// });

// export default logger;

// // Error logging function
// export const logError = (
//   err: Error & { statusCode?: number },
//   req: Request & { requestId?: string }
// ): void => {
//   const errorInfo = {
//     stack: err.stack,
//     requestId: req?.requestId,
//     method: req.method,
//     url: req.originalUrl || req.url,
//     userAgent: req.get("User-Agent"),
//     ip: req.ip || req.connection.remoteAddress,
//     timestamp: new Date().toISOString(),
//     ...err,
//   };

//   if (
//     err instanceof HttpError &&
//     errorInfo?.statusCode &&
//     errorInfo?.statusCode < HTTP_STATUS.INTERNAL_SERVER_ERROR
//   ) {
//     logger.warn("Client Error:", errorInfo);
//   } else {
//     logger.error("Server Error:", errorInfo);
//   }
// };
