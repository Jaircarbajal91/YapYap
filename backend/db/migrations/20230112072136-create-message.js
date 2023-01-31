"use strict";
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Messages", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			message: {
				type: Sequelize.STRING(256),
			},
			senderId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			channelId: {
				type: Sequelize.INTEGER,
			},
			imageId: {
				type: Sequelize.INTEGER,
			},
			dmId: {
				type: Sequelize.INTEGER,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		}, options);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Messages", options);
	},
};
