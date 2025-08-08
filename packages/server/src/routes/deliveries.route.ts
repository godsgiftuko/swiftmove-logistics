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

const router = Router();

router.post(
  "/",
  restrictTo(["admin", "agent"]),
  expressValidate(validateNewDelivery),
  DeliveryController.createDelivery
);
router.get("/", restrictTo(["admin"]), DeliveryController.listAllDeliveries);
router.put(
  "/:id/assign",
  restrictTo(["admin", "agent"]),
  expressValidate(validateAssignDriver),
  expressValidate(validateDeliveryStatus),
  checkDriverAvailability,
  assignOnlyDriver,
  DeliveryController.assignDriver
);

export default router;
