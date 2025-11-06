import { DataTypes } from "sequelize";
import sequelize from "../config/db_files.js";
import User from "./user.js";

const Farmer = sequelize.define(
  "Farmer",
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User,
        key: "user_uuid",
      },
      unique: true,
    },
    farmName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    farmType: {
      type: DataTypes.ENUM("Crop", "Livestock", "Mixed"),
      allowNull: true,
      defaultValue: "Mixed",
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verificationStatus: {
      type: DataTypes.ENUM("Pending", "Verified", "Rejected"),
      defaultValue: "Pending",
    },
  },
  {
    timestamps: true,
    tableName: "Farmers",
  }
);

export default Farmer;
