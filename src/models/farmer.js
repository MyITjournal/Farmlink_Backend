import { DataTypes } from "sequelize";
import sequelize from "../config/db_files.js";

const Farmer = sequelize.define(
  "Farmer",
  {
    user_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: { model: "Users", key: "user_uuid" },
      unique: true,
    },
    farmName: { type: DataTypes.STRING, allowNull: true },
    farmType: { type: DataTypes.ENUM("Crop", "Livestock", "Mixed"), allowNull: true, defaultValue: "Mixed" },
    bio: { type: DataTypes.TEXT, allowNull: true },
    verificationStatus: { type: DataTypes.ENUM("Pending", "Verified", "Rejected"), defaultValue: "Pending" },
    rating: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 },
    isBlocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { timestamps: true, tableName: "Farmers" }
);

export default Farmer;
