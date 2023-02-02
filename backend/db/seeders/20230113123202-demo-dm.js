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
    return queryInterface.bulkInsert("DirectMessages", [
      { serial_number: 1 },
      { serial_number: 2 },
      { serial_number: 3 },
      { serial_number: 4 },
      { serial_number: 5 },
      { serial_number: 6 },
      { serial_number: 7 },
      { serial_number: 8 },
      { serial_number: 9 },
      { serial_number: 10 }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("DirectMessages", null, {});
  }
};
