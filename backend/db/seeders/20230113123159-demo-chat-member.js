"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert("ChatMembers", [
			{ userId: 1, serverId: 2 },
			{ userId: 2, serverId: 5 },
			{ userId: 3, serverId: 7 },
			{ userId: 4, serverId: 8 },
			{ userId: 5, serverId: 2 },
			{ userId: 6, serverId: 1 },
			{ userId: 7, serverId: 3 },
			{ userId: 8, serverId: 6 },
			{ userId: 9, serverId: 4 },
			{ userId: 10, serverId: 8 },
			{ userId: 1, dmId: 2 },
			{ userId: 2, dmId: 5 },
			{ userId: 3, dmId: 7 },
			{ userId: 4, dmId: 8 },
			{ userId: 5, dmId: 2 },
			{ userId: 6, dmId: 1 },
			{ userId: 7, dmId: 3 },
		]);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete("ChatMembers", null, {});
	},
};
