import express from "express";
import {
  issueToken,
  sendVerificationEmail,
  sendTestSms,
  register,
  login,
} from "../controllers/authController.js";

const router = express.Router();

if (process.env.NODE_ENV === "development") {
  router.post("/token", issueToken);
  router.post("/send-email", sendVerificationEmail);
  router.post("/send-sms", sendTestSms);
  router.post("/register", register);
  router.post("/login", login);
}

export default router;
