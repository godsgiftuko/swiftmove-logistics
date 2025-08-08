import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { newUserValidation } from "../validators/auth.validator";
import { expressValidate } from "../middlewares/validation.middleware";

const router = Router();

router.post("/register", expressValidate(newUserValidation), AuthController.registerUser);

export default router;
