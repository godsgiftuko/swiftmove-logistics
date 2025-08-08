import { HTTP_STATUS } from "@/constants";
import { ServiceResponse } from "../types/service";
import Delivery, { IDelivery } from "../models/delivery.model";
import { UserService } from "./user.service";
import mongoose from "mongoose";

export class DeliveryService {
  //  Create delivery
  static async createDelivery({
    createdBy,
    destinationAddress,
    pickupAddress,
    customerName,
    customerEmail,
    customerPhone,
    estimatedDeliveryDate,
    notes,
    priority,
  }: Pick<
    IDelivery,
    | "destinationAddress"
    | "createdBy"
    | "pickupAddress"
    | "customerEmail"
    | "customerName"
    | "customerPhone"
    | "priority"
    | "estimatedDeliveryDate"
    | "notes"
  >): Promise<ServiceResponse<IDelivery>> {
    // Create new delivery
    const delivery = new Delivery({
      trackingNumber: `TRK${Date.now()}`,
      customerName,
      customerPhone,
      customerEmail,
      pickupAddress,
      destinationAddress,
      status: "pending",
      priority,
      estimatedDeliveryDate,
      notes,
      createdBy,
    });

    // save new delivery
    await delivery.save();

    return [delivery, null, HTTP_STATUS.CREATED];
  }

  //  Find delivery by id
  static async findById(
    id: mongoose.Types.ObjectId
  ): Promise<ServiceResponse<IDelivery>> {
    const delivery = await Delivery.findOne({ _id: id });
    if (!delivery) return [null, "Delivery not found", HTTP_STATUS.NOT_FOUND];
    return [delivery, null, HTTP_STATUS.OK];
  }

  //  Update delivery
  static async update(
    id: mongoose.Types.ObjectId,
    updates: Partial<Omit<IDelivery, "_id" | "id" | "createdAt">>
  ): Promise<ServiceResponse<IDelivery>> {
    const delivery = await Delivery.findByIdAndUpdate({ _id: id }, updates,  { new: true });
    return [delivery, null, HTTP_STATUS.OK]
  }

  //  Assign driver
  static async assignDriver(
    driverId: mongoose.Types.ObjectId,
    deliveryId: mongoose.Types.ObjectId,
    assignedBy: mongoose.Types.ObjectId
  ): Promise<ServiceResponse<IDelivery>> {

    // find delivery
    const [delivery, ...rest] = await DeliveryService.findById(deliveryId);
    if (!delivery) return [null, ...rest];

    // find driver
    const [driver, _error, statusCode] = await UserService.findById(driverId);
    if (!driver) return [null, "Driver not found", statusCode];

    // Update delivery status
    const [updatedDelivery] = await DeliveryService.update(deliveryId, {
      status: 'assigned',
      assignedDriver: driverId,
      assignedBy,
    });

    // Update driver status
    await UserService.update(driver._id, {
      status: 'busy',
    });

    return [updatedDelivery, null, HTTP_STATUS.OK];
  }

  //  List deliveries
  static async listDeliveries(): Promise<ServiceResponse<Array<IDelivery>>> {
    const deliveries = await Delivery.find();
    return [deliveries, null, HTTP_STATUS.OK];
  }
}
