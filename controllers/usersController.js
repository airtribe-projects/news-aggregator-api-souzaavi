const User = require('../models/user');
const CustomError = require("../custom_errors/customError");


/**
 * Registers a new user
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Express Request body.
 * @param {string} req.body.name - User's name.
 * @param {string} req.body.email - User's email.
 * @param {string} req.body.password - User's password.
 * @param {Array} req.body.preferences - User's preferences
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Sends a response to the user. with a status
 * code 201 if the user is registered and 400 if the user is not registered
 * for any of the validation failure. and sends 500 if there is any other unhandled error.
 */
const signupUser = async (req, res, next) => {
  try {
    const {name, email, password, preferences} = req.body;
    const user = await User.create({name, email, password, preferences});
    res.status(201).json(user);
  } catch (e) {
    console.error(`Unhandled Error: ${e}`);
    next(e);
  }
}


/**
 * Sign in a user.
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing login details.
 * @param {string} req.body.email - User's email.
 * @param {string} req.body.password - User's password.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Sends a response with the user and token.
 */
const loginUser = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      next(
        new CustomError('No User account found with the matching email address', 404)
      );
    }
    const token = await user.authenticate(password);
    res.status(200).json({user, token});
  } catch (error) {
    console.error(`Unhandled Error: ${error}`);
    next(error);
  }
}


/**
 * Retrieves user preferences.
 * @param {Object} req - Express request object.
 * @param {Object} req.decodedUser - Decoded user object from the token.
 * @param {string} req.decodedUser.id - User's ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Sends a response with the user's preferences.
 */
const retrieveUserPreferences = async (req, res, next) => {
  try {
    const {id} = req.decodedUser;
    const user = await User.findById(id);
    if (!user) {
      next(
        new CustomError('No Preferences found for the user', 404)
      );
    }
    res.status(200).json({preferences: user.preferences});
  } catch (e) {
    console.error(`Unhandled Error: ${e}`);
    next(e);
  }
}


/**
 * Updates user preferences.
 * @param {Object} req - Express request object.
 * @param {Object} req.decodedUser - Decoded user object from the token.
 * @param {string} req.decodedUser.id - User's ID.
 * @param {Object} req.body - Request body containing new preferences.
 * @param {Object} req.body.preferences - New user preferences.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Sends a response with the updated preferences.
 */
const updateUserPreferences = async (req, res, next) => {
  try {
    const {id} = req.decodedUser;
    const {preferences} = req.body;
    const user = await User.findByIdAndUpdateWithValidation(id, {preferences}, {new: true,});
    if (!user) {
      next(
        new CustomError('Unable to update user preferences. User Record Not' +
          ' found', 404)
      );
    }
    res.status(200).json({preferences: user.preferences});
  } catch (e) {
    console.error(`Unhandled Error: ${e}`);
    next(e);
  }
}

module.exports = {
  loginUser,
  signupUser,
  updateUserPreferences,
  retrieveUserPreferences
};
