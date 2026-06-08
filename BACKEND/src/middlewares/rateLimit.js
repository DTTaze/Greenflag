const Redis = require("ioredis");
const { redisClient } = require("../config/configRedis.js");
const { setCache } = require("../utils/cache.js");
const db = require("../models/index.js");
const { CACHE_KEYS } = require("../constants/cacheKeys.js");
const User = db.User;

// Rate limiting constants
const MAX_EMAIL_ATTEMPTS = 5; // Per email address
const MAX_IP_ATTEMPTS = 20; // Per IP (more lenient for shared networks)
const MAX_IP_EMAIL_ATTEMPTS = 5; // Per IP-email combination
const MAX_IP_USER_AGENT_ATTEMPTS = 5; // Per IP-User-Agent combination
const BLOCK_DURATION = 15 * 60; // 15 minutes in seconds

const loginLimiterByEmail = async (req, res, next) => {
  let email = req.body.email?.toLowerCase();
  let username = req.body.username;
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"] || "unknown";

  if (!email && !username) {
    return res.error(400, "Email or username is required", "MISSING_CREDENTIALS");
  }

  try {
    const condition = email ? { email } : { username };
    const user = await User.findOne({
      where: condition,
      include: [
        { model: db.Role, as: "roles" },
        { model: db.Coin, as: "coins" },
        { model: db.Rank, as: "ranks" },
      ],
    });
    if (!user) {
      return res.error(400, `${email || username} not found`, `${email || username}_NOT_FOUND`);
    }
    email = user.email;
    req.user = user;

    const userFormat = {
      ...user.toJSON(),
      role_id: user.roles?.id || null,
      coin_id: user.coins?.id || null,
      rank_id: user.ranks?.id || null,
    };

    // Store user data in Redis for 24 hours (86400 seconds)
    const TTL_24H = 60 * 60 * 24;
    await setCache(CACHE_KEYS.IDENTITY.USER_BY_ID(userFormat.id), userFormat, TTL_24H);
    await setCache(
      CACHE_KEYS.IDENTITY.USER_BY_PUBLIC_ID(userFormat.public_id),
      String(userFormat.id),
      TTL_24H,
    );
    if (userFormat.roles) {
      await setCache(CACHE_KEYS.IDENTITY.ROLE_BY_ID(userFormat.role_id), userFormat.roles, TTL_24H);
    }
    if (userFormat.coins) {
      await setCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(userFormat.coin_id), userFormat.coins, TTL_24H);
    }
    if (userFormat.ranks) {
      await setCache(CACHE_KEYS.IDENTITY.RANK_BY_ID(userFormat.rank_id), userFormat.ranks, TTL_24H);
    }
  } catch (error) {
    return res.error(500, "Error looking up user", error.message);
  }

  // Create unique identifiers for rate limiting
  const ipKey = CACHE_KEYS.SYSTEM.LOGIN_ATTEMPTS_IP(clientIP);
  const emailKey = CACHE_KEYS.SYSTEM.LOGIN_ATTEMPTS_EMAIL(email);
  const ipEmailKey = CACHE_KEYS.SYSTEM.LOGIN_ATTEMPTS_IP_EMAIL(clientIP, email);
  const ipUserAgentKey = CACHE_KEYS.SYSTEM.LOGIN_ATTEMPTS_IP_UA(clientIP, userAgent);

  // Get all current attempt counts
  const [ipAttempts, emailAttempts, ipEmailAttempts, ipUserAgentAttempts] = await Promise.all([
    redisClient.get(ipKey),
    redisClient.get(emailKey),
    redisClient.get(ipEmailKey),
    redisClient.get(ipUserAgentKey),
  ]);

  // Check IP-User-Agent combination (device-specific)
  if (ipUserAgentAttempts && parseInt(ipUserAgentAttempts) >= MAX_IP_USER_AGENT_ATTEMPTS) {
    return res.error(429, "Too many login attempts from your device. Please try again later.", {
      error: "TOO_MANY_DEVICE_ATTEMPTS",
      retryAfter: BLOCK_DURATION,
    });
  }

  // Check IP-email combination (most specific)
  if (ipEmailAttempts && parseInt(ipEmailAttempts) >= MAX_IP_EMAIL_ATTEMPTS) {
    return res.error(
      429,
      "Too many login attempts for this email from your device. Please try again later.",
      {
        error: "TOO_MANY_IP_EMAIL_ATTEMPTS",
        retryAfter: BLOCK_DURATION,
      },
    );
  }

  // Check email-based rate limiting
  if (emailAttempts && parseInt(emailAttempts) >= MAX_EMAIL_ATTEMPTS) {
    return res.error(429, "Too many login attempts for this email. Please try again later.", {
      error: "TOO_MANY_EMAIL_ATTEMPTS",
      retryAfter: BLOCK_DURATION,
    });
  }

  // Check IP-based rate limiting (most lenient)
  if (ipAttempts && parseInt(ipAttempts) >= MAX_IP_ATTEMPTS) {
    return res.error(429, "Too many login attempts from this network. Please try again later.", {
      error: "TOO_MANY_IP_ATTEMPTS",
      retryAfter: BLOCK_DURATION,
    });
  }

  // Increment all counters
  await Promise.all([
    redisClient.incr(ipKey),
    redisClient.incr(emailKey),
    redisClient.incr(ipEmailKey),
    redisClient.incr(ipUserAgentKey),
  ]);

  // Set expiration for all counters
  await Promise.all([
    redisClient.expire(ipKey, BLOCK_DURATION),
    redisClient.expire(emailKey, BLOCK_DURATION),
    redisClient.expire(ipEmailKey, BLOCK_DURATION),
    redisClient.expire(ipUserAgentKey, BLOCK_DURATION),
  ]);

  next();
};

module.exports = {
  loginLimiterByEmail,
};
