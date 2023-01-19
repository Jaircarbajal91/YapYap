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
   return queryInterface.bulkInsert("Servers", [
      {server_name: "Gardening", owner_id: 1},
      {server_name: "Fishing", owner_id: 2},
      {server_name: "Cooking", owner_id: 3},
      {server_name: "Soccer", owner_id: 4},
      {server_name: "Basketball", owner_id: 5},
      {server_name: "Hiking", owner_id: 6},
      {server_name: "Gaming", owner_id: 7},
      {server_name: "Puzzle", owner_id: 8},
      {server_name: "Tennis", owner_id: 9},
      {server_name: "Swimming", owner_id: 10},
      {server_name: "Golf", owner_id: 11}
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Servers", null, {});
  }
};
