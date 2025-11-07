import { Sequelize } from "sequelize";
import config from "./index.js";

const sequelize = new Sequelize(
  config.DATABASE_NAME,
  config.DATABASE_USERNAME,
  config.DATABASE_PASSWORD,
  {
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT || 3306,
    dialect: config.DATABASE_DIALECT || "mysql",
    logging: config.NODE_ENV === "development" ? console.log : false,
    dialectOptions:
      config.NODE_ENV !== "development"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectDB = async () => {
  try {
    console.log(`Attempting to connect to database: ${config.DATABASE_NAME}`);
    await sequelize.authenticate();
    console.log(`Connected to ${config.DATABASE_NAME}`);
    return sequelize;
  } catch (error) {
    const msg = error?.message || String(error);
    console.error("Database connection failed:", msg);

    // If DB does not exist, try to create it (MySQL)
    if (msg.includes("Unknown database") || msg.includes("does not exist")) {
      console.warn("Database not found. Attempting to create...")

      try {
        const tmp = new Sequelize({
          host: config.DATABASE_HOST,
          port: config.DATABASE_PORT || 3306,
          username: config.DATABASE_USERNAME,
          password: config.DATABASE_PASSWORD,
          dialect: config.DATABASE_DIALECT || "mysql",
          logging: false,
        });

        await tmp.authenticate();
        await tmp.query(`CREATE DATABASE IF NOT EXISTS \`${config.DATABASE_NAME}\`;`);
        await tmp.close();

        await sequelize.authenticate();
        console.log(` Database ${config.DATABASE_NAME} created and connected`);
        return sequelize;
      } catch (createErr) {
        console.error(" Failed to create database:", createErr?.message || createErr);
        process.exit(1)
      }
    }

    process.exit(1);
  }
};

export default sequelize;
