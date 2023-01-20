'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DMMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "Users"},
        onDelete: "CASCADE",
        allowNull: false,
      },
      dm_id: {
        type: Sequelize.INTEGER,
        references: { model: "DirectMessages"},
        onDelete: "CASCADE",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DMMembers');
  }
};
