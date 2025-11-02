import express from "express";
import {
  issueToken,
  sendVerificationEmail,
  sendTestSms,
  register,
  login,
} from "../controllers/authController.js";

const router = express.Router();

// Development-only endpoints: token issuance, mocked register/login, and test email/SMS.
if (process.env.NODE_ENV === "development") {
  // POST /api/auth/token
  // Body: { id, role, email }
  // Returns: { token }
  router.post("/token", issueToken);

  // POST /api/auth/send-email
  // Body: { to, subject, text, html }
  router.post("/send-email", sendVerificationEmail);

  // POST /api/auth/send-sms
  // Body: { to, message }
  router.post("/send-sms", sendTestSms);

  // Mocked register/login (development only)
  // POST /api/auth/register  Body: { email, password, role, ... }
  router.post("/register", register);

  // POST /api/auth/login  Body: { email, password }
  router.post("/login", login);
}

export default router;
