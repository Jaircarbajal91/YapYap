"use strict";
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Servers", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			server_name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			imageId: {
				type: Sequelize.INTEGER,
			},
			ownerId: {
				type: Sequelize.INTEGER,
				allowNull: false,
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
		await queryInterface.dropTable("Servers", options);
	},
};
