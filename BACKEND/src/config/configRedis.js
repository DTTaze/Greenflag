require("dotenv").config();
const Redis = require("ioredis");

const redis = {
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

const redisClient = new Redis(redis);

// Function to check Redis connection
const checkRedisConnection = async () => {
  try {
    const result = await redisClient.ping();
    if (result === "PONG") {
      console.log("redis :", redis);
      console.log("Redis is connected successfully!");
    } else {
      console.log("redis :", redis);
      console.error("Unexpected response from Redis:", result);
    }
  } catch (error) {
    console.log("redis :", redis);
    console.error("Failed to connect to Redis:", error.message);
  }
};

module.exports = {
  redisClient,
  redis,
  checkRedisConnection,
};
