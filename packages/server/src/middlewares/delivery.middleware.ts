import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/http.error';
import { EUserRole, EUserStatus } from '../models/user.model';
import { UserService } from '../services/user.service';

/**
 * Middleware to restrict assigning deliveries to drivers only
 */
export const assignOnlyDriver = async (req: Request, _res: Response, next: NextFunction) => {
  const [user] = await UserService.findById(req.body.driverId);
  const assignee = await UserService.findCurrentUser(req);

  if (user!.role !== EUserRole.driver || assignee!._id == user!._id) {
    return next(new ForbiddenError('User is not a driver'));
  }
  
  
  next();
};

/**
 * Middleware to check driver availability
 */
export const checkDriverAvailability = async (req: Request, _res: Response, next: NextFunction) => {
  const [user] = await UserService.findById(req.body.driverId);
 
  if (user!.status === EUserStatus.busy) {
    return next(new ForbiddenError('Driver is busy'));
  }

  if (user!.status === EUserStatus.suspended) {
    return next(new ForbiddenError('Driver was suspended'));
  }

  if (user!.status === EUserStatus.inactive) {
    return next(new ForbiddenError('Driver is unavailable'));
  }

  if (user!.status === EUserStatus.deleted) {
    return next(new ForbiddenError('Driver was deleted'));
  }
  
  next();
};