export default class AppError extends Error {
  constructor(message, statusCode = 500, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.isOperational = statusCode >= 400 && statusCode < 500;
    Error.captureStackTrace(this, this.constructor);
  }
}
