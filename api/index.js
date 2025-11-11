import app from "../src/app.js";
import { connectDB } from "../src/config/db_files.js";

// Connect to database once (will be reused across invocations in same container)
let dbConnected = false;

const handler = async (req, res) => {
  try {
    // Only connect to DB once per container lifecycle
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }

    // Handle the request with Express app
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default handler;
