import { IApiResponse, IDeliveryPayload } from "@/interfaces";
import { API } from "../../../shared/constants";
import api from "../lib/api";

export default class ShipmentRepository {
  static async createDelivery(deliveryPayload: IDeliveryPayload): Promise<IApiResponse<IDeliveryPayload>> {
    const { data } = await api.post<IApiResponse<IDeliveryPayload>>(`${API.PREFIX}/deliveries`, {
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
    });

    return data;
  }
}
