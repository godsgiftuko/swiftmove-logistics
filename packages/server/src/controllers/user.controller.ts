import { NextFunction, Request, Response } from "express";
import { ControllerResponse } from "../helpers/controller";
import { DeliveryService } from "../services/delivery.service";
import { UserService } from "../services/user.service";

export default class UserController {
  // Fetch stats
  static async fetchStats(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    const response = await UserService.fetchStats();
    return new ControllerResponse(res, next).asJSON(response, "Fetched users stats successfully");
  }
}
