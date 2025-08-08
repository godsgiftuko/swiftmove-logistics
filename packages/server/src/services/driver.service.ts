import { HTTP_STATUS } from "@/constants";
import User, { EUserRole, EUserStatus, IUser } from "../models/user.model";
import { ServiceResponse } from "../types/service";

export class DriverService {
  //  List active drivers
  static async listDrivers(status?: keyof typeof EUserStatus): Promise<ServiceResponse<Array<IUser>>> {
    const drivers = await User.find({ status: status ? EUserStatus[status] : status, role: EUserRole.driver });
    return [drivers, null, HTTP_STATUS.OK];
  }
}
