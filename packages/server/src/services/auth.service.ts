import User, { IUser } from "../models/user.model";
import { ServiceResponse } from "../types/service";
import Generator from "@/utils/generator";
import { UserService } from "./user.service";
import { HTTP_STATUS } from "@/constants";

export class AuthService {
  //  Register user
  static async registerUser(
    newUser: Pick<
      IUser,
      "firstName" | "lastName" | "password" | "email" | "role" | "phone"
    >
  ): Promise<ServiceResponse<{ token: string; user: IUser }>> {
    // Create new user
    const [user, error, statusCode] = await UserService.createUser(newUser);
    if (!user) {
      return [null, error, statusCode];
    }
    // generate JWT token
    const token = Generator.generateToken(user.id, user.role);
    return [
      {
        token,
        user,
      },
      null,
      statusCode
    ];
  }

  // Login user by email
  static async loginUserByEmail({
    email,
    password,
  }: Pick<IUser, "email" | "password">): Promise<
    ServiceResponse<{ token: string; user: IUser }>
  > {
    // Find user
    const [user, _error, statusCode] = await UserService.findByEmail(email);
    if (!user || !user.isActive) {
      return [null, "Invalid credentials", HTTP_STATUS.BAD_REQUEST];
    }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return [null, "Invalid credentials", HTTP_STATUS.BAD_REQUEST];
    }
    const token = Generator.generateToken(user.id, user.role);
    return [
      {
        token,
        user,
      },
      null,
      statusCode
    ];
  }

  // Login user by phone
  static async loginUserByPhone({
    phone,
    password,
  }: Pick<IUser, "phone" | "password">): Promise<
    ServiceResponse<{ token: string; user: IUser }>
  > {
    // Find user
    const [user, _error, statusCode] = await UserService.findByPhone(phone!);
    if (!user || !user.isActive) {
      return [null, "Invalid credentials", HTTP_STATUS.BAD_REQUEST];
    }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return [null, "Invalid credentials", HTTP_STATUS.BAD_REQUEST];
    }
    const token = Generator.generateToken(user.id, user.role);
    return [
      {
        token,
        user,
      },
      null,
      statusCode
    ];
  }
}
