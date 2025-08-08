import { config } from "dotenv";

// Load .env from the root
config({ path: `${__dirname}/../../../.env` });
/**
 * Application-wide constants
 */

// API Version and Prefix
export const API = {
  PREFIX: "/api/v1",
  VERSION: "v1",
  TIMEOUT: 30000, // API request timeout in ms
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// JWT Constants
export const JWT = {
  ACCESS_TOKEN_EXPIRE: process.env.JWT_EXPIRE || "24h",
  REFRESH_TOKEN_EXPIRE: "7d",
  RESET_TOKEN_EXPIRE: "1h",
  SECRET: process.env.JWT_SECRET || "RelevancetechBKFhYts",
};

// User Constants
export const USER = {
  ROLES: ["user", "admin", "agent"],
  STATUS: ["active", "inactive", "suspended", "deleted"],
  TIER_LEVELS: ["tier1", "tier2", "tier3"],
  PIN_LENGTH: 4,
  MIN_PASSWORD_LENGTH: 8,
  MAX_USERNAME_LENGTH: 30,
  DEFAULT_TIMEZONE: "UTC",
};

// Security Constants
export const SECURITY = {
  BCRYPT_SALT_ROUNDS: 10,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  PASSWORD_RESET_EXPIRY: 60 * 60 * 1000, // 1 hour
};

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/jpg"],
  DELIVERY_RECEIPT_PATH: "uploads/receipts/",
};

// Server Constants
const SERVER_PORT = parseInt(process.env.SERVER_PORT || "9000");
export const SERVER = {
  PORT: SERVER_PORT,
  URL: process.env.SERVER_URL || `http://localhost:${SERVER_PORT}`,
};

// Database Constants
export const DATABASE = {
  DATABASE: 'mongodb',
  CONNECTION_URL:
    process.env.MONGODB_URI || "mongodb://localhost:27017/swiftmove_logistics",
};

// Client Constants
export const CLIENT = {
  CLIENT_URL: process.env.CLIENT_URL || ''
};
