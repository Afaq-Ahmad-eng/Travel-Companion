export class AppError extends Error {
  constructor(message, statusCode = 500, details = null, meta = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.meta = meta; // For passing extra data like unchanged: true
    this.isOperational = true; // Mark as expected error
  }
}