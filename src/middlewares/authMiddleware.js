import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import models from "../models/index.js";

dotenv.config();

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { role, id } = decoded;
    let dbUser = null;

    // Attempt DB lookup based on role
    if (models && role && id) {
      const roleMap = {
        customer: models.Customer,
        farmer: models.Farmer,
        admin: models.Admin,
      };

      const Model = roleMap[role];

      if (Model && typeof Model.findByPk === "function") {
        dbUser = await Model.findByPk(id, {
          attributes: { exclude: ["password"] },
        });
      }
    }

    // Attach user if found, otherwise fallback to token payload
    if (dbUser) {
      req.user = dbUser;
    } else if (role === "customer") {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    } else {
      // fallback if DB not available
      req.user = decoded;
    }

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

export { protect };
