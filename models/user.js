const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const CustomError = require("../custom_errors/customError");
const MultipleError = require("../custom_errors/multipleError");

const preferences = ['movies', 'comics', 'music', 'coding', 'games'];


/**
 * Mongoose schema for the Users Collection.
 * @typedef {Object} User - The Mongoose model for the users Collection.
 * @property {String} name - The name of the user.
 * @property {String} email - The email of the user.
 * @property {String} password - The hashed password of the user.
 * @property {String[]} preferences - The preferences of the user.
 */
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password should be at-least 8 characters long'],
      maxLength: [20, 'Password should not be more than 20 characters long'],
    },
    preferences: {
      type: [String],
      enum: preferences,
      default: [],
    }
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        const id = ret._id;
        delete ret._id;
        delete ret.preferences;
        return {id, ...ret,};
      }
    },
    toObject: {
      virtuals: true
    }
  }
);


/**
 * Pre-save middleware to hash the password before saving.
 * @param {Function} next - Express next middleware function.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


/**
 * Post-save middleware to handle MongoServerError and ValidationError.
 * @param {Error} error - The error object.
 * @param {Object} doc - The document being saved.
 * @param {Function} next - Express next middleware function.
 */
userSchema.post('save', function (error, doc, next) {
  switch (error.name) {
    case 'MongoServerError':
      if (error.code === 11000) {
        next(new CustomError('Email already exists', 409));
      } else if (error.code === 11600 || error.code === 211) {
        next(new CustomError('Service Unavailable', 503));
      } else {
        console.log(`Unhandled ${error.name}, Code: ${error.code}: `, error);
        next(new CustomError('Internal Server Error', 500));
      }
      break;
    case 'ValidationError':
      console.log('Validation Error Caught: ', error);
      const errors = Object.values(error.errors).map((value) => value.message);
      next(new MultipleError(errors, 400));
      break;
    default:
      console.log('Unhandled Error: ', error);
      next(error);
  }
});


/**
 * Method to authenticate a user. It compares the plain text password with the hashed password.
 * @param {String} plainPassword - The plain text password.
 * @returns {Promise<String>} - The JWT token.
 * @throws {CustomError} - If authentication fails.
 */
userSchema.methods.authenticate = async function (plainPassword) {
  const isValid = await bcrypt.compare(plainPassword, this.password);
  if (!isValid) {
    throw new CustomError('Invalid Credentials', 401);
  }
  return jwt.sign({
      id: this._id,
      name: this.name
    }, process.env.JWT_SECRET, {expiresIn: '30m'}
  );
}


/**
 * Static method to find a user by ID and update with validation.
 * @param {String} id - The user ID.
 * @param {Object} updateData - The data to update.
 * @param {Object} options - The options for the update.
 * @returns {Promise<Object>} - The updated user document.
 * @throws {CustomError} - If validation fails.
 */
userSchema.statics.findByIdAndUpdateWithValidation = async function (id, updateData, options) {
  if(updateData.preferences && updateData.preferences.length === 0) {
    throw new CustomError('Preferences should not be empty', 400);
  }
  if(updateData.preferences && !updateData.preferences.every((preference) => preferences.includes(preference))) {
    throw new CustomError(`Preferences can only be either of the following ${preferences}`, 400);
  }
  return this.findByIdAndUpdate(id, updateData, options);
}


/**
 * The Mongoose model for the users Collection.
 * @type {mongoose.Model<User>}
 */
const userModel = mongoose.model('User', userSchema, 'Users');

module.exports = userModel;
