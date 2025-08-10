import { Router } from "express";
import DriverController from "../controllers/driver.controller";
import { expressValidate } from "../middlewares/validation.middleware";
import { validateDriverStatus } from "../validators/driver.validator";
import { paginate } from "../database/helpers/paginate";
import User from "../models/user.model";
import { listOnlyDrivers } from "../middlewares/user.middleware";

const router = Router();

router.get("/", expressValidate(validateDriverStatus), listOnlyDrivers, paginate(User), DriverController.listDrivers);

export default router;
