const { Op } = require("sequelize");
const { Transaction, Item } = require("../models");

const checkItemDailyLimit = async (req, res, next) => {
  const userId = req.user.id;
  const itemId = req.params.item_id;

  const item = await Item.findByPk(itemId);
  if (!item) return res.error(400, "Item not found");

  if (!item.purchase_limit_per_day) return next();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const purchasedToday = await Transaction.count({
    where: {
      buyer_id: userId,
      item_id: itemId,
      created_at: {
        [Op.between]: [todayStart, todayEnd],
      },
    },
  });

  if (purchasedToday >= item.purchase_limit_per_day) {
    return res.error(403, "You have reached the daily purchase limit for this item.");
  }

  next();
};
module.exports = checkItemDailyLimit;
