import express from "express";
import {
  loginUser,
  registerUser,
  userProfile,
  changePassword,
  getEmailOTP,
  verifyEmailOTP,
} from "../controllers/authController.js";
import { registrationValidator, loginValidator } from "../utils/Validators.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  registrationValidator,
  validationMiddleware,
  registerUser
);
router.post("/login", loginValidator, validationMiddleware, loginUser);
router.get("/profile", authMiddleware, userProfile);
router.post("/change-password", authMiddleware, changePassword);
router.post("/email-otp", getEmailOTP);
router.post("/verify-email-otp", verifyEmailOTP);

export default router;
