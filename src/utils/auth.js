import jwt from "jsonwebtoken";
import config from "../config/index.js";
import AppError from "./AppError.js";

function generateToken(user) {
  if (!config.JWT_SECRET) throw new AppError("Missing JWT secret", 500);
  const payload = { id: user.user_uuid, fullName: user.fullName, role: user.role };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }
}

function generateRefreshToken(user, tokenId) {
  if (!config.JWT_REFRESH_SECRET) throw new AppError("Missing JWT refresh secret", 500);
  const payload = { id: user.user_uuid, fullName: user.fullName, role: user.role, tokenId };
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_EXPIRES_IN });
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }
}

export default { generateToken, verifyToken, generateRefreshToken, verifyRefreshToken };
