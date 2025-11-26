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
      { serial_number: 1 }, // Demo_User <-> kevbot
      { serial_number: 2 }, // Demo_User <-> jairbot
      { serial_number: 3 }, // Demo_User <-> JohnSmith
      { serial_number: 4 }, // Demo_User <-> EmilyBrown
      { serial_number: 5 }, // Demo_User <-> MichaelJohnson
      { serial_number: 6 }, // Demo_User <-> JessicaWilliams
      { serial_number: 7 }, // Demo_User <-> MatthewJones
      { serial_number: 8 }, // Demo_User <-> AshleySmith
      { serial_number: 9 }, // Demo_User <-> DavidJohnson
      { serial_number: 10 }, // Demo_User <-> EmilyJones
      { serial_number: 11 }, // Other DM
      { serial_number: 12 }, // Other DM
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
