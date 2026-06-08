const db = require("../models/index");
const Rank = db.Rank;
const { getCache, setCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");

const getRankById = async (rank_id) => {
  const key = CACHE_KEYS.IDENTITY.RANK_BY_ID(rank_id);

  const cached = await getCache(key);
  if (cached) return cached;

  const rank = await Rank.findByPk(rank_id);
  if (rank) await setCache(key, rank);
  return rank;
};

const rearrangeRanks = async () => {
  try {
    const ranks = await Rank.findAll({
      order: [["amount", "DESC"]],
    });

    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      await rank.update({ order: i + 1 });

      const key = CACHE_KEYS.IDENTITY.RANK_BY_ID(rank.id);
      await setCache(key, rank);
    }

    return ranks;
  } catch (error) {
    console.error("Error rearranging ranks:", error);
    return error;
  }
};

module.exports = {
  getRankById,
  rearrangeRanks,
};
