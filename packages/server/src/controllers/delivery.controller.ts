import { NextFunction, Request, Response } from "express";
import { ControllerResponse } from "../helpers/controller";
import { AuthService } from "../services/auth.service";
import { ServiceResponse } from "../types/service";
import { IUser } from "../models/user.model";
import { HTTP_STATUS } from "@/constants";

export default class DeliveryController {
  // create delivery
  static async createDelivery(_req: Request, res: Response, next: NextFunction) {
    return new ControllerResponse(res, next).asJSON(
      [null, null, HTTP_STATUS.OK],
      "Delivery created successfully"
    );
  }

  // Assign driver to delivery
  static async assignDriver(_req: Request, res: Response, next: NextFunction) {
    return new ControllerResponse(res, next).asJSON(
      [null, null, HTTP_STATUS.OK],
      "Driver assigned successfully"
    );
  }

  // List all deliveries
  static async listAllDeliveries(_req: Request, res: Response, next: NextFunction) {
    return new ControllerResponse(res, next).asJSON(
      [null, null, HTTP_STATUS.OK],
    );
  }
}
