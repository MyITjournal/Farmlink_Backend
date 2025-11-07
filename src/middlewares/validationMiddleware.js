import { validationResult } from "express-validator";

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => ({ field: error.path, message: error.msg }),
});

const validationMiddleware = (req, res, next) => {
  const result = myValidationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: result.array(),
    });
  }
  return next();
};

export default validationMiddleware;
