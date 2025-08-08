import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err); // optional logging

  res.status(err.statusCode || 500).json({
    status: 'failed',
    message: err.message || 'Internal Server Error',
    data: null,
  });
}
