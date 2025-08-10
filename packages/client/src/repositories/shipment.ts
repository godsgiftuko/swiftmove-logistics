import {
  IApiPaginatedResponse,
  IApiResponse,
  IDelivery,
  IDeliveryPayload,
} from "@/interfaces";
import { API } from "../../../shared/constants";
import api from "../lib/api";

export default class ShipmentRepository {
  // create delivery
  static async createDelivery(
    deliveryPayload: IDeliveryPayload
  ): Promise<IApiResponse<IDeliveryPayload>> {
    const { data } = await api.post<IApiResponse<IDeliveryPayload>>(
      `${API.PREFIX}/deliveries`,
      {
        customerName: deliveryPayload.customerName,
        customerPhone: deliveryPayload.customerPhone,
        customerEmail: deliveryPayload.customerEmail,
        pickupAddress: {
          street: deliveryPayload.pickupStreet,
          city: deliveryPayload.pickupCity,
          state: deliveryPayload.pickupState,
          zipCode: deliveryPayload.pickupZipCode,
          coordinates: {
            lat: deliveryPayload.pickupLat,
            lng: deliveryPayload.pickupLng,
          },
        },
        destinationAddress: {
          street: deliveryPayload.destStreet,
          city: deliveryPayload.destCity,
          state: deliveryPayload.destState,
          zipCode: deliveryPayload.destZipCode,
          coordinates: {
            lat: deliveryPayload.destLat,
            lng: deliveryPayload.destLng,
          },
        },
        parcel: {
          name: deliveryPayload.parcelName,
          weightInKg: deliveryPayload.parcelWeightInKg,
          quantity: deliveryPayload.parcelQuantity,
          isFragile: deliveryPayload.parcelIsFragile,
          description: deliveryPayload.parcelDescription,
        },
        priority: deliveryPayload.priority,
        estimatedDeliveryDate: deliveryPayload.estimatedDeliveryDate,
        notes: deliveryPayload.notes,
      }
    );

    return data;
  }

  // list deliveries
  static async listDeliveries(
    pageNum: number
  ): Promise<IApiPaginatedResponse<IDelivery>> {
    const { data } = await api.get<IApiPaginatedResponse<IDelivery>>(
      `${API.PREFIX}/deliveries`
    );
    return data;
  }

  // assign driver
  static async assignDriver(
    driverId: string,
    deliveryId: string
  ): Promise<IApiResponse<IDelivery>> {
    const { data } = await api.put<IApiResponse<IDelivery>>(
      `${API.PREFIX}/deliveries/${deliveryId}/assign`,
      {
        driverId,
      }
    );
    return data;
  }
}
