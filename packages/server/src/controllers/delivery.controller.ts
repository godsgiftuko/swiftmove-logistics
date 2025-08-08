import { NextFunction, Request, Response } from "express";
import { ControllerResponse } from "../helpers/controller";
import { HTTP_STATUS } from "@/constants";
import { DeliveryService } from "../services/delivery.service";
import { UserService } from "../services/user.service";

export default class DeliveryController {
  // create delivery
  static async createDelivery(req: Request, res: Response, next: NextFunction) {
    const {
      customerName,
      customerPhone,
      customerEmail,
      pickupAddress,
      destinationAddress,
      priority,
      estimatedDeliveryDate,
      notes,
    } = req.body;

    const user = await UserService.findCurrentUser(req);
    const response = await DeliveryService.createDelivery({
      customerName,
      customerPhone,
      customerEmail,
      pickupAddress,
      destinationAddress,
      priority,
      estimatedDeliveryDate,
      notes,
      createdBy: user!._id,
    });
    return new ControllerResponse(res, next).asJSON(
      response,
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
  static async listAllDeliveries(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    return new ControllerResponse(res, next).asJSON([[], null, HTTP_STATUS.OK]);
  }
}
