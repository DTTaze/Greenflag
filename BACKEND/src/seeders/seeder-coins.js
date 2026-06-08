"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("coins", [
      {
        user_id: 1,
        amount: 1000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        amount: 2000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 3,
        amount: 3000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 4,
        amount: 4000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 5,
        amount: 5000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 6,
        amount: 6000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 7,
        amount: 7000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 8,
        amount: 8000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 9,
        amount: 8000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 10,
        amount: 8000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 11,
        amount: 8000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 12,
        amount: 8000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("coins", null, {});
  },
};
