"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert("Messages", [
			{
				message: "Hey Gardeners! Who's ready for spring planting season?",
				senderId: 1,
				channelId: 1,
			},
			{
				message:
					"I just picked some beautiful flowers from my garden, anyone want to share their flower pictures?",
				senderId: 2,
				channelId: 2,
			},
			{
				message: "Fishers, what's your go-to bait for bass?",
				senderId: 3,
				channelId: 3,
			},
			{
				message: "Catch of the day: 3 lb bass! What did you guys catch today?",
				senderId: 4,
				channelId: 4,
			},
			{
				message:
					"Who's up for a cooking challenge this weekend? Theme: seafood",
				senderId: 5,
				channelId: 5,
			},
			{
				message:
					"I just tried this recipe for shrimp scampi and it was a hit! Anyone want the recipe?",
				senderId: 6,
				channelId: 6,
			},
			{
				message:
					"Soccer fans, what do you think of the new formation the coach is using?",
				senderId: 7,
				channelId: 7,
			},
			{
				message:
					"Match discussions: Who do you think will win the match tonight?",
				senderId: 8,
				channelId: 8,
			},
			{
				message:
					"Basketball fans, what do you think of Lebron's performance this season?",
				senderId: 9,
				channelId: 9,
			},
			{
				message: "Player discussions: Who is your favorite player and why?",
				senderId: 10,
				channelId: 10,
			},
			{
				message: "Hikers, what's your favorite trail to hike?",
				senderId: 11,
				channelId: 11,
			},
			{
				message:
					"I just finished the John Muir trail, it was challenging but worth it! Who's up for a hiking trip?",
				senderId: 12,
				channelId: 12,
			},
			{
				message: "Gamers, what's your favorite game to play?",
				senderId: 13,
				channelId: 13,
			},
			{
				message:
					"Game reviews: I just finished playing Cyberpunk 2077, here are my thoughts",
				senderId: 14,
				channelId: 14,
			},
			{
				message: "Puzzle fans, what's your current puzzle?",
				senderId: 15,
				channelId: 15,
			},
			{
				message: "Tips and Tricks: Here's how I solve Sudoku puzzles",
				senderId: 16,
				channelId: 16,
			},
			{
				message: "Tennis players, what's your favorite surface to play on?",
				senderId: 17,
				channelId: 17,
			},
			{
				message: "Tournaments: Who's going to the US Open this year?",
				senderId: 18,
				channelId: 18,
			},
			{
				message: "Swimmers, what's your favorite stroke?",
				senderId: 19,
				channelId: 19,
			},
			{
				message:
					"Training and techniques: Here's my favorite workout to improve my freestyle",
				senderId: 20,
				channelId: 20,
			},
			{
				message: "Golfers, what's your favorite golf course?",
				senderId: 21,
				channelId: 21,
			},
			{
				message:
					"Equipment: Anyone have experience with the new Callaway Epic driver?",
				senderId: 22,
				channelId: 22,
			},
			{ message: "Hey JohnS, how's it going?", senderId: 2, dmId: 1 },
			{ message: "Not too bad, JaneD. How about you?", senderId: 1, dmId: 1 },
			{
				message: "I'm good thanks, BobB. How's work been?",
				senderId: 1,
				dmId: 2,
			},
			{
				message: "It's been busy, but manageable. How about for you?",
				senderId: 3,
				dmId: 2,
			},
			{
				message: "Hey Samantha, are you going to the concert tonight?",
				senderId: 4,
				dmId: 3,
			},
			{
				message: "I can't wait, Michael! I heard the band is amazing live.",
				senderId: 5,
				dmId: 3,
			},
			{
				message: "Emily, have you seen the new movie that just came out?",
				senderId: 6,
				dmId: 4,
			},
			{
				message:
					"No, I haven't yet. But I heard it's really good. Joshua, have you seen it?",
				senderId: 7,
				dmId: 4,
			},
			{
				message: "Ashley, do you have plans for the weekend?",
				senderId: 8,
				dmId: 5,
			},
			{ message: "Not yet, Matthew. How about you?", senderId: 9, dmId: 5 },
			{
				message: "Daniel, do you want to grab lunch together today?",
				senderId: 10,
				dmId: 6,
			},
			{ message: "Sure, that sounds great!", senderId: 11, dmId: 6 },
			{ senderId: 1, channelId: 1, imageId: 1 },
			{ senderId: 2, dmId: 1, imageId: 4 },
		]);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete("Messages", null, {});
	},
};
