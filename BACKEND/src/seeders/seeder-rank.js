"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First create ranks with user_id explicitly set to NULL
    await queryInterface.bulkInsert("ranks", [
      {
        id: 1,
        user_id: null,
        amount: 1000,
        order: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        user_id: null,
        amount: 2000,
        order: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        user_id: null,
        amount: 3000,
        order: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        user_id: null,
        amount: 4000,
        order: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        user_id: null,
        amount: 5000,
        order: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        user_id: null,
        amount: 6000,
        order: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        user_id: null,
        amount: 7000,
        order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        user_id: null,
        amount: 8000,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        user_id: null,
        amount: 9000,
        order: 9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        user_id: null,
        amount: 10000,
        order: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 11,
        user_id: null,
        amount: 11000,
        order: 11,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 12,
        user_id: null,
        amount: 12000,
        order: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("ranks", null, {});
  },
};
