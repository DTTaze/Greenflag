const PRODUCT_CATEGORY = Object.freeze({
  RECYCLED: "recycled",
  HANDICRAFT: "handicraft",
  ORGANIC: "organic",
  PLANTS: "plants",
  OTHER: "other",
});

const PRODUCT_CONDITION = Object.freeze({
  NEW: "new",
  USED: "used",
});

const PRODUCT_POST_STATUS = Object.freeze({
  PUBLIC: "public",
  PRIVATE: "private",
  PENDING: "pending",
  REJECTED: "rejected",
});

module.exports = {
  PRODUCT_CATEGORY,
  PRODUCT_CONDITION,
  PRODUCT_POST_STATUS,
};
