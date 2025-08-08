import { Router } from "express";
import DeliveryController from "../controllers/delivery.controller";
import { restrictTo } from "../middlewares/auth.middleware";
import { validateNewDelivery } from "../validators/delivery.validator";

const router = Router();

router.post("/", restrictTo(['admin', 'agent']), validateNewDelivery, DeliveryController.createDelivery);
router.get("/", restrictTo(['admin']), DeliveryController.listAllDeliveries);
router.put("/:id/assign", restrictTo(['admin']), DeliveryController.assignDriver);

export default router;
