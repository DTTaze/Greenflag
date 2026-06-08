"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("types", [
      {
        type: "daily",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "others",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("types", null, {});
  },
};
