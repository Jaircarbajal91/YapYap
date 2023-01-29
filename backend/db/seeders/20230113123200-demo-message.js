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
		return queryInterface.bulkInsert("Messages", [
			{
				message: "Hey Gardeners! Who's ready for spring planting season?",
				sender_id: 1,
				channelId: 1,
			},
			{
				message:
					"I just picked some beautiful flowers from my garden, anyone want to share their flower pictures?",
				sender_id: 2,
				channelId: 2,
			},
			{
				message: "Fishers, what's your go-to bait for bass?",
				sender_id: 3,
				channelId: 3,
			},
			{
				message: "Catch of the day: 3 lb bass! What did you guys catch today?",
				sender_id: 4,
				channelId: 4,
			},
			{
				message:
					"Who's up for a cooking challenge this weekend? Theme: seafood",
				sender_id: 5,
				channelId: 5,
			},
			{
				message:
					"I just tried this recipe for shrimp scampi and it was a hit! Anyone want the recipe?",
				sender_id: 6,
				channelId: 6,
			},
			{
				message:
					"Soccer fans, what do you think of the new formation the coach is using?",
				sender_id: 7,
				channelId: 7,
			},
			{
				message:
					"Match discussions: Who do you think will win the match tonight?",
				sender_id: 8,
				channelId: 8,
			},
			{
				message:
					"Basketball fans, what do you think of Lebron's performance this season?",
				sender_id: 9,
				channelId: 9,
			},
			{
				message: "Player discussions: Who is your favorite player and why?",
				sender_id: 10,
				channelId: 10,
			},
			{
				message: "Hikers, what's your favorite trail to hike?",
				sender_id: 11,
				channelId: 11,
			},
			{
				message:
					"I just finished the John Muir trail, it was challenging but worth it! Who's up for a hiking trip?",
				sender_id: 12,
				channelId: 12,
			},
			{
				message: "Gamers, what's your favorite game to play?",
				sender_id: 13,
				channelId: 13,
			},
			{
				message:
					"Game reviews: I just finished playing Cyberpunk 2077, here are my thoughts",
				sender_id: 14,
				channelId: 14,
			},
			{
				message: "Puzzle fans, what's your current puzzle?",
				sender_id: 15,
				channelId: 15,
			},
			{
				message: "Tips and Tricks: Here's how I solve Sudoku puzzles",
				sender_id: 16,
				channelId: 16,
			},
			{
				message: "Tennis players, what's your favorite surface to play on?",
				sender_id: 17,
				channelId: 17,
			},
			{
				message: "Tournaments: Who's going to the US Open this year?",
				sender_id: 18,
				channelId: 18,
			},
			{
				message: "Swimmers, what's your favorite stroke?",
				sender_id: 19,
				channelId: 19,
			},
			{
				message:
					"Training and techniques: Here's my favorite workout to improve my freestyle",
				sender_id: 20,
				channelId: 20,
			},
			{
				message: "Golfers, what's your favorite golf course?",
				sender_id: 21,
				channelId: 21,
			},
			{
				message:
					"Equipment: Anyone have experience with the new Callaway Epic driver?",
				sender_id: 22,
				channelId: 22,
			},
			{ message: "Hey JohnS, how's it going?", sender_id: 2, dmId: 1 },
			{ message: "Not too bad, JaneD. How about you?", sender_id: 1, dmId: 1 },
			{
				message: "I'm good thanks, BobB. How's work been?",
				sender_id: 1,
				dmId: 2,
			},
			{
				message: "It's been busy, but manageable. How about for you?",
				sender_id: 3,
				dmId: 2,
			},
			{
				message: "Hey Samantha, are you going to the concert tonight?",
				sender_id: 4,
				dmId: 3,
			},
			{
				message: "I can't wait, Michael! I heard the band is amazing live.",
				sender_id: 5,
				dmId: 3,
			},
			{
				message: "Emily, have you seen the new movie that just came out?",
				sender_id: 6,
				dmId: 4,
			},
			{
				message:
					"No, I haven't yet. But I heard it's really good. Joshua, have you seen it?",
				sender_id: 7,
				dmId: 4,
			},
			{
				message: "Ashley, do you have plans for the weekend?",
				sender_id: 8,
				dmId: 5,
			},
			{ message: "Not yet, Matthew. How about you?", sender_id: 9, dmId: 5 },
			{
				message: "Daniel, do you want to grab lunch together today?",
				sender_id: 10,
				dmId: 6,
			},
			{ message: "Sure, that sounds great!", sender_id: 11, dmId: 6 },
			{ sender_id: 1, channelId: 1, imageId: 1 },
			{ sender_id: 2, dmId: 1, imageId: 4 },
		]);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		return queryInterface.bulkDelete("Messages", null, {});
	},
};
