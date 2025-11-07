import { Op } from "sequelize";
import User from "../models/user.js";
import Customer from "../models/customer.js";
import Farmer from "../models/farmer.js";
import auth from "../utils/auth.js";
import AppError from "../utils/AppError.js";
import models from "../models/index.js";

export async function createUser({ email, password, firstName, lastName, phone, address, city, state, country, nin, role }) {
  const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { phoneNumber: phone }] } });
  if (existingUser) throw new AppError("Email or phone already exists", 400);

  // role normalization
  const normalizedRole = (role || "customer").toLowerCase();
  if (!["customer", "farmer"].includes(normalizedRole)) throw new AppError("Invalid role", 400);

  // Create user, password hashing is done in model hook
  const newUser = await User.create({
    email,
    password,
    phoneNumber: phone,
    firstName,
    lastName,
    address,
    city,
    state,
    country,
    nin,
    role: normalizedRole,
  });

  let profile;
  if (normalizedRole === "customer") {
    profile = await Customer.create({ user_uuid: newUser.user_uuid });
  } else if (normalizedRole === "farmer") {
    profile = await Farmer.create({ user_uuid: newUser.user_uuid, farmName: `${firstName} ${lastName}'s Farm`, verificationStatus: "Pending" });
  }

  const userResponse = newUser.toJSON();
  delete userResponse.password;

  return { ...userResponse, profile };
}

export async function logUserIntoApp({ email, phone, password, role }) {
  if (!password) throw new AppError("Password is required", 400);
  if (!email && !phone) throw new AppError("Email or phone is required", 400);
  if (!role) throw new AppError("Role is required", 400);

  const normalizedRole = role.toLowerCase();
  const user = await User.findOne({
    where: { [Op.and]: [{ [Op.or]: [{ email }, { phoneNumber: phone }] }, { role: normalizedRole }] },
    include: [{ model: normalizedRole === "customer" ? Customer : Farmer, as: normalizedRole }],
  });

  if (!user) throw new AppError("Invalid credentials", 401);
  const isMatch = await user.verifyPassword(password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const token = auth.generateToken(user);
  const loginResponse = user.toJSON();
  delete loginResponse.password;

  return { token, user: loginResponse };
}

export async function getUserProfile(userId, userRole) {
  const normalizedRole = (userRole || "").toLowerCase();
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
    include: [{ model: normalizedRole === "customer" ? Customer : Farmer, as: normalizedRole, required: false }],
  });
  if (!user) throw new AppError("User not found", 404);

  const userData = user.toJSON();
  // flatten profile properties into user response
  const profileData = userData[normalizedRole];
  if (profileData) {
    delete userData[normalizedRole];
    Object.assign(userData, profileData);
  }
  return userData;
}

export async function changeUserPassword(userId, currentPassword, newPassword) {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found", 404);
  const isMatch = await user.verifyPassword(currentPassword);
  if (!isMatch) throw new AppError("Current password is incorrect", 401);
  user.password = newPassword; // hashed in hook
  await user.save();
  return true;
}

// placeholder OTP functions — implement using emailService/smsService
export async function sendEmailOTP(email) {
  // create token and send email
  return true;
}
export async function verifyUserOTP(email, otp) {
  return true;
}
