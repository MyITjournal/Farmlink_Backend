import { Op } from "sequelize";
import User from "../models/user.js";
import Customer from "../models/customer.js";
import Farmer from "../models/farmer.js";
import auth from "../utils/auth.js";
import AppError from "../utils/AppError.js";

export async function createUser({
  email,
  password,
  firstName,
  lastName,
  phone,
  address,
  city,
  state,
  nin,
  role,
}) {
  // Check if user already exists
  const existingUser = await User.findOne({
    where: { [Op.or]: [{ email }, { phoneNumber: phone }] },
  });

  if (existingUser) {
    throw new AppError("Email or phone already exists", 400);
  }

  const newUser = await User.create({
    email,
    password,
    phoneNumber: phone,
    firstName,
    lastName,
    address,
    city,
    state,
    nin,
    role,
  });

  // Create role-specific profile
  let profile;
  if (role === "customer") {
    profile = await Customer.create({
      userId: newUser.user_uuid,
    });
  } else if (role === "farmer") {
    profile = await Farmer.create({
      userId: newUser.user_uuid,
      farmName: `${firstName} ${lastName}'s Farm`, // Auto-generate farm name
      verificationStatus: "Pending",
    });
  } else {
    throw new AppError("Invalid role. Must be 'customer' or 'farmer'", 400);
  }

  // Return user without password
  const userResponse = newUser.toJSON();
  delete userResponse.password;

  return {
    ...userResponse,
    profile,
  };
}

export async function logUserIntoApp({ email, phone, password, role }) {
  const emailOrPhone = email || phone;

  if (!emailOrPhone || !password || !role) {
    throw new AppError("Email/phone, password, and role are required", 400);
  }

  // Find user by email or phone
  const user = await User.findOne({
    where: {
      [Op.and]: [
        { [Op.or]: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }] },
        { role: role },
      ],
    },
    include: [
      {
        model: role === "customer" ? Customer : Farmer,
        as: role,
        required: false,
      },
    ],
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await user.verifyPassword(password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = await auth.generateToken({
    user_uuid: user.user_uuid,
    fullName: user.fullName,
    role: user.role,
  });

  const loginResponse = user.toJSON();
  delete loginResponse.password;

  return {
    token,
    user: loginResponse,
  };
}

export async function getUserProfile(userId, userRole) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
    include: [
      {
        model: userRole === "customer" ? Customer : Farmer,
        as: userRole,
        required: false,
      },
    ],
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const userData = user.toJSON();
  const profileData = userData[userRole];

  if (profileData) {
    delete userData[userRole];

    const {
      id: profileId,
      userId: profileUserId,
      createdAt: profileCreatedAt,
      updatedAt: profileUpdatedAt,
      ...relevantProfileData
    } = profileData;
    Object.assign(userData, relevantProfileData);
  }

  return userData;
}
