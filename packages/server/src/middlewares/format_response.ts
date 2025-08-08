import { Request, Response, NextFunction } from "express";

export const formatResponse = (req: Request, res: Response, next: NextFunction) => {
  const oldJson = res.json;

  res.json = function (data) {
    const statusCode = res.statusCode;
    const isSuccess = statusCode >= 200 && statusCode < 300;

    const wrapped = {
      status: isSuccess ? "success" : "failed",
      message: isSuccess ? null : (data?.message || "An error occurred"),
      data: isSuccess ? data : null,
    };

    return oldJson.call(this, wrapped);
  };

  next();
};
