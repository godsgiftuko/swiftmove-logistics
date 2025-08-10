import { HTTP_STATUS } from "../../../shared/constants";
import User, { EUserRole, EUserStatus, IUser } from "../models/user.model";
import { ServiceResponse } from "../types/service";
import mongoose from "mongoose";

export class DriverService {
  //  List active drivers
  static async listDrivers(status?: keyof typeof EUserStatus): Promise<ServiceResponse<Array<IUser>>> {
    const conditions: Partial<Pick<IUser, 'status'>> & { role: EUserRole } = { role: EUserRole.driver }
    if (status) {
      conditions.status = status;
    }
    const drivers = await User.find(conditions);
    return [drivers, null, HTTP_STATUS.OK];
  }

  //  Find driver by id
  static async findById(id: mongoose.Types.ObjectId): Promise<ServiceResponse<IUser>> {
    const user = await User.findOne({ _id: id, role: EUserRole.driver });
    if (!user) return [null, 'Driver not found', HTTP_STATUS.NOT_FOUND];
    return [user, null, HTTP_STATUS.OK];
  }

  //  Update driver
  static async update(id: mongoose.Types.ObjectId, updates: Partial<Omit<IUser, "_id" | "id" | "createdAt">>): Promise<ServiceResponse<IUser>> {
    const user = await User.findByIdAndUpdate({ _id: id, role: EUserRole.driver }, updates, { new: true });
    if (!user) return [null, 'Driver not found', HTTP_STATUS.NOT_FOUND];
    return [user, null, HTTP_STATUS.OK];
  }
}
