import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import models from "../models/index.js";

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attempt to fetch user from DB based on role/id. If DB isn't available,
      // fall back to token payload.
      try {
        const role = decoded.role;
        const id = decoded.id;

        if (role && id && models) {
          let dbUser = null;

          if (
            role === "customer" &&
            models.Customer &&
            typeof models.Customer.findByPk === "function"
          ) {
            dbUser = await models.Customer.findByPk(id, {
              attributes: { exclude: ["password"] },
            });
          } else if (
            role === "farmer" &&
            models.Farmer &&
            typeof models.Farmer.findByPk === "function"
          ) {
            dbUser = await models.Farmer.findByPk(id, {
              attributes: { exclude: ["password"] },
            });
          } else if (
            role === "admin" &&
            models.Admin &&
            typeof models.Admin.findByPk === "function"
          ) {
            dbUser = await models.Admin.findByPk(id, {
              attributes: { exclude: ["password"] },
            });
          }

          if (dbUser) {
            // attach DB user (plain object)
            req.user = dbUser;
            return next();
          }
          // If role was customer but user not found, deny.
          if (role === "customer") {
            return res
              .status(401)
              .json({ success: false, message: "User not found" });
          }
        }
      } catch (dbErr) {
        // DB not available or lookup failed — fall back to token payload
        console.warn(
          "DB lookup failed in auth middleware, falling back to token payload:",
          dbErr.message || dbErr
        );
      }

      // Add decoded token info to request object (without password)
      req.user = decoded;

      next();
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

export { protect };
