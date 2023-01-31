'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Images";
    return queryInterface.bulkInsert(options, [
      { type: "message", url: "https://sampleURL.com/image1.jpg" },
      { type: "user", url: "https://sampleURL.com/image2.jpg" },
      { type: "server", url: "https://sampleURL.com/image3.jpg" },
      { type: "message", url: "https://sampleURL.com/image4.jpg" },
      { type: "user", url: "https://sampleURL.com/image5.jpg" },
      { type: "server", url: "https://sampleURL.com/image6.jpg" },
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Images";
    return queryInterface.bulkDelete(options, null, {});
  }
};
