import { Request, Response, NextFunction } from "express";
import logger from "../logger";

export const middlewareLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const statusCode = res.statusCode;
  const isSuccess = statusCode >= 200 && statusCode <= 300;

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (isSuccess) {
      logger.info(
        `${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
      );
    } else if (statusCode >= 500 ) {
      logger.error(
        `Server error: ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
      );
    } else if (statusCode == 404 ) {
      logger.warn(
        `Not found: ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
      );
    }
  });

  next();
};
