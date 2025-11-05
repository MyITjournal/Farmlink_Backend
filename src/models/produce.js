import { DataTypes } from "sequelize";
import sequelize from "../config/db_files.js";
import Farmer from "./farmer.js";

/**
 * Defines the Produce Listing model structure for the MySQL database.
 * This table stores all marketable products listed by farmers.
 */
const Produce = sequelize.define("Produce", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  farmerId: {
    type: DataTypes.UUID,
    references: {
      model: Farmer,
      key: "id",
    },
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    // Matches the dropdown on Add/Edit Product Page
    type: DataTypes.ENUM(
      "Grains",
      "Vegetables",
      "Fruits",
      "Livestock",
      "Others"
    ),
    allowNull: false,
  },
  quantity: {
    // Stored in a unified base unit (e.g., kg or unit)
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  pricePerUnit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  harvestDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrls: {
    // Stored as a JSON string of image URLs
    type: DataTypes.TEXT,
    get() {
      try {
        return JSON.parse(this.getDataValue("imageUrls"));
      } catch (e) {
        return [];
      }
    },
  },
  status: {
    // Used for listing visibility/availability
    type: DataTypes.ENUM("Active", "Deactivated", "SoldOut"),
    defaultValue: "Active",
  },
});

// Define the relationship: A Farmer can have many Produce listings
Farmer.hasMany(Produce, { foreignKey: "farmerId" });
Produce.belongsTo(Farmer, { foreignKey: "farmerId" });

export default Produce;
