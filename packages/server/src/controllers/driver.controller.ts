import { NextFunction, Request, Response } from "express";
import { ControllerResponse } from "../helpers/controller";
import { HTTP_STATUS } from "@/constants";

export default class DriverController {
  // List drivers
  static async listDrivers(req: Request, res: Response, next: NextFunction) {
    const results = (res as any).paginatedResults;
    return new ControllerResponse(res, next).asJSON([results, null, HTTP_STATUS.OK], "Listed drivers successfully");
  }
}
