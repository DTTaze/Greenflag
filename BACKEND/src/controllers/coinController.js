const coinService = require("../services/coinService.js");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");

const cacheKeyCoin = (id) => CACHE_KEYS.COMMERCE.COIN_BY_ID(id);

const handleGetCoin = async (req, res) => {
  const id = req.params.id;
  const cacheKey = cacheKeyCoin(id);

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.success("Get coin success (from cache)", cached);
  }

  const coin = await coinService.getCoin(id);
  await setCache(cacheKey, coin);
  return res.success("Get coin success", coin);
};

const handleUpdateCoin = async (req, res) => {
  const id = req.params.id;
  const coins = req.body.coins;

  const coin = await coinService.updateCoin(id, coins);
  await deleteCache(cacheKeyCoin(id));
  return res.success("Update coin success", coin);
};

const handleIncreaseCoin = async (req, res) => {
  const id = req.params.id;
  const coins = req.body.coins;

  const coin = await coinService.updateIncreaseCoin(id, coins);
  await deleteCache(cacheKeyCoin(id));
  return res.success("Increase coin success", coin);
};

const handleDecreaseCoin = async (req, res) => {
  const id = req.params.id;
  const coins = req.body.coins;

  const coin = await coinService.updateDecreaseCoin(id, coins);
  await deleteCache(cacheKeyCoin(id));
  return res.success("Decrease coin success", coin);
};

module.exports = {
  handleGetCoin,
  handleUpdateCoin,
  handleIncreaseCoin,
  handleDecreaseCoin,
};
