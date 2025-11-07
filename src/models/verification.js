import { DataTypes } from "sequelize";
import sequelize from "../config/db_files.js";

const Verification = sequelize.define(
  "Verification",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    customer_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Customers", key: "user_uuid" },
      onDelete: "CASCADE",
    },
    token: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.ENUM("email_verification", "password_reset"), allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    used: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "Verifications",
    timestamps: true,
    indexes: [{ fields: ["customer_uuid", "type"] }, { unique: true, fields: ["token"] }],
  }
);

export default Verification;
