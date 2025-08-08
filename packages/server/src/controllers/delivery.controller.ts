import { NextFunction, Request, Response } from "express";
import { ControllerResponse } from "../helpers/controller";
import { HTTP_STATUS } from "@/constants";
import { DeliveryService } from "../services/delivery.service";
import { UserService } from "../services/user.service";
import mongoose from "mongoose";

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
  static async assignDriver(req: Request, res: Response, next: NextFunction) {
    const { driverId } = req.body;
    const deliveryId = req.params.id as unknown as mongoose.Types.ObjectId; 
    const assignee = await UserService.findCurrentUser(req);    
    const response = await DeliveryService.assignDriver(driverId, deliveryId, assignee?.id)
    return new ControllerResponse(res, next).asJSON(
      response,
      "Driver assigned successfully"
    );
  }

  // List all deliveries
  static async listAllDeliveries(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    const response = await DeliveryService.listDeliveries();
    return new ControllerResponse(res, next).asJSON(response, "Listed deliveries successfully");
  }
}
