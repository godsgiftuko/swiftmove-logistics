import { NextFunction, Request, Response } from "express";
import { ControllerResponse } from "../helpers/controller";
import { DriverService } from "../services/driver.service";
import { EUserStatus, IUser } from "../models/user.model";
import { ServiceResponse } from "../types/service";

export default class DriverController {
  // List drivers
  static async listDrivers(req: Request, res: Response, next: NextFunction) {
    const status = req.query?.status as EUserStatus;
    let response: ServiceResponse<IUser[]>;

    if (status) {
      response = await DriverService.listDrivers(status);
    } else {
      response = await DriverService.listDrivers();
    }

    return new ControllerResponse(res, next).asJSON(
      response,
      "Listed drivers successfully"
    );
  }
}
