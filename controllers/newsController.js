const {fetchNews} = require("../services/newsService");
const Article = require("../models/article");
const CustomError = require("../custom_errors/customError");

/**
 * Retrieves Cached News and Simulates live-news-feed Optionally by
 * providing a keyword.
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Express request parameters.
 * @param {String} req.params.keyword - Optional keyword to search for,
 * Default is value "Global".
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Sends a response with the news articles to the client.
 */
const retrieveNews = async (req, res, next) => {
  try {
    const { keyword = "Global" } = req.params;
    const news = await fetchNews(keyword, "search");
    res.status(200).json({news});
  } catch (e) {
    console.error(e);
    next(e);
  }
}


/**
 * Marks an article as read or favorite - It is a Helper Function for
 * markRead and markFavorite Controllers.
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Express request parameters.
 * @param {String} req.params.id - Article ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {String} field - Field to update in the database.
 * @returns {Promise<void>} - Sends a response with the updated article to the client.
 */
const markArticle = async (req, res, next, field) => {
  try {
    const {id} = req.params;
    const article = await Article.findByIdAndUpdate(id, {[field]: true}, {new: true});
    if (!article) {
      next(CustomError("Article not found", 404));
    }
    res.status(200).json({article});
  } catch (e) {
    console.error(e);
    next(e);
  }
}

/**
 * Retrieves Articles based on the field provided - It is a Helper Function
 * for retrieveReadArticles and retrieveFavoriteArticles Controllers.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {String} field - Field to search in the database.
 * @returns {Promise<void>} - Sends a response with the articles to the client.
 */
const retrieveArticles = async (req, res, next, field) => {
  try {
    const articles = await Article.find({[field]: true});
    if (!articles) {
      next(new CustomError("Article not found", 404));
    }
    res.status(200).json({news: articles});
  } catch (e) {
    console.error(e);
    next(e);
  }
}

/**
 * Marks an article as read. It is a Controller Function.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Sends a response with the updated article to the client.
 */
const markRead = async (req, res, next) => markArticle(req, res, next, "read");


/**
 * Marks an article as favorite. It is a Controller Function.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Sends a response with the updated article to the client.
 */
const markFavorite = async (req, res, next) => markArticle(req, res, next, "favorite");


/**
 * Retrieves Articles marked as read. It is a Controller Function.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Sends a response with the articles to the client.
 */
const retrieveReadArticles = async (req, res, next) => retrieveArticles(req, res, next, "read");


/**
 * Retrieves Articles marked as favorite. It is a Controller Function.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Sends a response with the articles to the client.
 */
const retrieveFavoriteArticles = async (req, res, next) => retrieveArticles(req, res, next, "favorite");

module.exports = {
  markRead,
  retrieveNews,
  markFavorite,
  retrieveReadArticles,
  retrieveFavoriteArticles,
};
