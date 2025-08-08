import { NextFunction, Request, Response } from "express";
import { ControllerResponse } from "../helpers/controller";
import { AuthService } from "../services/auth.service";

export default class AuthController {

    static async registerUser(req: Request, res: Response, next: NextFunction) {
        const { firstName, lastName, email, phone, role, password } = req.body;
        const response = await AuthService.registerUser({ firstName, lastName, email, phone, role, password })
        return new ControllerResponse(res, next).asJSON(response, 'User registered successfully');
    }

    static async loginUser(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        const response = await AuthService.loginUser({ email, password })
        return new ControllerResponse(res, next).asJSON(response, 'Login successfully');
    }
    
}