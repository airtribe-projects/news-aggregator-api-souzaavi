const jwt = require("jsonwebtoken");
const CustomError = require("../custom_errors/customError");


/**
 * Middleware to authorize the requests using JWT token
 @param {Object} req - Express request object.
 @param {Object} req.headers - Request headers.
 @param {string} req.headers.Authorization - Bearer token.
 @param {Object} res - Express response object.
 @param {Function} next - Express next middleware function.
 @returns {Promise<void>} - Calls the next middleware function or throws an error.
 */
const authorize = async (req , res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if(!token) {
    return next(new CustomError("Unauthorized Request", 401));
  }
  try {
    req.decodedUser = jwt.verify(token, process.env.JWT_SECRET, );
    next();
  } catch (e) {
    console.error('Unhandled Error: ', e);
    next(new CustomError("Unauthorized Request", 401));
  }
}

module.exports = authorize;
