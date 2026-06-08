"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("task_types", [
      // type_id 1 (mostly easy tasks)
      {
        task_id: 1,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // easy
      {
        task_id: 3,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // easy
      {
        task_id: 6,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // easy
      {
        task_id: 9,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // easy
      {
        task_id: 10,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // easy
      {
        task_id: 14,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // easy
      {
        task_id: 18,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // easy
      {
        task_id: 21,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // easy
      {
        task_id: 26,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // easy
      {
        task_id: 5,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium with low total
      {
        task_id: 19,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium with low total
      {
        task_id: 24,
        type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium with low total

      // type_id 2 (mostly medium/hard tasks)
      {
        task_id: 2,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium
      {
        task_id: 4,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // hard
      {
        task_id: 7,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium
      {
        task_id: 8,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium
      {
        task_id: 11,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium
      {
        task_id: 12,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // hard
      {
        task_id: 13,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium
      {
        task_id: 15,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // hard
      {
        task_id: 16,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium
      {
        task_id: 17,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // hard
      {
        task_id: 20,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium
      {
        task_id: 22,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium
      {
        task_id: 23,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // hard
      {
        task_id: 25,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // medium
      {
        task_id: 27,
        type_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      }, // hard
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("task_types", null, {});
  },
};
