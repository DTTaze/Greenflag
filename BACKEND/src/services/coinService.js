const coinRepo = require("../repositories/coinRepository");
const { setCache } = require("../utils/cache.js");
const { CACHE_KEYS, CACHE_TTL } = require("../constants/cacheKeys.js");
const { cacheThrough } = require("../helpers/cacheHelper.js");
const NotFoundError = require("../errors/NotFoundError.js");
const BadRequestError = require("../errors/BadRequestError.js");

const getCoin = async (id) => {
  return cacheThrough(
    CACHE_KEYS.COMMERCE.COIN_BY_ID(id),
    async () => {
      const coin = await coinRepo.findById(id, { raw: true, nest: true });
      if (!coin) {
        throw new NotFoundError("Coin not found");
      }
      return coin;
    },
    CACHE_TTL.ONE_HOUR,
  );
};

const updateCoin = async (id, coins, options = {}) => {
  const coin = await coinRepo.findById(id, { ...options, raw: true, nest: true });
  if (!coin) {
    throw new NotFoundError("Coin not found");
  }
  const coinData = await coinRepo.updateById(id, { amount: coins }, options);
  await setCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(id), coinData, CACHE_TTL.ONE_HOUR);
  return coinData;
};

const updateIncreaseCoin = async (id, coins, options = {}) => {
  const coin = await coinRepo.findById(id, { ...options, raw: true, nest: true });
  if (!coin) {
    throw new NotFoundError("Coin not found");
  }
  const newAmount = coin.amount + coins;
  const coinData = await coinRepo.updateById(id, { amount: newAmount }, options);
  await setCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(id), coinData, CACHE_TTL.ONE_HOUR);
  return coinData;
};

const updateDecreaseCoin = async (id, coins, options = {}) => {
  const coin = await coinRepo.findById(id, { ...options, raw: true, nest: true });
  if (!coin) {
    throw new NotFoundError("Coin not found");
  }
  const newAmount = coin.amount - coins;
  if (newAmount < 0) {
    throw new BadRequestError("Coin amount cannot be decreased below 0");
  }
  const coinData = await coinRepo.updateById(id, { amount: newAmount }, options);
  await setCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(id), coinData, CACHE_TTL.ONE_HOUR);
  return coinData;
};

module.exports = {
  getCoin,
  updateCoin,
  updateIncreaseCoin,
  updateDecreaseCoin,
};
