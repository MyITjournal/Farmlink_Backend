import { DataTypes } from "sequelize";
import sequelize from "../config/db_files.js";

const Admin = sequelize.define(
  "Admin",
  {
    user_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      unique: true,
      references: { model: "Users", key: "user_uuid" },
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: { canVerify: true, canBlockUser: true, canRemoveListing: true, canViewAnalytics: true },
    },
    lastLogin: { type: DataTypes.DATE, allowNull: true },
  },
  { timestamps: true, tableName: "Admins" }
);

export default Admin;
