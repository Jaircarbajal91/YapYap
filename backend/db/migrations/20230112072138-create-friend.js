"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Friends", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			friendId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
				onDelete: "CASCADE",
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
		});

		// Add unique constraint to prevent duplicate friendships
		await queryInterface.addConstraint("Friends", {
			fields: ["userId", "friendId"],
			type: "unique",
			name: "unique_friendship",
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Friends");
	},
};

