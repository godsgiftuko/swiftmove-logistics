export {
  EUserRole,
  EUserStatus,
} from "../../../packages/server/src/models/user.model";
export {
  EDeliveryPriority,
  EDeliveryStatus,
} from "../../../packages/server/src/models/delivery.model";

export type { IUser } from "../../../packages/server/src/models/user.model";
export type { UserStatus } from "../../../packages/server/src/models/user.model";
export type { UserRole } from "../../../packages/server/src/models/user.model";
export type { IDelivery } from "../../../packages/server/src/models/delivery.model";
export type { IParcel } from "../../../packages/server/src/models/parcel.model";

export interface IDeliveryStats {
  statusCount: {
    total: number;
    cancelled: number;
    inTransit: number;
    delivered: number;
    pending: number;
    assigned: number;
  };
  priorityCount: {
    low: number;
    medium: number;
    high: number;
  };
};
export interface IUserStats {
  total: number;
  driver: number;
  admin: number;
  manager: number;
}

export interface IDeliveryPayload {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupStreet: string;
  pickupCity: string;
  pickupState: string;
  pickupZipCode: string;
  pickupLat: number | "";
  pickupLng: number | "";
  destStreet: string;
  destCity: string;
  destState: string;
  destZipCode: string;
  destLat: number | "";
  destLng: number | "";
  parcelName: string;
  parcelWeightInKg: number | "";
  parcelQuantity: number | "";
  parcelIsFragile: boolean;
  parcelDescription?: string;
  priority: string;
  estimatedDeliveryDate: string;
  notes?: string;
}
export interface IApiResponse<T> {
  status: 'success' | 'failed';
  message: string;
  data: T;
}

export interface IApiPaginatedResponse<T> {
  status: 'success' | 'failed'
  message: string;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    items: T[];
  };
}
