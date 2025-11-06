import { DataTypes } from "sequelize";
import sequelize from "../config/db_files.js";
import User from "./user.js";
import Farmer from "./farmer.js";

const Customer = sequelize.define(
  "Customer",
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "user_uuid",
      },
      unique: true,
      primaryKey: true,
    },
    farmerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Farmer,
        key: "userId",
      },
    },
  },
  {
    tableName: "Customers",
    timestamps: true,
  }
);

export default Customer;
