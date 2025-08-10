import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/http.error';
import { EUserRole, EUserStatus } from '../models/user.model';
import { UserService } from '../services/user.service';
import { DriverService } from '../services/driver.service';

/**
 * Middleware to list drivers only
 */
export const listOnlyDrivers = async (req: any, _res: Response, next: NextFunction) => {
  req.query.role = EUserRole.driver;  
  next();
};
