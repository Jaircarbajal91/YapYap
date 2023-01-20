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
    return queryInterface.bulkInsert("DMMembers", [
      { user_id: 1, dm_id: 2 },
      { user_id: 2, dm_id: 5 },
      { user_id: 3, dm_id: 7 },
      { user_id: 4, dm_id: 8 },
      { user_id: 5, dm_id: 2 },
      { user_id: 6, dm_id: 1 },
      { user_id: 7, dm_id: 3 }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("DMMembers", null, {});
  }
};
