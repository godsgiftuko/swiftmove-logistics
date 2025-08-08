import { Request, Response } from "express";
import { ControllerResponse } from "../helpers/controller";
import { AuthService } from "../services/auth.service";

export default class AuthController {

    static async registerUser(req: Request, res: Response) {
        const { firstName, lastName, email, phone, role, password } = req.body;
        const response = await AuthService.registerUser({ firstName, lastName, email, phone, role, password })
        return new ControllerResponse(res).asJSON(response);
    }
    
}