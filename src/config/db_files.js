import { Sequelize } from "sequelize";
import config from "./index.js";

// Create the main sequelize instance
const sequelize = new Sequelize(
  config.DATABASE_NAME,
  config.DATABASE_USERNAME,
  config.DATABASE_PASSWORD,
  {
    dialect: config.DATABASE_DIALECT,
    dialectOptions: {
      ssl: {
        require: config.ENVIRONMENT !== "development",
        rejectUnauthorized: false,
      },
    },
    port: config.DATABASE_PORT,
    host: config.DATABASE_HOST,
    logging:
      config.ENVIRONMENT === "development" ? (msg) => console.log(msg) : false,
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

    // Try to connect to the target database using the global sequelize instance
    await sequelize.authenticate();
    console.log(`Connected to ${config.DATABASE_NAME} successfully`);

    return await syncDatabase(sequelize);
  } catch (error) {
    // If database doesn't exist, create it
    if (
      error.message.includes("Unknown database") ||
      (error.message.includes("database") &&
        error.message.includes("does not exist"))
    ) {
      console.log(
        `Database '${config.DATABASE_NAME}' doesn't exist. Creating it...`
      );

      const sequelize = await createDatabase();
      return await syncDatabase(sequelize);
    } else {
      // Other connection errors (wrong credentials, server down, etc.)
      console.error("Database connection failed:", error.message);
      console.error("Check your database credentials and server status");
      process.exit(1);
    }
  }
};

/**
 * Create database if it doesn't exist
 */
const createDatabase = async () => {
  try {
    // Create a connection without specifying database
    const tempSequelize = new Sequelize({
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      username: config.DATABASE_USERNAME,
      password: config.DATABASE_PASSWORD,
      dialect: config.DATABASE_DIALECT,
      logging: false,
    });

    // Test basic connection to MySQL server
    await tempSequelize.authenticate();
    console.log(`Connected to MySQL server at ${config.DATABASE_HOST}`);

    // Create the database
    await tempSequelize.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.DATABASE_NAME}\``
    );
    console.log(`Database '${config.DATABASE_NAME}' created successfully`);

    // Close temporary connection
    await tempSequelize.close();

    // Create new connection to the created database
    const sequelize = new Sequelize(
      config.DATABASE_NAME,
      config.DATABASE_USERNAME,
      config.DATABASE_PASSWORD,
      {
        dialect: config.DATABASE_DIALECT,
        dialectOptions: {
          ssl: {
            require: config.ENVIRONMENT !== "development",
            rejectUnauthorized: false,
          },
        },
        port: config.DATABASE_PORT,
        host: config.DATABASE_HOST,
        logging:
          config.ENVIRONMENT === "development"
            ? (msg) => console.log(msg)
            : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );

    await sequelize.authenticate();
    console.log(`Connected to ${config.DATABASE_NAME} after creation`);

    return sequelize;
  } catch (createError) {
    console.error("Failed to create database:", createError.message);
    console.error(
      "💡 Make sure MySQL server is running and credentials are correct"
    );
    process.exit(1);
  }
};

/**
 * Sync database models and tables
 */
const syncDatabase = async (sequelize) => {
  try {
    // Import models to register them with Sequelize
    console.log("Importing and registering models...");
    await import("../models/index.js");

    // Sync all models - create/update tables
    console.log("Synchronizing database tables...");
    await sequelize.sync();
    console.log("Database tables synchronized successfully");

    // Log table creation summary
    const tableNames = Object.keys(sequelize.models);
    console.log(`Active tables: ${tableNames.join(", ")}`);

    return sequelize;
  } catch (syncError) {
    console.error("Failed to sync database tables:", syncError.message);
    process.exit(1);
  }
};

// Export the sequelize instance as default for model files
export default sequelize;
