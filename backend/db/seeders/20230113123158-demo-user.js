'use strict';
const bcrypt = require("bcryptjs");

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
    return queryInterface.bulkInsert("User", [
      {
        username: "Demo_User",
        email: "demo@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "demolition",
      },
      {
        username: "kevbot",
        email: "kevbot@yapyap.io",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        username: "jairbot",
        email: "jairbot@yapyap.io",
        hashedPassword: bcrypt.hashSync("password")
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("User", {
      username: { [Op.in]: ["Demo_User", "kevbot", "jairbot"] }
  }, {});
  }
};
