import config from "../config/index.js";

export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const env = config.NODE_ENV || "development";

  if (env === "development") {
    console.error("ERROR:", { message: err.message, stack: err.stack, statusCode, data: err.data || null });
  } else {
    console.error(`ERROR: ${err.message} (status: ${statusCode})`);
  }

  const responseMessage = env === "production" && statusCode >= 500 ? "Internal Server Error" : err.message;

  return res.status(statusCode).json({
    success: false,
    message: responseMessage,
    ...(err.data && { data: err.data }),
    ...(env === "development" && { stack: err.stack }),
  });
}
