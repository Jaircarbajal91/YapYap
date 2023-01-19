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
    return queryInterface.bulkInsert("Channels", [
      {channel_name: "Gardeners", server_id: 1},
      {channel_name: "Flower Picking", server_id: 1},
      {channel_name: "Fishers", server_id: 2},
      {channel_name: "Catch of the day", server_id: 2},
      {channel_name: "Chefs", server_id: 3},
      {channel_name: "Recipes", server_id: 3},
      {channel_name: "Soccer Fans", server_id: 4},
      {channel_name: "Match Discussions", server_id: 4},
      {channel_name: "Basketball Fans", server_id: 5},
      {channel_name: "Player discussions", server_id: 5},
      {channel_name: "Hikers", server_id: 6},
      {channel_name: "Trails", server_id: 6},
      {channel_name: "Gamers", server_id: 7},
      {channel_name: "Game Reviews", server_id: 7},
      {channel_name: "Puzzle Fans", server_id: 8},
      {channel_name: "Tips and Tricks", server_id: 8},
      {channel_name: "Tennis players", server_id: 9},
      {channel_name: "Tournaments", server_id: 9},
      {channel_name: "Swimmers", server_id: 10},
      {channel_name: "Training and techniques", server_id: 10},
      {channel_name: "Golfers", server_id: 11},
      {channel_name: "Equipment", server_id: 11}
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Channels", null, {});
  }
};
