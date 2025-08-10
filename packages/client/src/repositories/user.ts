import { IApiPaginatedResponse, IUser, IApiResponse } from "@/interfaces";
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
  // Get driver
  static async getDriver(id: string): Promise<IApiResponse<IUser>> {
    const { data } = await api.get<IApiResponse<IUser>>(
      `${API.PREFIX}/drivers/${id}`
    );
    return data;
  }
}
