import { NextFunction, Request, Response } from "express";
import { ControllerResponse } from "../helpers/controller";
import { HTTP_STATUS } from "@/constants";
import { DeliveryService } from "../services/delivery.service";
import { UserService } from "../services/user.service";
import mongoose from "mongoose";
import { ParcelService } from "../services/parcel.service";

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
      parcel: parcelInfo,
    } = req.body;

    const user = await UserService.findCurrentUser(req);
    const [parcel] = await ParcelService.createParcel(parcelInfo);
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
      parcel: parcel!,
    });
    return new ControllerResponse(res, next).asJSON(
      response,
      "Shipping created successfully"
    );
  }

  // Assign driver to delivery
  static async assignDriver(req: Request, res: Response, next: NextFunction) {
    const { driverId } = req.body;
    const deliveryId = req.params.id as unknown as mongoose.Types.ObjectId; 
    const assignee = await UserService.findCurrentUser(req);    
    const response = await DeliveryService.assignDriver(driverId, deliveryId, assignee!._id)
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
    const results = (res as any).paginatedResults;
    return new ControllerResponse(res, next).asJSON([results, null, HTTP_STATUS.OK], "Listed deliveries successfully");
  }

  // Fetch stats
  static async fetchStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const createdBy = req.query.createdBy as string; 
    const response = await DeliveryService.fetchStats(createdBy ? createdBy : undefined);
    return new ControllerResponse(res, next).asJSON(response, "Fetched delivery stats successfully");
  }
}
