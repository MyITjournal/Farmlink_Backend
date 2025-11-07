import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Produce = sequelize.define(
  "Produce",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    farmer_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Farmers", key: "user_uuid" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    productName: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.ENUM("Grains", "Vegetables", "Fruits", "Livestock", "Others"), allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0.01 } },
    pricePerUnit: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0.01 } },
    harvestDate: { type: DataTypes.DATEONLY, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    imageUrls: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "[]",
      get() {
        try {
          const v = this.getDataValue("imageUrls");
          return v ? JSON.parse(v) : [];
        } catch {
          return [];
        }
      },
      set(val) {
        this.setDataValue("imageUrls", JSON.stringify(val || []));
      },
    },
    status: { type: DataTypes.ENUM("Active", "Deactivated", "SoldOut"), defaultValue: "Active" },
  },
  { tableName: "ProduceListings", timestamps: true }
);

export default Produce;
