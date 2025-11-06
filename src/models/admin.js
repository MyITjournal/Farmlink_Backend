import { DataTypes } from "sequelize";
import sequelize from "../config/db_files.js";
import Farmer from "./farmer.js";

const Admin = sequelize.define("Admin", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: Farmer,
      key: "userId",
    },
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      canVerify: true,
      canBlockUser: true,
      canRemoveListing: true,
      canViewAnalytics: true,
    },
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default Admin;
