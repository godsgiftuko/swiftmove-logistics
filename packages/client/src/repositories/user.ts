import { IApiPaginatedResponse, IUser } from "@/interfaces";
import { API } from "../../../shared/constants";
import api from "../lib/api";

export default class UserRepository {
  // list active drivers
  static async listActiveDrivers(): Promise<IApiPaginatedResponse<IUser>> {
    const { data } = await api.get<IApiPaginatedResponse<IUser>>(
      `${API.PREFIX}/drivers?status=active`
    );
    return data;
  }
}
