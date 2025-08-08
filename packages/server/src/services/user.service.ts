import User, { IUser } from "../models/user.model";
import { ServiceResponse } from "../types/service";
import Generator from "@/utils/generator";

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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return [null, "User already exists with this email"];
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

    return [user, null];
  }

  //  Find user by id
  static async findById(id: string): Promise<ServiceResponse<IUser>> {
    const user = await User.findOne({ id });
    if (!user) return [null, 'User not found'];
    return [user, null];
  }

  //  Find user by email
  static async findByEmail(email: string): Promise<ServiceResponse<IUser>> {
    const user = await User.findOne({ email });
    if (!user) return [null, 'User not found'];
    return [user, null];
  }
}
