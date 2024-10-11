const express = require('express');
const authorize = require("../middleware/authorize");
const {
  retrieveNews,
  markRead,
  markFavorite,
  retrieveFavoriteArticles,
  retrieveReadArticles,
} = require('../controllers/newsController');

const router = express.Router();


/**
 * Route to retrieve news articles.
 * @method GET/
 * @function authorize - Express middleware function to authorize user.
 * @function retrieveNews - Express middleware function to retrieve news articles.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.get('/', authorize, retrieveNews);


/**
 * Route to search news articles by keyword.
 * @method GET/search/:keyword
 * @function authorize - Express middleware function to authorize user.
 * @function retrieveNews - Express middleware function to retrieve news articles.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.get('/search/:keyword', authorize, retrieveNews);


/**
 * Route to mark an article as read by its id.
 * @method POST/:id/read
 * @function authorize - Express middleware function to authorize user.
 * @function markRead - Express middleware function to mark an article as read.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.post('/:id/read', authorize, markRead);


/**
 * Route to mark an article as favorite by its id.
 * @method POST/:id/favorite
 * @function authorize - Express middleware function to authorize user.
 * @function markFavorite - Express middleware function to mark an article as favorite.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.post('/:id/favorite', authorize, markFavorite);


/**
 * Route to retrieve read articles.
 * @method GET/read
 * @function authorize - Express middleware function to authorize user.
 * @function retrieveReadArticles - Express middleware function to retrieve read articles.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.get('/read', authorize, retrieveReadArticles);


/**
 * Route to retrieve favorite articles.
 * @method GET/favorite
 * @function authorize - Express middleware function to authorize user.
 * @function retrieveFavoriteArticles - Express middleware function to retrieve favorite articles.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
router.get('/favorite', authorize, retrieveFavoriteArticles);


module.exports = router;
