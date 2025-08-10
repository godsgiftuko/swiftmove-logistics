import { body } from "express-validator";
import { EUserRole } from "../models/user.model";
import { USER } from "../../../shared/constants";

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
    .isLength({ min: USER.MIN_PASSWORD_LENGTH })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#^()-_+=]{6,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  // body("confirmPassword")
    // .notEmpty()
    // .withMessage("Confirm password is required")
    // .custom((value, { req }) => {
    //   if (value !== req.body.password) {
    //     throw new Error("Passwords do not match");
    //   }
    //   return true;
    // }),

  body("phone")
    .notEmpty()
    .isString()
    .withMessage("Phone number is required"),

  body("role")
    .exists()
    .withMessage("Role is required")
    .isString()
    .withMessage("Role must be a string")
    .isIn(Object.values(EUserRole))
    .withMessage(`Role must be one of: ${Object.values(EUserRole).join(", ")}`),
];

// user login validation
export const userLoginValidation = [
  body('email')
    .if(body('phone').not().exists()) // only check email if phone is missing
    .isEmail()
    .withMessage('Valid email is required if phone is not provided'),

  body('phone')
    .if(body('email').not().exists()) // only check phone if email is missing
    .isString()
    .withMessage('Valid phone number is required if email is not provided'),

  body("password")
    .notEmpty()
    .withMessage(
      "Please enter your password "
    )
];

// admin login validation
export const adminLoginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter your mail'),

  body("password")
    .notEmpty()
    .withMessage(
      "Please enter your password "
    )
];
