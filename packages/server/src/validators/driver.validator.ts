import { query } from "express-validator";
import { EUserStatus } from "../models/user.model";
import { USER } from "@/constants";

export const validateDriverStatus = [
    query('status')
    .optional()
    .isIn(Object.values(EUserStatus))
    .withMessage(`Invalid driver status. Status must be either ${USER.STATUS.toString()}`),
];
