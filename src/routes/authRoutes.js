import express from "express";
import { loginUser, registerUser, userProfile, changePassword, getEmailOTP, verifyEmailOTP } from "../controllers/authController.js";
import { registrationValidator, loginValidator, sendEmailValidator } from "../utils/validators.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registrationValidator, validationMiddleware, registerUser);
router.post("/login", loginValidator, validationMiddleware, loginUser);
router.get("/profile", protect, userProfile);
router.post("/change-password", protect, changePassword);
router.post("/email-otp", sendEmailValidator, validationMiddleware, getEmailOTP);
router.post("/verify-email-otp", verifyEmailOTP);

export default router;
