import sequelize from "../config/db_files.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

const User = sequelize.define(
  "User",
  {
    user_uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
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
    nin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("customer", "farmer", "admin"),
      allowNull: false,
      defaultValue: "customer",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (!user.firstName || !user.lastName) {
          throw new Error("firstName and lastName are required");
        }

        if (user.email) {
          user.email = user.email.toLowerCase();
        }

        user.fullName = `${user.firstName.trim()} ${user.lastName.trim()}`;

        if (user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("email")) {
          user.email = user.email.toLowerCase();
        }
        if (user.changed("firstName") || user.changed("lastName")) {
          user.fullName = `${user.firstName} ${user.lastName}`;
        }
        if (user.changed("password") && user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["user_uuid"],
      },
      {
        unique: true,
        fields: ["email"],
      },
      {
        unique: true,
        fields: ["phoneNumber"],
      },
    ],
  }
);

User.prototype.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default User;
