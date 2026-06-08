"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("permissions", [
      {
        id: 1,
        action: "get",
        subject: "user_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        action: "put",
        subject: "user_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        action: "delete",
        subject: "user_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        action: "post",
        subject: "role",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        action: "put",
        subject: "role_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        action: "delete",
        subject: "role_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        action: "post",
        subject: "role_permission",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        action: "put",
        subject: "role_permission",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        action: "delete",
        subject: "role_permission",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        action: "post",
        subject: "permission",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 11,
        action: "delete",
        subject: "permission_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 12,
        action: "put",
        subject: "permission_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 13,
        action: "post",
        subject: "task",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 14,
        action: "put",
        subject: "task_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 15,
        action: "post",
        subject: "item_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 16,
        action: "get",
        subject: "task_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 17,
        action: "delete",
        subject: "task_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 18,
        action: "post",
        subject: "transaction",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 19,
        action: "put",
        subject: "transaction_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 20,
        action: "delete",
        subject: "transaction_id",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
