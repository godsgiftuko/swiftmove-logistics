import { HTTP_STATUS } from "@/constants";
import { ServiceResponse } from "../types/service";
import Parcel, { IParcel } from "../models/parcel.model";

export class ParcelService {
  //  Create parcel
  static async createParcel({
    name,
    isFragile,
    quantity,
    weightInKg,
    description,
  }: Pick<IParcel, 'name' | 'weightInKg' | 'quantity' | 'isFragile' | 'description'>): Promise<ServiceResponse<IParcel>> {
    const parcel = await Parcel.create({
      name,
      isFragile,
      quantity,
      weightInKg,
      description,
    }); 
    return [parcel, null, HTTP_STATUS.OK];
  }
}
