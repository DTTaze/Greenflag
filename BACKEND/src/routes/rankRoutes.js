const express = require("express");
const router = express.Router();
const rankController = require("../controllers/rankController.js");
// const checkPermission = require("../middlewares/checkPermission");

router.post(
  "/rearrange",
  // checkPermission("update", "rank"),
  rankController.handleRearrangeRanks,
);
router.get("/:id", rankController.handleGetRankById);

module.exports = router;
