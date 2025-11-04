import bcrypt from "bcrypt";
import Customer from "../models/customer";
import Farmer from "../models/farmer";
import { Op } from "sequelize";

// FOR CUSTOMERS
export async function loginUser(req, res) {
  try {
    const emailORphone = req.body.email || req.body.phone;
    const username = req.body.username;
    const password = req.body.password;
    const user = await Customer.findOne({
      where: { [Op.or]: [{ email: emailORphone }, { phone: emailORphone }] },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.send("Correct password");
    } else {
      res.send("Invalid Password");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
}

// FOR FARMERS

export async function loginFarmer(req, res) {
  try {
    const emailORphone = req.body.email || req.body.phone;
    const username = req.body.username;
    const password = req.body.password;
    const user = await Farmer.findOne({
      where: {
        [Op.or]: [{ email: emailORphone }, { phoneNumber: emailORphone }],
      },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.send("Correct password");
    } else {
      res.send("Invalid Password");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
}
