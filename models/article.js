const mongoose = require("mongoose");


/**
 * Mongoose schema for the articles Collection.
 * @typedef {Object} Article - The Mongoose model for the articles Collection.
 * @property {String} url - The url of the article.
 * @property {String} image - The image url of the article.
 * @property {String} keyword - The keyword of the article.
 * @property {String} title - The title of the article.
 * @property {String} source - The source of the article.
 * @property {String} description - The description of the article.
 * @property {Date} publishedAt - The published date of the article.
 * @property {Boolean} read - The read status of the article.
 * @property {Boolean} favorite - The favorite status of the article.
 * @property {Date} cacheAt - The cache date of the article.
 */
const articleSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  image: {
    type: String,
  },
  keyword: {
    type: String,
  },
  title: {
    type: String,
  },
  source: {
    type: String,
  },
  description: {
    type: String,
  },
  publishedAt: {
    type: Date,
  },
  read: {
    type: Boolean,
  },
  favorite: {
    type: Boolean,
  },
  cacheAt: {
    type: Date,
    default: Date.now(),
  },
}, {
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  }
});


/**
 * The Mongoose model for the articles Collection.
 * @type {mongoose.Model<Article>}
 */
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
