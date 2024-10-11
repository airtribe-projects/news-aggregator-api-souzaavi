/**
 * Custom error class for handling application-specific errors.
 * @extends Error
 */
class CustomError extends Error {
  /**
   * Create a new CustomError instance.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code.
   */
  constructor(message, status) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
