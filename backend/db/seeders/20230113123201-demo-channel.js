"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		return queryInterface.bulkInsert("Channels", [
			// Demo_User's Gaming server (serverId: 1) - 2 channels
			{ channel_name: "general", serverId: 1 },
			{ channel_name: "game-reviews", serverId: 1 },
			
			// Demo_User's Tech Talk server (serverId: 2) - 2 channels
			{ channel_name: "general", serverId: 2 },
			{ channel_name: "coding-help", serverId: 2 },
			
			// Demo_User's Music Lovers server (serverId: 3) - 1 channel
			{ channel_name: "general", serverId: 3 },
			
			// Other servers' channels
			{ channel_name: "Gardeners", serverId: 4 },
			{ channel_name: "Flower Picking", serverId: 4 },
			{ channel_name: "Fishers", serverId: 5 },
			{ channel_name: "Catch of the day", serverId: 5 },
			{ channel_name: "Chefs", serverId: 6 },
			{ channel_name: "Recipes", serverId: 6 },
			{ channel_name: "Soccer Fans", serverId: 7 },
			{ channel_name: "Match Discussions", serverId: 7 },
			{ channel_name: "Basketball Fans", serverId: 8 },
			{ channel_name: "Player discussions", serverId: 8 },
			{ channel_name: "Hikers", serverId: 9 },
			{ channel_name: "Trails", serverId: 9 },
			{ channel_name: "Puzzle Fans", serverId: 10 },
			{ channel_name: "Tips and Tricks", serverId: 10 },
			{ channel_name: "Tennis players", serverId: 11 },
			{ channel_name: "Tournaments", serverId: 11 },
			{ channel_name: "Swimmers", serverId: 12 },
			{ channel_name: "Training and techniques", serverId: 12 },
			{ channel_name: "Golfers", serverId: 13 },
			{ channel_name: "Equipment", serverId: 13 },
		]);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		return queryInterface.bulkDelete("Channels", null, {});
	},
};
