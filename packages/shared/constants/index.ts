import { EDeliveryPriority, EDeliveryStatus } from "../../../packages/server/src/models/delivery.model";
import { EUserRole, EUserStatus } from "../../../packages/server/src/models/user.model";

/**
 * Application-wide constants
 */

export const APP_LOGO = {
  TRANSPARENT: 'https://res.cloudinary.com/ddeh31zhy/image/upload/v1754617629/swiftmove-logistics/swiftmove-logistics-transparent-logo.png',
  NORMAL: 'https://res.cloudinary.com/ddeh31zhy/image/upload/v1754617588/swiftmove-logistics/swiftmove-logistics-logo.png'
}

// API Version and Prefix
export const API = {
  PREFIX: "/api/v1",
  VERSION: "v1",
  TIMEOUT: 30000, // API request timeout in ms
  NAME: 'Swiftmove Logistics'
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

// User Constants
export const USER = {
  ROLES: Object.values(EUserRole),
  STATUS: Object.values(EUserStatus),
  MIN_PASSWORD_LENGTH: 8,
  MAX_USERNAME_LENGTH: 30,
  PHONE_LENGTH: 11,
  DEFAULT_TIMEZONE: "UTC",
};


// Delivery Constants
export const DELIVERY = {
  STATUS: Object.values(EDeliveryStatus),
  PRIORITY: Object.values(EDeliveryPriority),
};

// Security Constants
export const SECURITY = {
  BCRYPT_SALT_ROUNDS: 10,
  RATE_LIMIT_WINDOW_MS: 1 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 10,
  PASSWORD_RESET_EXPIRY: 60 * 60 * 1000, // 1 hour
};

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/jpg"],
  DELIVERY_RECEIPT_PATH: "uploads/receipts/",
};
