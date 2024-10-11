const CustomError = require('../custom_errors/customError');
const MultipleError = require('../custom_errors/multipleError');


/**
 * Error handling middleware for the application.
 * @param {Error|CustomError} error - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    res.status(error.status).json({errors: [error.message]});
  } else if (error instanceof MultipleError) {
    res.status(error.status).json({errors: error.errors});
  } else {
    res.status(500).json({errors: [error.message]});
  }
}

module.exports = errorHandler;
