import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/http.error';
import { EUserRole } from '../models/user.model';
import { UserService } from '../services/user.service';

// Extend the Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to authenticate user
 */
export const authenticateUser = async (req: Request, _res: Response, next: NextFunction) => {
  const user = await UserService.findCurrentUser(req);
  if (!user) {
    return next(new UnauthorizedError('You are not logged in! Please log in to get access.'));
  }
  
  next();
};

/**
 * Middleware to restrict access to certain roles
 */
export const restrictTo = (roles: Array<keyof typeof EUserRole>) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const user = await UserService.findCurrentUser(req);
    if (!roles.includes(user!.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }
    
    next();
  };
};