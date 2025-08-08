import User, { IUser } from "../models/user.model";
import { ServiceResponse } from "../types/service";
import Generator from "@/utils/generator";
import { UserService } from "./user.service";

export class AuthService {

  //  Register user
  static async registerUser(newUser: Pick<
    IUser,
    "firstName" | "lastName" | "password" | "email" | "role" | "phone"
  >): Promise<ServiceResponse<{ token: string; user: IUser }>> {
    
    // Create new user
    const [ user, error ] = await UserService.createUser(newUser)
    if (!user) {
        return [ null, error ];
    }

    // generate JWT token
    const token = Generator.generateToken(user.id, user.role);

    return [
      {
        token,
        user,
      },
      null,
    ];
  }

  // Login user
  async loginUser({
    email,
    password,
  }: Pick<IUser, "email" | "password">): Promise<
    ServiceResponse<{ token: string; user: IUser }>
  > {
    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return [null, "Invalid credentials"];
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return [null, "Invalid credentials"];
    }

    const token = Generator.generateToken(user.id, user.role);
    return [
      {
        token,
        user,
      },
      null,
    ];
  }
}
