import { body, param, query } from "express-validator";
import { EDeliveryStatus } from "../models/delivery.model";
import { DELIVERY } from "@/constants";

export const validateNewDelivery = [
  body("customerName")
    .isString().withMessage("Customer name must be a string")
    .notEmpty().withMessage("Customer name is required"),

  body("customerPhone")
    .isMobilePhone('en-NG').withMessage("Invalid customer phone number"),

  body("customerEmail")
    .isEmail().withMessage("Invalid customer email"),

  // Pickup Address
  body("pickupAddress.street").isString().notEmpty().withMessage("Pickup street is required"),
  body("pickupAddress.city").isString().notEmpty().withMessage("Pickup city is required"),
  body("pickupAddress.state").isString().notEmpty().withMessage("Pickup state is required"),
  body("pickupAddress.zipCode").isPostalCode("any").withMessage("Invalid pickup ZIP code"),
  body("pickupAddress.coordinates.lat").isFloat({ min: -90, max: 90 }).withMessage("Pickup latitude must be valid"),
  body("pickupAddress.coordinates.lng").isFloat({ min: -180, max: 180 }).withMessage("Pickup longitude must be valid"),

  // Destination Address
  body("destinationAddress.street").isString().notEmpty().withMessage("Destination street is required"),
  body("destinationAddress.city").isString().notEmpty().withMessage("Destination city is required"),
  body("destinationAddress.state").isString().notEmpty().withMessage("Destination state is required"),
  body("destinationAddress.zipCode").isPostalCode("any").withMessage("Invalid destination ZIP code"),
  body("destinationAddress.coordinates.lat").isFloat({ min: -90, max: 90 }).withMessage("Destination latitude must be valid"),
  body("destinationAddress.coordinates.lng").isFloat({ min: -180, max: 180 }).withMessage("Destination longitude must be valid"),

  // Priority
  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),

  // Estimated delivery date
  body("estimatedDeliveryDate")
    .isISO8601().withMessage("Estimated delivery date must be a valid date"),

  // Notes
  body("notes")
    .optional()
    .isString().withMessage("Notes must be a string"),
];

export const validateAssignDriver = [
  body("driverId")
    .isString().withMessage("driverId name must be a string")
    .isMongoId()
    .withMessage('Invalid driver Id'),

    param('id')
    .isMongoId()
    .withMessage('Invalid delivery Id'),
];


export const validateDeliveryStatus = [
  query('status')
  .optional()
  .isIn(Object.values(EDeliveryStatus))
  .withMessage(`Invalid delivery status. Status must be either ${DELIVERY.STATUS.toString()}`),
];