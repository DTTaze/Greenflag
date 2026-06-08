const rankRepo = require("../repositories/rankRepository");
const { setCache } = require("../utils/cache.js");
const { CACHE_KEYS } = require("../constants/cacheKeys.js");
const { cacheThrough } = require("../helpers/cacheHelper.js");

const getRankById = async (rank_id) => {
  const key = CACHE_KEYS.IDENTITY.RANK_BY_ID(rank_id);

  return cacheThrough(key, async () => {
    return await rankRepo.findById(rank_id, { raw: true, nest: true });
  });
};

const rearrangeRanks = async () => {
  try {
    const ranks = await rankRepo.findAll(
      {
        order: [["amount", "DESC"]],
      },
      { raw: true, nest: true },
    );

    const result = [];
    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      const rankData = await rankRepo.updateById(rank.id, { order: i + 1 });

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
