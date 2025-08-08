import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { newUserValidation, userLoginValidation } from "../validators/auth.validator";
import { expressValidate } from "../middlewares/validation.middleware";
import DeliveryController from "../controllers/delivery.controller";
import { restrictTo } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", restrictTo(['admin']), DeliveryController.createDelivery);
router.get("/", restrictTo(['admin']), DeliveryController.listAllDeliveries);
router.get("/assign/:driverId/:deliveryId", restrictTo(['admin']), DeliveryController.assignDriver);

export default router;
