"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("role_permissions", [
      {
        role_id: 1,
        permission_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        permission_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        permission_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 4,
        permission_id: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 4,
        permission_id: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 5,
        permission_id: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("role_permissions", null, {});
  },
};
