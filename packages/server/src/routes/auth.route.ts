import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { newUserValidation, userLoginValidation } from "../validators/auth.validator";
import { expressValidate } from "../middlewares/validation.middleware";

const router = Router();

router.post("/register", expressValidate(newUserValidation), AuthController.registerUser);
router.post("/login", expressValidate(userLoginValidation), AuthController.loginUser);

export default router;
