/**
 * Custom error class for application-specific multiple errors.
 * @extends Error
 */
class MultipleError extends Error {
  /**
   * Create a new MultipleError instance.
   * @param {String[]} errors - Array of error messages.
   * @param {number} status - HTTP status code.
   */
  constructor(errors, status) {
    super(errors.join(', '));
    this.errors = errors;
    this.status = status;
  }
}

module.exports = MultipleError;
