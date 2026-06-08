const db = require("../models/index");
const Rank = db.Rank;
const { setCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");
const { cacheThrough } = require("../helpers/cacheHelper");

const getRankById = async (rank_id) => {
  const key = CACHE_KEYS.IDENTITY.RANK_BY_ID(rank_id);

  return cacheThrough(key, async () => {
    return await Rank.findByPk(rank_id, { raw: true, nest: true });
  });
};

const rearrangeRanks = async () => {
  try {
    const ranks = await Rank.findAll({
      order: [["amount", "DESC"]],
    });

    const result = [];
    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      await rank.update({ order: i + 1 });

      const rankData = rank.toJSON();
      const key = CACHE_KEYS.IDENTITY.RANK_BY_ID(rank.id);
      await setCache(key, rankData);
      result.push(rankData);
    }

    return result;
  } catch (error) {
    console.error("Error rearranging ranks:", error);
    throw error;
  }
};

module.exports = {
  getRankById,
  rearrangeRanks,
};
