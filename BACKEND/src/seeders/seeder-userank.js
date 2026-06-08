"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update ranks with corresponding user_ids
    for (let i = 1; i <= 12; i++) {
      await queryInterface.sequelize.query(`UPDATE ranks SET user_id = ${i} WHERE id = ${i}`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Set all user_ids to null when rolling back
    await queryInterface.sequelize.query(`UPDATE ranks SET user_id = NULL`);
  },
};
