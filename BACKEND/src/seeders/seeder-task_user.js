"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("task_users", [
      {
        user_id: 1,
        task_id: 1,
        assigned_at: new Date(),
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        task_id: 2,
        assigned_at: new Date(),
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        task_id: 2,
        progress_count: 5,
        assigned_at: new Date(),
        completed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 3,
        task_id: 3,
        assigned_at: new Date(),
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 4,
        task_id: 4,
        assigned_at: new Date(),
        completed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 5,
        task_id: 5,
        progress_count: 3,
        assigned_at: new Date(),
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 6,
        task_id: 6,
        assigned_at: new Date(),
        completed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 7,
        task_id: 7,
        progress_count: 2,
        assigned_at: new Date(),
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("task_users", null, {});
  },
};
