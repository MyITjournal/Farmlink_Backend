import jwt from "jsonwebtoken";
import config from "../config/index.js";
import models from "../models/index.js";

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, token missing" });
  }

  token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Not authorized, token missing" });

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const { role, id } = decoded;

    // Try fetch user from DB
    if (role && id && models) {
      try {
        const Model = models[role.charAt(0).toUpperCase() + role.slice(1)]; // maps 'farmer' -> Farmer
        if (Model?.findByPk) {
          const dbUser = await Model.findByPk(id, { attributes: { exclude: ["password"] } });
          if (dbUser) {
            req.user = dbUser.toJSON ? dbUser.toJSON() : dbUser;
            return next();
          } else if (role === "customer") {
            return res.status(401).json({ success: false, message: "User not found" });
          }
        }
      } catch (dbErr) {
        if (config.NODE_ENV !== "production") console.warn("DB lookup failed in auth middleware:", dbErr.message);
      }
    }

    // fallback to token payload
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Not authorized, token invalid or expired" });
  }
};

export { protect };
