const Redis = require("ioredis");
const { redisClient } = require("../config/configRedis");
const WINDOW_SECONDS = 15 * 60; // 15 minutes

const recordFailedLogin = async (email, ip, userAgent) => {
  const redisKeyByIP = `login_attempts_ip:${ip}`;
  const redisKeyByIPAndEmail = `login_attempts_ip_email:${ip}:${email}`;
  const redisKeyByIPAndUserAgent = `login_attempts_ip_ua:${ip}:${userAgent}`;
  const redisKeyByIPAndUserAgentAndEmail = `login_attempts_ip_ua_email:${ip}:${userAgent}:${email}`;
  const tx = redisClient.multi();
  tx.incr(redisKeyByIP);
  tx.incr(redisKeyByIPAndEmail);
  tx.incr(redisKeyByIPAndUserAgent);
  tx.incr(redisKeyByIPAndUserAgentAndEmail);

  tx.expire(redisKeyByIP, WINDOW_SECONDS);
  tx.expire(redisKeyByIPAndEmail, WINDOW_SECONDS);
  tx.expire(redisKeyByIPAndUserAgent, WINDOW_SECONDS);
  tx.expire(redisKeyByIPAndUserAgentAndEmail, WINDOW_SECONDS);
  await tx.exec();
};

const resetLoginAttempts = async (email, ip, userAgent) => {
  const redisKeyByIP = `login_attempts_ip:${ip}`;
  const redisKeyByIPAndEmail = `login_attempts_ip_email:${ip}:${email}`;
  const redisKeyByIPAndUserAgent = `login_attempts_ip_ua:${ip}:${userAgent}`;
  const redisKeyByIPAndUserAgentAndEmail = `login_attempts_ip_ua_email:${ip}:${userAgent}:${email}`;
  await redisClient.del(redisKeyByIP);
  await redisClient.del(redisKeyByIPAndEmail);
  await redisClient.del(redisKeyByIPAndUserAgent);
  await redisClient.del(redisKeyByIPAndUserAgentAndEmail);
};

module.exports = {
  recordFailedLogin,
  resetLoginAttempts,
};
