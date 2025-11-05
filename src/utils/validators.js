import { body } from "express-validator";
import validationMiddleware from "../middlewares/validationMiddleware.js";

export const tokenValidator = [
  body("id").notEmpty().withMessage("id is required"),
  body("role").notEmpty().withMessage("role is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  validationMiddleware,
];

export const sendEmailValidator = [
  body("to").isEmail().withMessage("Recipient email is required"),
  body("subject").optional().isString().withMessage("subject must be text"),
  body("text").optional().isString(),
  body("html").optional().isString(),
  validationMiddleware,
];

export const sendSmsValidator = [
  body("to").notEmpty().withMessage("Phone number is required"),
  body("message").notEmpty().withMessage("Message is required"),
  validationMiddleware,
];

export const registrationValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("role").notEmpty().withMessage("Role is required"),
];

export const loginValidator = [
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("phone").optional().notEmpty().withMessage("Phone number is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body("role").notEmpty().withMessage("Role is required"),
];

export const verificationRequestValidator = [
  body("customerId").notEmpty().withMessage("customerId is required"),
  body("type").notEmpty().withMessage("type is required"),
  validationMiddleware,
];

export const verifyTokenValidator = [
  body("token").notEmpty().withMessage("token is required"),
  validationMiddleware,
];

export const rateFarmerValidator = [
  body("farmerId").notEmpty().withMessage("farmerId is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),
  validationMiddleware,
];

export const addListingValidator = [
  body("productName").notEmpty().withMessage("productName is required"),
  body("pricePerUnit")
    .isFloat({ gt: 0 })
    .withMessage("pricePerUnit must be greater than 0"),
  body("quantity")
    .isFloat({ gt: 0 })
    .withMessage("quantity must be greater than 0"),
  body("category").notEmpty().withMessage("category is required"),
  validationMiddleware,
];
