import generateToken from "../utils/generateToken.js";
import emailService from "../utils/emailService.js";
import smsService from "../utils/smsService.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// In-memory mocked users store for development/testing only
const mockUsers = new Map(); // key: email -> user object

/**
 * Issue a development token for testing middleware.
 * This endpoint is intentionally simple: it accepts { id, role, email }
 * and returns a signed JWT. In production, replace this with a real
 * login flow that verifies credentials against your database.
 */
const issueToken = (req, res) => {
  const { id, role, email } = req.body || {};
  if (!id || !role || !email) {
    return res
      .status(400)
      .json({
        success: false,
        message: "id, role and email are required in body",
      });
  }

  try {
    const token = generateToken({ id, role, email });
    return res.json({ success: true, token });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message || "Token generation failed",
      });
  }
};

/**
 * Send verification email (development-friendly). Expects body: { to, subject, text, html }
 */
const sendVerificationEmail = async (req, res) => {
  const { to, subject, text, html } = req.body || {};
  if (!to || (!text && !html)) {
    return res
      .status(400)
      .json({ success: false, message: "to and text/html required" });
  }

  try {
    const info = await emailService.sendEmail({
      to,
      subject: subject || "Verification",
      text,
      html,
    });
    return res.json({ success: true, info });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Email sending failed" });
  }
};

/**
 * Send SMS (development placeholder). Body: { to, message }
 */
const sendTestSms = async (req, res) => {
  const { to, message } = req.body || {};
  if (!to || !message)
    return res
      .status(400)
      .json({ success: false, message: "to and message required" });

  try {
    const result = await smsService.sendSms({ to, message });
    return res.json({ success: true, result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "SMS sending failed" });
  }
};

/**
 * Mocked register endpoint (no DB).
 * Body: { email, password, role, ...profile }
 */
const register = async (req, res) => {
  const { email, password, role, ...profile } = req.body || {};
  if (!email || !password || !role)
    return res
      .status(400)
      .json({
        success: false,
        message: "email, password and role are required",
      });

  if (mockUsers.has(email))
    return res
      .status(409)
      .json({ success: false, message: "User already exists (mock store)" });

  const hashed = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();
  const user = { id, email, password: hashed, role, ...profile };
  mockUsers.set(email, user);

  const token = generateToken({
    id: user.id,
    role: user.role,
    email: user.email,
  });

  return res
    .status(201)
    .json({
      success: true,
      message: "User registered (mock)",
      user: { id: user.id, email: user.email, role: user.role, ...profile },
      token,
    });
};

/**
 * Mocked login endpoint (no DB).
 * Body: { email, password }
 */
const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "email and password required" });

  const user = mockUsers.get(email);
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials (mock)" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials (mock)" });

  const token = generateToken({
    id: user.id,
    role: user.role,
    email: user.email,
  });
  return res.json({
    success: true,
    message: "Logged in (mock)",
    user: { id: user.id, email: user.email, role: user.role },
    token,
  });
};

export { issueToken, sendVerificationEmail, sendTestSms, register, login };
