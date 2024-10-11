const express = require('express');
const router = express.Router()
const authorize = require('../middleware/authorize');
const {
  signupUser,
  loginUser,
  retrieveUserPreferences,
  updateUserPreferences
} = require('../controllers/usersController');


/**
 * Route to sign up a new user.
 * @method POST/signup
 * @function signupUser - Controller function to register a new user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.post('/signup', signupUser);


/**
 * Route to log in a user.
 * @method POST/login
 * @function loginUser - Controller function to log in a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.post('/login', loginUser);


/**
 * Route to retrieve user preferences.
 * @method GET/preferences
 * @function authorize - Middleware to authorize user.
 * @function retrieveUserPreferences - Controller function to retrieve user preferences.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.get('/preferences', authorize, retrieveUserPreferences);


/**
 * Route to update user preferences.
 * @method PUT/preferences
 * @function authorize - Middleware to authorize user.
 * @function updateUserPreferences - Controller function to update user preferences.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.put('/preferences', authorize, updateUserPreferences);

module.exports = router;
