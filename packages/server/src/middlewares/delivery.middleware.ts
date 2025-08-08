import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/http.error';
import { EUserRole } from '../models/user.model';
import { UserService } from '../services/user.service';

/**
 * Middleware to restrict assigning deliveries to drivers only
 */
export const assignOnlyDriver = async (req: Request, _res: Response, next: NextFunction) => {
  const [user] = await UserService.findById(req.body.driverId);
  if (!user) {
    return next(new UnauthorizedError('You are not logged in! Please log in to get access.'));
  }

  if (user.role !== EUserRole.driver) {
    return next(new ForbiddenError('User is not a driver'));
  }
  
  next();
};