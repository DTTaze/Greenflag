const { getCache, setCache } = require("../utils/cache");

const cacheThrough = async (key, fetchFn, ttl) => {
  const cached = await getCache(key);
  if (cached) return cached;
  const fresh = await fetchFn();
  if (fresh) await setCache(key, fresh, ttl);
  return fresh;
};

module.exports = {
  cacheThrough,
};
