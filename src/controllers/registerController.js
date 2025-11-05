import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import Farmer from "../models/farmer.js";
import Customer from "../models/customer.js";
export async function registerCustomer(req, res) {
  try {
    const {
      username,
      firstName,
      email,
      password,
      lastName,
      phone,
      address,
      city,
      state,
      nin,
    } = req.body;
    const fullName = `${firstName} ${lastName}`;

    if (!username || !email || !password || !phone || !firstName || !lastName) {
      return res.status(400).send("these fields are required.");
    }
    const existingUser = await Customer.findOne({
      where: { [Op.or]: [{ email }, { username }, { email }] },
    });
    if (existingUser) {
      return res.status(400).send("User already exist.");
    }

    const hashedPassword = await bcrypt.hash(password, 13);
    const newUser = await Customer.create({
      username,
      firstName,
      email,
      password: hashedPassword,
      lastName,
      phone,
      address,
      city,
      state,
      nin,
      fullName,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Server error.");
  }
}

export async function registerFarmer(req, res) {
  try {
    const {
      username,
      firstName,
      email,
      password,
      lastName,
      phone,
      address,
      city,
      state,
      nin,
    } = req.body;
    const fullName = `${firstName} ${lastName}`;

    if (!username || !email || !password || !phone || !firstName || !lastName) {
      return res.status(400).send("these fields are required.");
    }
    const existingUser = await Customer.findOne({
      where: { [Op.or]: [{ email }, { username }, { email }] },
    });
    if (existingUser) {
      return res.status(400).send("User already exist.");
    }

    const hashedPassword = await bcrypt.hash(password, 13);
    const newUser = await Farmer.create({
      username,
      firstName,
      email,
      password: hashedPassword,
      lastName,
      phone,
      address,
      city,
      state,
      nin,
      fullName,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Server error.");
  }
}
