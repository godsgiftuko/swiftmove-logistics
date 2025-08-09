import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { adminLoginValidation, newUserValidation, userLoginValidation } from "../validators/auth.validator";
import { expressValidate } from "../middlewares/validation.middleware";
import UserController from "../controllers/user.controller";
import { restrictTo } from "../middlewares/auth.middleware";

const router = Router();

router.get("/stats", restrictTo(["admin"]), UserController.fetchStats);

export default router;
