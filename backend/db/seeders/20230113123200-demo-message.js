"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert("Messages", [
			// Demo_User's messages in Gaming server channels
			{
				message: "Hey everyone! What games are you all playing right now?",
				senderId: 1,
				channelId: 1, // general channel in Gaming server
			},
			{
				message: "Just finished Elden Ring - absolutely amazing! Highly recommend it.",
				senderId: 1,
				channelId: 2, // game-reviews channel in Gaming server
			},
			
			// Demo_User's messages in Tech Talk server channels
			{
				message: "Anyone working on any cool projects? I'm building a chat app!",
				senderId: 1,
				channelId: 3, // general channel in Tech Talk server
			},
			{
				message: "Stuck on a React issue - can anyone help with state management?",
				senderId: 1,
				channelId: 4, // coding-help channel in Tech Talk server
			},
			
			// Demo_User's messages in Music Lovers server
			{
				message: "What's everyone listening to today? I'm on a jazz kick!",
				senderId: 1,
				channelId: 5, // general channel in Music Lovers server
			},
			
			// Demo_User's DM messages
			{ message: "Hey kevbot! How's it going?", senderId: 1, dmId: 1 },
			{ message: "Not too bad! Working on some new features. You?", senderId: 2, dmId: 1 },
			{ message: "Same here! Just finished a big refactor.", senderId: 1, dmId: 1 },
			
			{ message: "jairbot, are you free to pair program later?", senderId: 1, dmId: 2 },
			{ message: "Yeah, I'm free after 3pm. What are we working on?", senderId: 3, dmId: 2 },
			
			{ message: "JohnS, did you see the new framework release?", senderId: 1, dmId: 3 },
			{ message: "Yes! Excited to try it out this weekend.", senderId: 4, dmId: 3 },
			
			{ message: "EmiB, thanks for the help with that bug yesterday!", senderId: 1, dmId: 4 },
			{ message: "No problem! Happy to help anytime.", senderId: 5, dmId: 4 },
			
			{ message: "MikeJ, want to grab coffee this week?", senderId: 1, dmId: 5 },
			{ message: "Sure! How about Thursday?", senderId: 6, dmId: 5 },
			
			{ message: "JessW, did you finish that project?", senderId: 1, dmId: 6 },
			{ message: "Almost done! Just need to add tests.", senderId: 7, dmId: 6 },
			
			{ message: "MattJ, are you going to the meetup?", senderId: 1, dmId: 7 },
			{ message: "Yes! See you there.", senderId: 8, dmId: 7 },
			
			{ message: "AshS, can you review my PR when you get a chance?", senderId: 1, dmId: 8 },
			{ message: "Will do! I'll take a look this afternoon.", senderId: 9, dmId: 8 },
			
			{ message: "DaveJ, how's the new job going?", senderId: 1, dmId: 9 },
			{ message: "Great! Really enjoying the team and projects.", senderId: 10, dmId: 9 },
			
			{ message: "EmiJ, want to collaborate on that idea we discussed?", senderId: 1, dmId: 10 },
			{ message: "Absolutely! Let's set up a time to plan it out.", senderId: 11, dmId: 10 },
			
			// Other channel messages (in other servers)
			{
				message: "Hey Gardeners! Who's ready for spring planting season?",
				senderId: 2,
				channelId: 6, // Gardeners channel in Gardening server
			},
			{
				message:
					"I just picked some beautiful flowers from my garden, anyone want to share their flower pictures?",
				senderId: 3,
				channelId: 7, // Flower Picking channel in Gardening server
			},
			{
				message: "Fishers, what's your go-to bait for bass?",
				senderId: 4,
				channelId: 8, // Fishers channel in Fishing server
			},
			{
				message: "Catch of the day: 3 lb bass! What did you guys catch today?",
				senderId: 5,
				channelId: 9, // Catch of the day channel in Fishing server
			},
			{
				message:
					"Who's up for a cooking challenge this weekend? Theme: seafood",
				senderId: 6,
				channelId: 10, // Chefs channel in Cooking server
			},
			{
				message:
					"I just tried this recipe for shrimp scampi and it was a hit! Anyone want the recipe?",
				senderId: 7,
				channelId: 11, // Recipes channel in Cooking server
			},
			{
				message:
					"Soccer fans, what do you think of the new formation the coach is using?",
				senderId: 8,
				channelId: 12, // Soccer Fans channel
			},
			{
				message:
					"Match discussions: Who do you think will win the match tonight?",
				senderId: 9,
				channelId: 13, // Match Discussions channel
			},
			{
				message:
					"Basketball fans, what do you think of Lebron's performance this season?",
				senderId: 10,
				channelId: 14, // Basketball Fans channel
			},
			{
				message: "Player discussions: Who is your favorite player and why?",
				senderId: 11,
				channelId: 15, // Player discussions channel
			},
			{
				message: "Hikers, what's your favorite trail to hike?",
				senderId: 12,
				channelId: 16, // Hikers channel
			},
			{
				message:
					"I just finished the John Muir trail, it was challenging but worth it! Who's up for a hiking trip?",
				senderId: 13,
				channelId: 17, // Trails channel
			},
			{
				message: "Puzzle fans, what's your current puzzle?",
				senderId: 14,
				channelId: 18, // Puzzle Fans channel
			},
			{
				message: "Tips and Tricks: Here's how I solve Sudoku puzzles",
				senderId: 15,
				channelId: 19, // Tips and Tricks channel
			},
			{
				message: "Tennis players, what's your favorite surface to play on?",
				senderId: 16,
				channelId: 20, // Tennis players channel
			},
			{
				message: "Tournaments: Who's going to the US Open this year?",
				senderId: 17,
				channelId: 21, // Tournaments channel
			},
			{
				message: "Swimmers, what's your favorite stroke?",
				senderId: 18,
				channelId: 22, // Swimmers channel
			},
			{
				message:
					"Training and techniques: Here's my favorite workout to improve my freestyle",
				senderId: 19,
				channelId: 23, // Training and techniques channel
			},
			{
				message: "Golfers, what's your favorite golf course?",
				senderId: 20,
				channelId: 24, // Golfers channel
			},
			{
				message:
					"Equipment: Anyone have experience with the new Callaway Epic driver?",
				senderId: 21,
				channelId: 25, // Equipment channel
			},
			
			// Other DMs (not involving Demo_User)
			{ message: "Hey, how's it going?", senderId: 12, dmId: 11 },
			{ message: "Pretty good! How about you?", senderId: 13, dmId: 11 },
			{ message: "Want to hang out this weekend?", senderId: 14, dmId: 12 },
			{ message: "Sure! What did you have in mind?", senderId: 15, dmId: 12 },
		]);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete("Messages", null, {});
	},
};
