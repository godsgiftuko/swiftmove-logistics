import { body } from "express-validator";
import { EUserRole } from "../models/user.model";

// New user validation
export const newUserValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name must not exceed 50 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name must not exceed 50 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#^()-_+=]{6,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Phone number must be a valid international format"),

  body("role")
    .exists()
    .withMessage("Role is required")
    .isString()
    .withMessage("Role must be a string")
    .isIn(Object.values(EUserRole))
    .withMessage(`Role must be one of: ${Object.values(EUserRole).join(", ")}`),
];
