"use strict";

/** @type {import('sequelize-cli').Migration} */
let options = {tableName: "Channels"};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
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
		return queryInterface.bulkInsert(options, [
			{ channel_name: "Gardeners", serverId: 1 },
			{ channel_name: "Flower Picking", serverId: 1 },
			{ channel_name: "Fishers", serverId: 2 },
			{ channel_name: "Catch of the day", serverId: 2 },
			{ channel_name: "Chefs", serverId: 3 },
			{ channel_name: "Recipes", serverId: 3 },
			{ channel_name: "Soccer Fans", serverId: 4 },
			{ channel_name: "Match Discussions", serverId: 4 },
			{ channel_name: "Basketball Fans", serverId: 5 },
			{ channel_name: "Player discussions", serverId: 5 },
			{ channel_name: "Hikers", serverId: 6 },
			{ channel_name: "Trails", serverId: 6 },
			{ channel_name: "Gamers", serverId: 7 },
			{ channel_name: "Game Reviews", serverId: 7 },
			{ channel_name: "Puzzle Fans", serverId: 8 },
			{ channel_name: "Tips and Tricks", serverId: 8 },
			{ channel_name: "Tennis players", serverId: 9 },
			{ channel_name: "Tournaments", serverId: 9 },
			{ channel_name: "Swimmers", serverId: 10 },
			{ channel_name: "Training and techniques", serverId: 10 },
			{ channel_name: "Golfers", serverId: 11 },
			{ channel_name: "Equipment", serverId: 11 },
		]);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		return queryInterface.bulkDelete(options, null, {});
	},
};
