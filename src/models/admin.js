import { DataTypes } from "sequelize";
import sequelize from "../config/db_files.js";
import Farmer from "./farmer.js";

const Admin = sequelize.define("Admin", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: Farmer,
      key: "id",
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

// Define a one-to-one relationship
Admin.belongsTo(Farmer, { foreignKey: "id" });
Farmer.hasOne(Admin, { foreignKey: "id" });

export default Admin;
