'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert("ChatMembers", [
      { user_id: 1, server_id: 2 },
      { user_id: 2, server_id: 5 },
      { user_id: 3, server_id: 7 },
      { user_id: 4, server_id: 8 },
      { user_id: 5, server_id: 2 },
      { user_id: 6, server_id: 1 },
      { user_id: 7, server_id: 3 },
      { user_id: 8, server_id: 6 },
      { user_id: 9, server_id: 4 },
      { user_id: 10, server_id: 8 },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("ChatMembers", null, {});
  }
};
