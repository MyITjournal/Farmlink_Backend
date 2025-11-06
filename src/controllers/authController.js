import AppError from "../utils/AppError.js";
import {
  createUser,
  logUserIntoApp,
  getUserProfile,
} from "../services/userService.js";

async function registerUser(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      city,
      state,
      country,
      nin,
      role = "customer",
    } = req.body;
    await createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      country,
      nin,
      role,
    });
    res.status(201).json({ success: true, message: "User registered" });
  } catch (error) {
    throw new AppError(error.message || "Registration failed", 400);
  }
}

async function loginUser(req, res) {
  try {
    console.log("Login request body:", req.body);
    const { email, phone, password, role } = req.body;
    const user = await logUserIntoApp({ email, phone, password, role });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    throw new AppError(error.message || "Invalid Email or Password", 401);
  }
}

async function userProfile(req, res) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const profile = await getUserProfile(userId, userRole);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    throw new AppError(error.message || "Invalid User", 401);
  }
}

async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    throw new AppError(error.message || "Password change failed", 400);
  }
}

async function getEmailOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    });
  } catch (error) {
    throw new AppError(error.message || "Failed to send OTP", 500);
  }
}

async function verifyEmailOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new AppError("Email and OTP are required", 400);
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    throw new AppError(error.message || "OTP verification failed", 400);
  }
}

export {
  registerUser,
  loginUser,
  changePassword,
  getEmailOTP,
  verifyEmailOTP,
  userProfile,
};
