import express from "express";
import {
  issueToken,
  sendVerificationEmail,
  sendTestSms,
  register,
  login,
} from "../controllers/authController.js";
import {
  tokenValidator,
  sendEmailValidator,
  sendSmsValidator,
  authRegisterValidator,
  authLoginValidator,
} from "../utils/validators.js";

const router = express.Router();

router.post("/token", tokenValidator, issueToken);
router.post("/send-email", sendEmailValidator, sendVerificationEmail);
router.post("/send-sms", sendSmsValidator, sendTestSms);
router.post("/register", authRegisterValidator, register);
router.post("/login", authLoginValidator, login);

export default router;
