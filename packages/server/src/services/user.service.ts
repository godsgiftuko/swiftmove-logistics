import { HTTP_STATUS } from "../../../shared/constants";
import User, { EUserRole, IUser } from "../models/user.model";
import { ServiceResponse } from "../types/service";
import Generator from "@/utils/generator";
import { extractBearerToken } from "../helpers/http";
import { Request } from "express";
import { UnauthorizedError } from "../errors/http.error";
import mongoose from "mongoose";
import { IUserStats } from "@/interfaces";

export class UserService {
  //  Create user
  static async createUser({
    firstName,
    lastName,
    email,
    password,
    role,
    phone,
  }: Pick<
    IUser,
    "firstName" | "lastName" | "password" | "email" | "role" | "phone"
  >): Promise<ServiceResponse<IUser>> {

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return [null, "User already exists with this email", HTTP_STATUS.CONFLICT];
    }

    // Check if phone number already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return [null, "User already exists with this phone number", HTTP_STATUS.CONFLICT];
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
    });

    // save new user
    await user.save();

    return [user, null, HTTP_STATUS.CREATED];
  }

  //  Find user by id
  static async findById(id: mongoose.Types.ObjectId): Promise<ServiceResponse<IUser>> {
    const user = await User.findOne({ _id: id });
    if (!user) return [null, 'User not found', HTTP_STATUS.NOT_FOUND];
    return [user, null, HTTP_STATUS.OK];
  }

  //  Find user by email
  static async findByEmail(email: string): Promise<ServiceResponse<IUser>> {
    const user = await User.findOne({ email });
    if (!user) return [null, 'User not found', HTTP_STATUS.NOT_FOUND];
    return [user, null, HTTP_STATUS.OK];
  }

  //  Find user by phone
  static async findByPhone(phone: string): Promise<ServiceResponse<IUser>> {
    const user = await User.findOne({ phone });
    if (!user) return [null, 'User not found', HTTP_STATUS.NOT_FOUND];
    return [user, null, HTTP_STATUS.OK];
  }

  //  Find current user
  static async findCurrentUser(req: Request) {
    const token = extractBearerToken(req);
    if (!token) {
      throw new UnauthorizedError('You are not logged in! Please log in to get access.')
    }
    const decodedToken = Generator.decodeToken(token);
    const [user] = await UserService.findById(decodedToken.id)
    if (!user) return null;
    return user; 
  }

  //  Update user
  static async update(
    id: mongoose.Types.ObjectId,
    updates: Partial<Omit<IUser, "_id" | "id" | "createdAt">>
  ): Promise<ServiceResponse<IUser>> {
    const delivery = await User.findByIdAndUpdate({ _id: id }, updates,  { new: true });
    return [delivery, null, HTTP_STATUS.OK]
  }


  //  Fetch stats
  static async fetchStats(user: IUser): Promise<ServiceResponse<Partial<IUserStats>>> {
    const role = user.role;
    const [roleStats, total] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]),
      User.countDocuments(),
    ]);

    // Initialize shape
    const userCount: Partial<IUserStats> = {
      total,
      driver: 0,
      admin: 0,
      manager: 0,
    };

    // Map aggregation results into the fixed shape
    roleStats.forEach((stat) => {
      if (stat._id && userCount.hasOwnProperty(stat._id)) {
        userCount[stat._id as keyof typeof userCount] = stat.count;
      }
    });

    if (role === EUserRole.manager) {
      delete userCount.total;
      delete userCount.admin;
      delete userCount.manager;
    }

    return [userCount, null, HTTP_STATUS.OK];
  }
}
