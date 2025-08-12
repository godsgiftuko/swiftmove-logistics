import { HTTP_STATUS } from "../../../shared/constants";
import { ServiceResponse } from "../types/service";
import Delivery, { EDeliveryStatus, IDelivery } from "../models/delivery.model";
import { UserService } from "./user.service";
import mongoose from "mongoose";
import { IParcel } from "../models/parcel.model";
import { IDeliveryStats } from "../../../shared/interfaces";
import WebsocketService from "./ws.service";
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
    parcel,
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
  > & { parcel: IParcel }): Promise<ServiceResponse<IDelivery>> {
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
      parcel,
      createdBy,
    });

    // save new delivery
    await delivery.save();


    // push event
    WebsocketService.emitEvent('DELIVERY', delivery);

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
    const delivery = await Delivery.findByIdAndUpdate({ _id: id }, updates, {
      new: true,
    });
    return [delivery, null, HTTP_STATUS.OK];
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
      status: "assigned",
      assignedDriver: driverId,
      assignedBy,
    });

    // Update driver status
    await UserService.update(driver._id, {
      status: "busy",
    });

    // push event
    WebsocketService.emitEvent('DELIVERY_ASSIGNED', updatedDelivery);

    return [updatedDelivery, null, HTTP_STATUS.OK];
  }

  //  List deliveries
  static async listDeliveries(): Promise<ServiceResponse<Array<IDelivery>>> {
    const deliveries = await Delivery.find();
    return [deliveries, null, HTTP_STATUS.OK];
  }

  //  Fetch stats
  static async fetchStats(createdBy?: string): Promise<ServiceResponse<IDeliveryStats>> {

    let statusAggregate: any = [
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];

    let priorityAggregate: any = [
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ];

    if (createdBy) {
      statusAggregate = [
        {
          $match: { createdBy }
        },
        ...statusAggregate,
      ];

      priorityAggregate = [
        {
          $match: { createdBy }
        },
        ...priorityAggregate,
      ];
    }

    const [statusStats, total, priorityStats] = await Promise.all([
      Delivery.aggregate(statusAggregate),
      Delivery.countDocuments(createdBy ? { createdBy } : {}),
      Delivery.aggregate(priorityAggregate),
    ]);

    // Initialize shape
    const statusCount = {
      total,
      cancelled: 0,
      inTransit: 0,
      delivered: 0,
      pending: 0,
      assigned: 0,
    };

    const priorityCount = {
      low: 0,
      medium: 0,
      high: 0,
    };

    // Map aggregation results into the fixed shape
    statusStats.forEach((stat: any) => {
      if (stat._id && statusCount.hasOwnProperty(stat._id)) {
        statusCount[stat._id as keyof typeof statusCount] = stat.count;
      }
    });

    // Map aggregation results into the fixed shape
    priorityStats.forEach((stat) => {
      if (stat._id && priorityCount.hasOwnProperty(stat._id)) {
        priorityCount[stat._id as keyof typeof priorityCount] = stat.count;
      }
    });

    return [{ statusCount, priorityCount }, null, HTTP_STATUS.OK];
  }

  //  Update delivery status
  static async updateStatus(
    id: mongoose.Types.ObjectId,
    status: EDeliveryStatus,
  ): Promise<ServiceResponse<IDelivery>> {
    const delivery = await Delivery.findByIdAndUpdate({ _id: id }, { status }, {
      new: true,
    });

    switch (status) {
      case EDeliveryStatus.assigned:
        WebsocketService.emitEvent('DELIVERY_ASSIGNED', delivery);
        break;

      case EDeliveryStatus.cancelled:
        WebsocketService.emitEvent('DELIVERY_CANCELLED', delivery);
        break;

      case EDeliveryStatus.delivered:
        WebsocketService.emitEvent('DELIVERY_DELIVERED', delivery);
        break;

      case EDeliveryStatus.in_transit:
        WebsocketService.emitEvent('DELIVERY_IN_TRANSIT', delivery);
        break;

      case EDeliveryStatus.pending:
        WebsocketService.emitEvent('DELIVERY_PENDING', delivery);
        break;
    }
    return [delivery, null, HTTP_STATUS.OK];
  }
}
