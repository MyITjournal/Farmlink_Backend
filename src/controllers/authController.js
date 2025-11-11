import User from "../models/user.js";
import Farmer from "../models/farmer.js";
import Customer from "../models/customer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/index.js";
import AppError from "../utils/AppError.js";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.user_uuid, role: user.role }, config.JWT_SECRET, {
    expiresIn: `${config.JWT_EXPIRES_IN}s`,
  });
};

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role = "customer",
      farmName,
      farmType,
      bio,
      address,
      city,
      state,
    } = req.body;

    // Validate role
    if (!["customer", "farmer"].includes(role)) {
      throw new AppError(
        "!Incorrect role. Choose between 'customer' and 'farmer'",
        400
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    // Create new user
    const newUser = await User.create({
      email,
      password,
      phoneNumber: phone,
      firstName,
      lastName,
      address,
      city,
      state,
      role,
    });

    // Create role-specific profile based on role
    let roleProfile;

    if (role === "farmer") {
      // Create farmer profile with specific requirements
      roleProfile = await Farmer.create({
        userId: newUser.user_uuid,
        farmName: farmName || `${firstName} ${lastName}'s Farm`,
        farmType: farmType || "Mixed",
        bio: bio || null,
        verificationStatus: "Pending",
      });

      return res.status(201).json({
        success: true,
        message:
          "Farmer registered successfully. Your account is pending verification.",
        user: {
          id: newUser.user_uuid,
          name: newUser.fullName,
          email: newUser.email,
          phone: newUser.phoneNumber,
          role: newUser.role,
        },
        farmerProfile: {
          farmName: roleProfile.farmName,
          farmType: roleProfile.farmType,
          verificationStatus: roleProfile.verificationStatus,
        },
        token: generateToken(newUser),
      });
    } else if (role === "customer") {
      // Create customer profile
      roleProfile = await Customer.create({
        userId: newUser.user_uuid,
      });

      return res.status(201).json({
        success: true,
        message: "Customer registered successfully",
        user: {
          id: newUser.user_uuid,
          name: newUser.fullName,
          email: newUser.email,
          phone: newUser.phoneNumber,
          role: newUser.role,
        },
        token: generateToken(newUser),
      });
    }
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new AppError("User not found", 400);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid password", 400);
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user.user_uuid,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Get user profile
export const userProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new AppError("Current password is incorrect", 400);
    }

    // Update password (will be hashed by beforeUpdate hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Get email OTP (placeholder)
export const getEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Verify email OTP (placeholder)
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
