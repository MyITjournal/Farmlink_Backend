import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import process from "node:process";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  }
);

// Test the connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL Database via Sequelize");
  } catch (error) {
    console.error("Failed to connect to DB:", error.message);
    process.exit(1);
  }
};

export default sequelize;
