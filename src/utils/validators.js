import { body } from "express-validator";

const allowedRoles = ["customer", "farmer", "admin"];

export const tokenValidator = [
  body("id").trim().notEmpty().withMessage("id is required"),
  body("role").notEmpty().isIn(allowedRoles).withMessage(`role must be one of ${allowedRoles.join(", ")}`),
  body("email").optional().isEmail().withMessage("Valid email is required").normalizeEmail(),
];

export const sendEmailValidator = [
  body("to").isEmail().withMessage("Recipient email is required").normalizeEmail(),
  body("subject").optional().isString(),
  body("text").optional().isString(),
  body("html").optional().isString(),
];

export const sendSmsValidator = [
  body("to").trim().notEmpty().withMessage("Phone number is required"),
  body("message").trim().notEmpty().withMessage("Message is required"),
];

export const registrationValidator = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("role").notEmpty().isIn(["customer", "farmer"]).withMessage("Role must be 'customer' or 'farmer'"),
];

export const loginValidator = [
  body("email").optional().isEmail().normalizeEmail(),
  body("phone").optional().notEmpty(),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) throw new Error("Email or phone is required");
    return true;
  }),
  body("password").notEmpty().withMessage("Password is required"),
  body("role").notEmpty().isIn(allowedRoles).withMessage(`role must be one of ${allowedRoles.join(", ")}`),
];

export const verificationRequestValidator = [
  body("customerId").notEmpty().withMessage("customerId is required"),
  body("type").notEmpty().withMessage("type is required"),
];

export const verifyTokenValidator = [body("token").notEmpty().withMessage("token is required")];

export const rateFarmerValidator = [
  body("farmerId").notEmpty().withMessage("farmerId is required"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("rating must be between 1 and 5"),
];

export const addListingValidator = [
  body("productName").trim().notEmpty().withMessage("productName is required"),
  body("pricePerUnit").isFloat({ gt: 0 }).withMessage("pricePerUnit must be greater than 0"),
  body("quantity").isFloat({ gt: 0 }).withMessage("quantity must be greater than 0"),
  body("category")
    .notEmpty()
    .isIn(["Grains", "Vegetables", "Fruits", "Livestock", "Others"])
    .withMessage("Invalid category"),
];
