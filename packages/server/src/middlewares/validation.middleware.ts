import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Middleware to validate request body/params/query
 * Uses express-validator ValidationChain rules
 */
export const expressValidate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Check if there are validation errors
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }
    
    // Format validation errors
    const extractedErrors: Record<string, string> = {};
    const formattedErrors = errors.array().map(err => {
      if (err.type === 'field' && err.path && err.msg) {
        extractedErrors[err.path] = err.msg;
        return {
          field: err.path,
          message: err.msg,
          value: err.value
        };
      }
      return err;
    });
    
    // Return validation error response with detailed information
    return res.status(422).json({
      status: 'error',
      message: 'Validation failed',
      errors: extractedErrors,
      formattedErrors
    });
  };
};