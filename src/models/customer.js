import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db_files.js";

class Customer extends Model {} 
Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },


    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Nigeria",
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("customer", "admin"),
      defaultValue: "customer",
    },

    nin: {
      type: DataTypes.INTEGER,
    },

    accountStatus: {
      type: DataTypes.ENUM("active", "suspended", "deleted"),
      defaultValue: "active",
    },

  },
  {
    sequelize,
    tableName: "Customers",
    timestamps: true,
  }
);

export default Customer;
