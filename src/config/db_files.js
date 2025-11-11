import { Sequelize } from "sequelize";
import config from "./index.js";

// Create Sequelize instance
const sequelize = new Sequelize(
  config.DATABASE_NAME,
  config.DATABASE_USERNAME,
  config.DATABASE_PASSWORD,
  {
    dialect: config.DATABASE_DIALECT,
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    logging: config.ENVIRONMENT === "development" ? console.log : false,
    dialectOptions: {
      ssl: config.ENVIRONMENT === "production" ? {
        require: true,
        rejectUnauthorized: false,
      } : undefined,
    },
    pool: {
      max: config.ENVIRONMENT === "production" ? 2 : 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectDB = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log(`PostgreSQL Connected: ${config.DATABASE_HOST}`);

    // Import models and sync
    await import("../models/index.js");
    await sequelize.sync();
    console.log("Database tables synchronized");

    return sequelize;
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    
    // Exit in development, throw in production (for serverless)
    if (config.ENVIRONMENT !== "production") {
      process.exit(1);
    }
    throw error;
  }
};

export default sequelize;