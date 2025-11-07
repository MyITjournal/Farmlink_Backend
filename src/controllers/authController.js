import AppError from "../utils/AppError.js";
import { createUser, logUserIntoApp, getUserProfile, changeUserPassword, sendEmailOTP, verifyUserOTP } from "../services/userService.js";

export async function registerUser(req, res, next) {
  try {
    const { firstName, lastName, email, password, phone, address, city, state, country, nin, role = "customer" } = req.body;

    const created = await createUser({ email, password, firstName, lastName, phone, address, city, state, country, nin, role });
    return res.status(201).json({ success: true, message: "User registered", data: created });
  } catch (error) {
    return next(new AppError(error.message || "Registration failed", error.statusCode || 400));
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, phone, password, role } = req.body;
    const result = await logUserIntoApp({ email, phone, password, role });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(new AppError(error.message || "Invalid Email or Password", error.statusCode || 401));
  }
}

export async function userProfile(req, res, next) {
  try {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const profile = await getUserProfile(req.user.id || req.user.user_uuid, req.user.role);
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return next(new AppError(error.message || "Invalid User", error.statusCode || 401));
  }
}

export async function changePassword(req, res, next) {
  try {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const userId = req.user.id || req.user.user_uuid;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return next(new AppError("Current and new password are required", 400));
    await changeUserPassword(userId, currentPassword, newPassword);
    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return next(new AppError(error.message || "Password change failed", error.statusCode || 400));
  }
}

export async function getEmailOTP(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("Email is required", 400));
    await sendEmailOTP(email);
    return res.status(200).json({ success: true, message: "OTP sent to email successfully" });
  } catch (error) {
    return next(new AppError(error.message || "Failed to send OTP", error.statusCode || 500));
  }
}

export async function verifyEmailOTP(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return next(new AppError("Email and OTP are required", 400));
    await verifyUserOTP(email, otp);
    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return next(new AppError(error.message || "OTP verification failed", error.statusCode || 400));
  }
}
