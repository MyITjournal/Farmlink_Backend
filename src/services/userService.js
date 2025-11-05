import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import Customer from "../models/customer.js";
import Farmer from "../models/farmer.js";
import generateToken from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";

export async function createUser({ username, email, password, firstName, lastName, phone, address, city, state, nin, role }) {
  // Check if user already exists
  const existingCustomer = await Customer.findOne({
    where: { [Op.or]: [{ email }, { username }] },
  });
  const existingFarmer = await Farmer.findOne({
    where: { [Op.or]: [{ email }, { username }] },
  });

  if (existingCustomer || existingFarmer) {
    throw new AppError("Email or username already exists", 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  const fullName = `${firstName} ${lastName}`;

  let newUser;
  if (role === "customer") {
    newUser = await Customer.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      state,
      nin,
      fullName,
    });
  } else if (role === "farmer") {
    newUser = await Farmer.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      state,
      nin,
      fullName,
      verificationStatus: "Pending",
    });
  } else {
    throw new AppError("Invalid role. Must be 'customer' or 'farmer'", 400);
  }

  // Remove password from response
  delete newUser.dataValues.password;
  return newUser;
}

export async function logUserIntoApp({ email, phone, password, role }) {
  const emailOrPhone = email || phone;

  if (!emailOrPhone || !password || !role) {
    throw new AppError("Email/phone, password, and role are required", 400);
  }

  let user;
  if (role === "customer") {
    user = await Customer.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });
  } else if (role === "farmer") {
    user = await Farmer.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });
  } else {
    throw new AppError("Invalid role. Must be 'customer' or 'farmer'", 400);
  }

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({
    id: user.id,
    role: role,
    email: user.email,
  });

  // Remove password from response
  delete user.dataValues.password;

  const userResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role: role,
  };

  // Add farmer-specific fields if role is farmer
  if (role === "farmer" && user.verificationStatus) {
    userResponse.verificationStatus = user.verificationStatus;
  }

  return {
    token,
    user: userResponse,
  };
}

export async function getUserProfile(userId, userRole) {
  let user;
  if (userRole === "customer") {
    user = await Customer.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });
  } else if (userRole === "farmer") {
    user = await Farmer.findByPk(userId, {
      attributes: { exclude: ["password"] }
    });
  }

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    ...user.dataValues,
    role: userRole,
  };
}