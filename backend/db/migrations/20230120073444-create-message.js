'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING(256)
      },
      sender_id: {
        type: Sequelize.INTEGER,
        references: { model: "Users"},
        onDelete: "CASCADE",
        allowNull: false,
      },
      channel_id: {
        type: Sequelize.INTEGER,
        references: { model: "Channels"},
        onDelete: "CASCADE",
      },
      image_id: {
        type: Sequelize.INTEGER
      },
      dm_id: {
        type: Sequelize.INTEGER,
        references: { model: "DirectMessages"},
        onDelete: "CASCADE",
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
    await queryInterface.dropTable('Messages');
  }
};
