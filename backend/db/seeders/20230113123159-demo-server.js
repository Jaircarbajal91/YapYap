"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert("Servers", [
			// Demo_User's servers (3 servers)
			{ server_name: "Gaming", ownerId: 1, imageId: 28 },
			{ server_name: "Tech Talk", ownerId: 1, imageId: 29 },
			{ server_name: "Music Lovers", ownerId: 1, imageId: 30 },
			
			// Other servers
			{ server_name: "Gardening", ownerId: 2, imageId: 31 },
			{ server_name: "Fishing", ownerId: 3, imageId: 32 },
			{ server_name: "Cooking", ownerId: 4, imageId: 33 },
			{ server_name: "Soccer", ownerId: 5 },
			{ server_name: "Basketball", ownerId: 6 },
			{ server_name: "Hiking", ownerId: 7 },
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
