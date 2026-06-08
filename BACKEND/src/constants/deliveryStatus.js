const GHN_ACTIVE_STATUSES = Object.freeze([
  "ready_to_pick",
  "picking",
  "money_collect_picking",
  "picked",
  "storing",
  "transporting",
  "sorting",
  "delivering",
  "money_collect_delivering",
  "waiting_to_return",
  "return",
  "return_transporting",
  "return_sorting",
  "returning",
  "exception",
  "lost",
  "damage",
]);

module.exports = {
  GHN_ACTIVE_STATUSES,
};
