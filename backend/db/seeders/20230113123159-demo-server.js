"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert("Servers", [
			{ server_name: "Gardening", ownerId: 1 },
			{ server_name: "Fishing", ownerId: 2 },
			{ server_name: "Cooking", ownerId: 3 },
			{ server_name: "Soccer", ownerId: 4 },
			{ server_name: "Basketball", ownerId: 5 },
			{ server_name: "Hiking", ownerId: 6 },
			{ server_name: "Gaming", ownerId: 7 },
			{ server_name: "Puzzle", ownerId: 8 },
			{ server_name: "Tennis", ownerId: 9 },
			{ server_name: "Swimming", ownerId: 10 },
			{ server_name: "Golf", ownerId: 11 },
		]);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete("Servers", null, {});
	},
};
