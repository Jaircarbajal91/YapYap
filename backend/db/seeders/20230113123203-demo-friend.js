'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Clear any existing friendships first to avoid conflicts
    await queryInterface.bulkDelete("Friends", null, {});
    
    // Demo_User (userId: 1) friends with 10 other users
    return queryInterface.bulkInsert("Friends", [
      { userId: 1, friendId: 2 }, // Demo_User friends with kevbot
      { userId: 1, friendId: 3 }, // Demo_User friends with jairbot
      { userId: 1, friendId: 4 }, // Demo_User friends with JohnSmith
      { userId: 1, friendId: 5 }, // Demo_User friends with EmilyBrown
      { userId: 1, friendId: 6 }, // Demo_User friends with MichaelJohnson
      { userId: 1, friendId: 7 }, // Demo_User friends with JessicaWilliams
      { userId: 1, friendId: 8 }, // Demo_User friends with MatthewJones
      { userId: 1, friendId: 9 }, // Demo_User friends with AshleySmith
      { userId: 1, friendId: 10 }, // Demo_User friends with DavidJohnson
      { userId: 1, friendId: 11 }, // Demo_User friends with EmilyJones
      
      // Reciprocal friendships (friendship is bidirectional)
      { userId: 2, friendId: 1 }, // kevbot friends with Demo_User
      { userId: 3, friendId: 1 }, // jairbot friends with Demo_User
      { userId: 4, friendId: 1 }, // JohnSmith friends with Demo_User
      { userId: 5, friendId: 1 }, // EmilyBrown friends with Demo_User
      { userId: 6, friendId: 1 }, // MichaelJohnson friends with Demo_User
      { userId: 7, friendId: 1 }, // JessicaWilliams friends with Demo_User
      { userId: 8, friendId: 1 }, // MatthewJones friends with Demo_User
      { userId: 9, friendId: 1 }, // AshleySmith friends with Demo_User
      { userId: 10, friendId: 1 }, // DavidJohnson friends with Demo_User
      { userId: 11, friendId: 1 }, // EmilyJones friends with Demo_User
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Friends", null, {});
  }
};

