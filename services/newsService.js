const axios = require("axios");
const NodeCache = require("node-cache");
const CustomError = require("../custom_errors/customError");
const Article = require("../models/article");
const {NODE_CACHE, MONGO_DB} = require("../constants/cache_type");

const gNewsApi = "https://gnews.io/api/v4/search?q=";
const newsApi = "https://newsapi.org/v2/everything?q=";

const TTL = 600;

// Cache for news
const newsCache = new NodeCache({stdTTL: TTL, checkperiod: 5});


/**
 * Fetch news articles from GNews API.
 * @param {string} query - The search query.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of news articles.
 * @throws {CustomError} - If there is an error fetching news from GNews API.
 */
const fetchFromGNews = async (query) => {
  try {
    const newsResponse = await axios.get(`${gNewsApi}${query}&apikey=${process.env.GNEWS_API_KEY}`);
    const {articles} = newsResponse.data;
    return articles.map(article => ({
      url: article.url,
      image: article.image,
      title: article.title,
      source: article.source.name,
      description: article.description,
      publishedAt: article.publishedAt,
    }));
    // Directly return the data
  } catch (error) {
    // More specific error handling for GNews API
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("GNews API Error:", error.response.status, error.response.data);
      throw new CustomError("GNews API Error: " + error.response.data.message || "Failed to fetch news from GNews", error.response.status || 500);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("GNews API Error:", error.request);
      throw new CustomError("GNews API Error: No response received", 503);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("GNews API Error:", error.message);
      throw new CustomError("GNews API Error: " + error.message, 500);
    }
  }
};


/**
 * Fetch news articles from Newsapi.org API.
 * @param {string} query - The search query.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of news articles.
 * @throws {CustomError} - If there is an error fetching news from Newsapi.org API.
 */
const fetchFromNewsApi = async (query) => {
  try {
    const news = await axios.get(`${newsApi}${query}&apiKey=${process.env.NEWS_API_ORG}`);
    const {articles} = news.data; // Directly return the data
    return articles.map(article => ({
      url: article.url,
      image: article.urlToImage,
      title: article.title,
      source: article.source.name,
      description: article.description,
      publishedAt: article.publishedAt,
    }));
  } catch (error) {
    // More specific error handling for News API
    if (error.response) {
      console.error("News API Error:", error.response.status, error.response.data);
      throw new CustomError("News API Error: " + error.response.data.message || "Failed to fetch news from News API", error.response.status || 500);
    } else if (error.request) {
      console.error("News API Error:", error.request);
      throw new CustomError("News API Error: No response received", 503);
    } else {
      console.error("News API Error:", error.message);
      throw new CustomError("News API Error: " + error.message, 500);
    }
  }
};


/**
 * Fetch news articles from GNews and Newsapi.org APIs and cache them. If
 * the cache is available, return the cached articles. If the cache is not
 * available, fetch news from both APIs and return the first one to respond.
 * If both fail, throw an error. If new articles are found, update the cache.
 * @param {string} query - The search query.
 * @param {string} [method='live-feed'] - The method to fetch news ('live-feed' or 'search').
 * @returns {Promise<Object[]>} - A promise that resolves to an array of news articles.
 * @throws {CustomError} - If there is an error fetching news.
 */
const fetchNews = async (query, method = 'live-feed') => {
  try {
    if (method === 'live-feed') {
      if (process.env.CACHE_TYPE !== NODE_CACHE && process.env.CACHE_TYPE !== MONGO_DB) {
        throw CustomError('Cache type not supported', 500);
      }
      const cachedNews = process.env.CACHE_TYPE === NODE_CACHE ? newsCache.get(query) : process.env.CACHE_TYPE === MONGO_DB ? await Article.find({keyword: query}) : undefined;
      if (cachedNews && cachedNews.length > 0) {
        return cachedNews;
      }
    }

    // Fetch news from GNews and Newsapi.org API and returns the first one
    // to respond. If one fails, the other one is returned.
    // If both fail, an error is thrown.
    const news = await Promise.any([fetchFromGNews(query), fetchFromNewsApi(query),]);

    // Get the last fetched count for this query
    let lastCount = newsCache.get(`${query}:count`) || 0;

    // Get the next 5 articles
    let newArticles = (method === 'live-feed') ? news.slice(lastCount, lastCount + 5) : news;
    console.log(`Printing New News Length: ${newArticles.length}`);

    // If new articles are found, update the cache
    if (newArticles.length > 0) {
      const oldNews = newsCache.get(query) || [];
      if (method !== 'search') {
        return newArticles;
      }

      // Update the cache with the new articles
      if (process.env.CACHE_TYPE === NODE_CACHE) {
        // If the cache type is NodeCache, update the cache
        newsCache.set(query, [...newArticles, ...oldNews]);
      } else if (process.env.CACHE_TYPE === MONGO_DB) {
        // If the cache type is MongoDB, insert the new articles to the
        // articles collection.
        newArticles = await Article.insertMany(newArticles.map(article => ({
          ...article,
          keyword: query
        })));
      } else {
        // If the cache type is not supported, throw an Internal Server error
        console.error(`Cache type not supported ${process.env.CACHE_TYPE} ${NODE_CACHE} ${MONGO_DB}`);
        throw new CustomError('Cache type not supported', 500);
      }

      // Update the last fetched count for this query
      newsCache.set(`${query}:count`, lastCount + newArticles.length);

      console.log(`News cache updated with ${newArticles.length} new articles for ${query}!`);
    } else {
      console.log(`No new articles found for ${query}.`);
    }
    return newArticles;
  } catch (error) {
    console.error("fetchNews Error:", error);
    throw new CustomError(error.message || "Failed to fetch news", error.status || 500);
  }
};


/**
 * Function to simulate fetching news every 10 seconds.
 * @returns {Promise<void>}
 */
const simulateFetchingNews = async () => {
  try {
    const news = await fetchNews("Global", 'cache');
    console.log(`Simulated Fetching News with ${news.length} articles`);
  } catch (error) {
    console.error("simulateFetchingNews Error:", error);
  }
};


/**
 * Function to simulate deleting old articles every TTL seconds.
 * @returns {Promise<void>}
 */
const simulateDeletingArticles = async () => {
  try {
    await Article.deleteMany({cacheAt: {$lt: new Date(Date.now() - TTL * 1000)}}); // Delete articles older than TTL
  } catch (e) {
    console.error("Error Deleting old articles: ", e);
  }
}

// For Simulating Live Feed
// Executes fetchNews method every 10 seconds
// Simulate fetching news every 10 seconds
if((process.env.SIMULATE_LIVE_FEED === true)) {
  setInterval(simulateFetchingNews, 10000);
}

// Simulate deleting old articles every TTL seconds
// For MONGO_DB cache type, delete articles older than TTL seconds
if((process.env.CACHE_TYPE === MONGO_DB) && (process.env.SIMULATE_LIVE_FEED === true)) {
  setInterval(simulateDeletingArticles, TTL * 1000);
}

module.exports = {fetchNews};
