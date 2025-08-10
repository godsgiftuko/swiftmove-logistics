import { param, query } from "express-validator";
import { EUserStatus } from "../models/user.model";
import { USER } from "@/constants";

export const validateDriverStatus = [
    query('status')
    .optional()
    .isIn(Object.values(EUserStatus))
    .withMessage(`Invalid driver status. Status must be either ${USER.STATUS.toString()}`),
];

export const validateGetDriver = [
    param('id')
    .isString().withMessage("driverId name must be a string")
    .isMongoId()
    .withMessage('Invalid driver Id'),
];
