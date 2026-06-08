const rankService = require("../services/rankService.js");

const handleGetRankById = async (req, res) => {
  const rank_id = req.params.id;
  const rank = await rankService.getRankById(rank_id);
  return res.success("Get rank success", rank);
};

const handleRearrangeRanks = async (req, res) => {
  const result = await rankService.rearrangeRanks();
  return res.success("Rearrange ranks success", result);
};

module.exports = {
  handleGetRankById,
  handleRearrangeRanks,
};
