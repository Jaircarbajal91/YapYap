"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert("ChatMembers", [
			// Demo_User's server memberships (3 servers)
			{ userId: 1, serverId: 1 }, // Demo_User in Gaming server
			{ userId: 1, serverId: 2 }, // Demo_User in Tech Talk server
			{ userId: 1, serverId: 3 }, // Demo_User in Music Lovers server
			
			// Add some friends to Demo_User's servers
			{ userId: 2, serverId: 1 }, // kevbot in Gaming
			{ userId: 3, serverId: 1 }, // jairbot in Gaming
			{ userId: 4, serverId: 2 }, // JohnSmith in Tech Talk
			{ userId: 5, serverId: 2 }, // EmilyBrown in Tech Talk
			{ userId: 6, serverId: 3 }, // MichaelJohnson in Music Lovers
			{ userId: 7, serverId: 3 }, // JessicaWilliams in Music Lovers
			
			// Other server memberships
			{ userId: 2, serverId: 4 },
			{ userId: 3, serverId: 5 },
			{ userId: 4, serverId: 6 },
			{ userId: 5, serverId: 7 },
			{ userId: 6, serverId: 8 },
			{ userId: 7, serverId: 9 },
			{ userId: 8, serverId: 10 },
			{ userId: 9, serverId: 11 },
			{ userId: 10, serverId: 12 },
			{ userId: 11, serverId: 13 },
			
			// Demo_User's DM memberships (10 DMs with friends)
			{ userId: 1, dmId: 1 }, // Demo_User <-> kevbot
			{ userId: 2, dmId: 1 },
			{ userId: 1, dmId: 2 }, // Demo_User <-> jairbot
			{ userId: 3, dmId: 2 },
			{ userId: 1, dmId: 3 }, // Demo_User <-> JohnSmith
			{ userId: 4, dmId: 3 },
			{ userId: 1, dmId: 4 }, // Demo_User <-> EmilyBrown
			{ userId: 5, dmId: 4 },
			{ userId: 1, dmId: 5 }, // Demo_User <-> MichaelJohnson
			{ userId: 6, dmId: 5 },
			{ userId: 1, dmId: 6 }, // Demo_User <-> JessicaWilliams
			{ userId: 7, dmId: 6 },
			{ userId: 1, dmId: 7 }, // Demo_User <-> MatthewJones
			{ userId: 8, dmId: 7 },
			{ userId: 1, dmId: 8 }, // Demo_User <-> AshleySmith
			{ userId: 9, dmId: 8 },
			{ userId: 1, dmId: 9 }, // Demo_User <-> DavidJohnson
			{ userId: 10, dmId: 9 },
			{ userId: 1, dmId: 10 }, // Demo_User <-> EmilyJones
			{ userId: 11, dmId: 10 },
			
			// Other DMs
			{ userId: 12, dmId: 11 },
			{ userId: 13, dmId: 11 },
			{ userId: 14, dmId: 12 },
			{ userId: 15, dmId: 12 },
		]);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete("ChatMembers", null, {});
	},
};
