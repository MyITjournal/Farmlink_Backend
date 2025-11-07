import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Customer = sequelize.define(
  "Customer",
  {
    user_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
      references: { model: "Users", key: "user_uuid" },
    },
    // If you want relationship to a favorite/primary farmer, you can add another FK (optional)
    favoriteFarmerUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Farmers", key: "user_uuid" },
    },
  },
  { tableName: "Customers", timestamps: true }
);

export default Customer;
