import { NextFunction, Request, Response } from "express";
import { ControllerResponse } from "../helpers/controller";
import { AuthService } from "../services/auth.service";
import { ServiceResponse } from "../types/service";
import { IUser } from "../models/user.model";

export default class AuthController {
  static async registerUser(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, email, phone, role, password } = req.body;
    const response = await AuthService.registerUser({
      firstName,
      lastName,
      email,
      phone,
      role,
      password,
    });
    return new ControllerResponse(res, next).asJSON(
      response,
      "User registered successfully"
    );
  }

  static async loginUser(req: Request, res: Response, next: NextFunction) {
    const { email, phone, password } = req.body;

    let response: ServiceResponse<{
      token: string;
      user: IUser;
    }>;

    if (email) {
      response = await AuthService.loginUserByEmail({ email, password });
    } else {
      response = await AuthService.loginUserByPhone({ phone, password });
    }

    return new ControllerResponse(res, next).asJSON(
      response,
      "Login successfully"
    );
  }

  static async loginAdminUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const response = await AuthService.loginUserByEmail({ email, password });
    return new ControllerResponse(res, next).asJSON(
      response,
      "Login successfully"
    );
  }
}
