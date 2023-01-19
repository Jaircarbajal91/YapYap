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
    return queryInterface.bulkInsert("Images", [
      { type: "message", url: "https://sampleURL.com/image1.jpg" },
      { type: "user", url: "https://sampleURL.com/image2.jpg" },
      { type: "server", url: "https://sampleURL.com/image3.jpg" },
      { type: "message", url: "https://sampleURL.com/image4.jpg" },
      { type: "user", url: "https://sampleURL.com/image5.jpg" },
      { type: "server", url: "https://sampleURL.com/image6.jpg" },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Images", null, {});
  }
};
