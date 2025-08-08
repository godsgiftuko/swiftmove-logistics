import { Router } from "express";
import DriverController from "../controllers/driver.controller";
import { expressValidate } from "../middlewares/validation.middleware";
import { validateDriverStatus } from "../validators/driver.validator";

const router = Router();

router.get("/", expressValidate(validateDriverStatus), DriverController.listDrivers);

export default router;
