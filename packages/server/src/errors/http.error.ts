import { HTTP_STATUS } from "../../../shared/constants";

export class HttpError extends Error {
  private statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 - BadRequest
export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

// 404 - NotFound
export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}


// 401 - Unauthorized
export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized access') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

// 403 - Forbidden
export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden access') {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

// 409 - Conflict
export class ConflictError extends HttpError {
  constructor(message: string = 'Resource conflict') {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

// 429 - Too Many Requests
export class TooManyRequestsError extends HttpError {
  constructor(message: string = 'Too many requests') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS);
  }
}

// 500 - Internal Server Error
export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal server error') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

// 503 - Service Unavailable
export class ServiceUnavailableError extends HttpError {
  constructor(message: string = 'Service unavailable') {
    super(message, HTTP_STATUS.SERVICE_UNAVAILABLE);
  }
} 