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
  listMyDeliveries,
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
// router.get("/all", restrictTo(["admin"]), expressValidate(validateDeliveryStatus), paginate(Delivery), DeliveryController.listAllDeliveries);
router.get("/", expressValidate(validateDeliveryStatus), listMyDeliveries, paginate(Delivery), DeliveryController.listAllDeliveries);
router.put(
  "/:id/assign",
  restrictTo(["admin", "manager"]),
  expressValidate(validateAssignDriver),
  expressValidate(validateDeliveryStatus),
  checkDriverAvailability,
  assignOnlyDriver,
  DeliveryController.assignDriver
);
router.get("/stats", restrictTo(["admin", "manager"]), listMyDeliveries, DeliveryController.fetchStats);


export default router;
