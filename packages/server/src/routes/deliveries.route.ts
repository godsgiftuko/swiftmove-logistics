import { Router } from "express";
import DeliveryController from "../controllers/delivery.controller";
import { restrictTo } from "../middlewares/auth.middleware";
import {
  validateAssignDriver,
  validateDeliveryStatus,
  validateNewDelivery,
} from "../validators/delivery.validator";
import { expressValidate } from "../middlewares/validation.middleware";
import {
  assignOnlyDriver,
  checkDriverAvailability,
} from "../middlewares/delivery.middleware";
import { paginate } from "../database/helpers/paginate";
import Delivery, { IDelivery } from "../models/delivery.model";

const router = Router();

router.post(
  "/",
  restrictTo(["admin", "manager"]),
  expressValidate(validateNewDelivery),
  DeliveryController.createDelivery
);
router.get("/", restrictTo(["admin", "manager"]), expressValidate(validateDeliveryStatus), paginate(Delivery), DeliveryController.listAllDeliveries);
router.put(
  "/:id/assign",
  restrictTo(["admin", "manager"]),
  expressValidate(validateAssignDriver),
  expressValidate(validateDeliveryStatus),
  checkDriverAvailability,
  assignOnlyDriver,
  DeliveryController.assignDriver
);
router.get("/stats", DeliveryController.fetchStats);


export default router;
