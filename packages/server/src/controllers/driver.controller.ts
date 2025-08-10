import { NextFunction, Request, Response } from "express";
import { ControllerResponse } from "../helpers/controller";
import { HTTP_STATUS } from "@/constants";
import { DriverService } from "../services/driver.service";
import mongoose from "mongoose";

export default class DriverController {
  // List drivers
  static async listDrivers(req: Request, res: Response, next: NextFunction) {
    const results = (res as any).paginatedResults;
    return new ControllerResponse(res, next).asJSON([results, null, HTTP_STATUS.OK], "Listed drivers successfully");
  }
  // Get driver
  static async getDriver(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const response = await DriverService.findById(id as unknown  as mongoose.Types.ObjectId);
    return new ControllerResponse(res, next).asJSON(response);
  }
}
