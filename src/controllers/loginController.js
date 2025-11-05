import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import Customer from "../models/customer.js";
import Farmer from "../models/farmer.js";

// Customer login
export async function loginUser(req, res) {
  try {
    const emailOrPhone = req.body?.email || req.body?.phone;
    const password = req.body?.password;

    if (!emailOrPhone || !password) {
      return res.status(400).send("Email or phone and password are required");
    }

    const user = await Customer.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.send("Correct password");
    }

    return res.send("Invalid Password");
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).send("Server error.");
  }
}

// Farmer login
export async function loginFarmer(req, res) {
  try {
    const emailOrPhone = req.body?.email || req.body?.phoneNumber;
    const password = req.body?.password;

    if (!emailOrPhone || !password) {
      return res
        .status(400)
        .send("Email or phone number and password are required");
    }

    const farmer = await Farmer.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
      },
    });

    if (!farmer) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, farmer.password);
    if (isMatch) {
      return res.send("Correct password");
    }

    return res.send("Invalid Password");
  } catch (err) {
    console.error("loginFarmer error:", err);
    return res.status(500).send("Server error.");
  }
}
