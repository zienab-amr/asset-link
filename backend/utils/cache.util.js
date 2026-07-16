const { redisClient } = require('../config/redis');

const CACHE_TTL = 300; // 5 minutes in seconds

/**
 * Store data in Redis with a TTL of 5 minutes
 * @param {string} key - Cache key (email)
 * @param {object} value - Data to store
 */
const setCache = async (key, value) => {
  await redisClient.setEx(key, CACHE_TTL, JSON.stringify(value));
};

/**
 * Get data from Redis
 * @param {string} key - Cache key (email)
 * @returns {object|null} Cached data or null if expired/not found
 */
const getCache = async (key) => {
  const data = await redisClient.get(key);
  if (!data) return null;
  return JSON.parse(data);
};

/**
 * Delete data from Redis
 * @param {string} key - Cache key (email)
 */
const deleteCache = async (key) => {
  await redisClient.del(key);
};

module.exports = { setCache, getCache, deleteCache };
