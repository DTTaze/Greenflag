"use strict";
const { nanoid } = require("nanoid");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("event_users", [
      {
        user_id: 5,
        event_id: 1,
        joined_at: Sequelize.literal("CURDATE() - INTERVAL 5 DAY"),
        completed_at: Sequelize.literal("CURDATE() - INTERVAL 4 DAY - INTERVAL 18 HOUR"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 5 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 4 DAY - INTERVAL 18 HOUR"),
      },
      {
        user_id: 5,
        event_id: 2,
        joined_at: null,
        completed_at: null,
        created_at: Sequelize.literal("CURDATE() - INTERVAL 5 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 5 DAY"),
      },
      {
        user_id: 7,
        event_id: 1,
        joined_at: Sequelize.literal("CURDATE() - INTERVAL 5 DAY"),
        completed_at: Sequelize.literal("CURDATE() - INTERVAL 4 DAY - INTERVAL 15 HOUR"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 10 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 4 DAY - INTERVAL 15 HOUR"),
      },
      {
        user_id: 8,
        event_id: 4,
        joined_at: Sequelize.literal("CURDATE() - INTERVAL 7 DAY"),
        completed_at: Sequelize.literal("CURDATE() - INTERVAL 6 DAY - INTERVAL 21 HOUR"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 5 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 6 DAY - INTERVAL 21 HOUR"),
      },
      {
        user_id: 2,
        event_id: 5,
        joined_at: null,
        completed_at: null,
        created_at: Sequelize.literal("CURDATE() - INTERVAL 15 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 15 DAY"),
      },
      {
        user_id: 2,
        event_id: 3,
        joined_at: null,
        completed_at: null,
        created_at: Sequelize.literal("CURDATE() - INTERVAL 9 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 9 DAY"),
      },
      {
        user_id: 6,
        event_id: 3,
        joined_at: null,
        completed_at: null,
        created_at: Sequelize.literal("CURDATE() - INTERVAL 7 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 7 DAY"),
      },
      {
        user_id: 8,
        event_id: 7,
        joined_at: Sequelize.literal("CURDATE() - INTERVAL 4 DAY"),
        completed_at: Sequelize.literal("CURDATE() - INTERVAL 3 DAY - INTERVAL 20 HOUR"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 10 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 3 DAY - INTERVAL 20 HOUR"),
      },
      {
        user_id: 7,
        event_id: 7,
        joined_at: Sequelize.literal("CURDATE() - INTERVAL 4 DAY - INTERVAL 1 HOUR"),
        completed_at: Sequelize.literal("CURDATE() - INTERVAL 3 DAY - INTERVAL 19 HOUR"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 10 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 3 DAY - INTERVAL 19 HOUR"),
      },
      {
        user_id: 3,
        event_id: 6,
        joined_at: Sequelize.literal("CURDATE() - INTERVAL 3 DAY"),
        completed_at: Sequelize.literal("CURDATE() - INTERVAL 2 DAY - INTERVAL 12 HOUR"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 3 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 2 DAY - INTERVAL 12 HOUR"),
      },
      {
        user_id: 4,
        event_id: 8,
        joined_at: Sequelize.literal("CURDATE() - INTERVAL 2 DAY"),
        completed_at: Sequelize.literal("CURDATE() - INTERVAL 1 DAY - INTERVAL 10 HOUR"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 2 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 1 DAY - INTERVAL 10 HOUR"),
      },
      {
        user_id: 9,
        event_id: 2,
        joined_at: Sequelize.literal("CURDATE() - INTERVAL 4 DAY"),
        completed_at: null,
        created_at: Sequelize.literal("CURDATE() - INTERVAL 4 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 4 DAY"),
      },
      {
        user_id: 10,
        event_id: 5,
        joined_at: Sequelize.literal("CURDATE() - INTERVAL 6 DAY"),
        completed_at: Sequelize.literal("CURDATE() - INTERVAL 5 DAY - INTERVAL 8 HOUR"),
        created_at: Sequelize.literal("CURDATE() - INTERVAL 6 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 5 DAY - INTERVAL 8 HOUR"),
      },
      {
        user_id: 11,
        event_id: 4,
        joined_at: Sequelize.literal("CURDATE() - INTERVAL 7 DAY"),
        completed_at: null,
        created_at: Sequelize.literal("CURDATE() - INTERVAL 7 DAY"),
        updated_at: Sequelize.literal("CURDATE() - INTERVAL 7 DAY"),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("event_users", null, {});
  },
};
