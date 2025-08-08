import { HTTP_STATUS } from "@/constants";
import User, { EUserRole, EUserStatus, IUser } from "../models/user.model";
import { ServiceResponse } from "../types/service";

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
}
