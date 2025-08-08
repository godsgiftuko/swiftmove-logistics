import { HTTP_STATUS } from "@/constants";
import { ServiceResponse } from "../types/service";
import Delivery, { IDelivery } from "../models/delivery.model";

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
    'destinationAddress' | 'createdBy' | 'pickupAddress' | 'customerEmail' | 'customerName' | 'customerPhone' | 'priority' | 'estimatedDeliveryDate' | 'notes'
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
  static async findById(id: string): Promise<ServiceResponse<IDelivery>> {
    const delivery = await Delivery.findOne({ _id: id });
    if (!delivery) return [null, "Delivery not found", HTTP_STATUS.NOT_FOUND];
    return [delivery, null, HTTP_STATUS.OK];
  }
}
