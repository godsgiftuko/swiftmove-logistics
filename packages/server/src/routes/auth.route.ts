import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { adminLoginValidation, newUserValidation, userLoginValidation } from "../validators/auth.validator";
import { expressValidate } from "../middlewares/validation.middleware";

const router = Router();

router.post("/register", expressValidate(newUserValidation), AuthController.registerUser);
router.post("/login", expressValidate(userLoginValidation), AuthController.loginUser);
router.post("/admin/login", expressValidate(adminLoginValidation), AuthController.loginAdminUser);

export default router;
