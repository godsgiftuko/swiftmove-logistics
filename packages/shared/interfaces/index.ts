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
