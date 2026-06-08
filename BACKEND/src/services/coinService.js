const db = require("../models/index");
const Coin = db.Coin;
const { setCache } = require("../utils/cache");
const { CACHE_KEYS, CACHE_TTL } = require("../constants/cacheKeys");
const { cacheThrough } = require("../helpers/cacheHelper");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const getCoin = async (id) => {
  return cacheThrough(
    CACHE_KEYS.COMMERCE.COIN_BY_ID(id),
    async () => {
      const coin = await Coin.findByPk(id, { raw: true, nest: true });
      if (!coin) {
        throw new NotFoundError("Coin not found");
      }
      return coin;
    },
    CACHE_TTL.ONE_HOUR,
  );
};

const updateCoin = async (id, coins, options = {}) => {
  const coin = await Coin.findByPk(id, options);
  if (!coin) {
    throw new NotFoundError("Coin not found");
  }
  await coin.update({ amount: coins }, options);
  const coinData = coin.toJSON();
  await setCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(id), coinData, CACHE_TTL.ONE_HOUR);
  return coinData;
};

const updateIncreaseCoin = async (id, coins, options = {}) => {
  const coin = await Coin.findByPk(id, options);
  if (!coin) {
    throw new NotFoundError("Coin not found");
  }
  coin.amount += coins;
  await coin.save(options);
  const coinData = coin.toJSON();
  await setCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(id), coinData, CACHE_TTL.ONE_HOUR);
  return coinData;
};

const updateDecreaseCoin = async (id, coins, options = {}) => {
  const coin = await Coin.findByPk(id, options);
  if (!coin) {
    throw new NotFoundError("Coin not found");
  }
  coin.amount -= coins;
  if (coin.amount < 0) {
    throw new BadRequestError("Coin amount cannot be decreased below 0");
  }
  await coin.save(options);
  const coinData = coin.toJSON();
  await setCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(id), coinData, CACHE_TTL.ONE_HOUR);
  return coinData;
};

module.exports = {
  getCoin,
  updateCoin,
  updateIncreaseCoin,
  updateDecreaseCoin,
};
