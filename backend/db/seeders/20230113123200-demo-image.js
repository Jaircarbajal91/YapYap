'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Images", [
      // User avatars using Dicebear (27 users)
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=Demo_User&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=kevbot&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=jairbot&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=JohnSmith&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=EmilyBrown&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=MichaelJohnson&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=JessicaWilliams&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=MatthewJones&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=AshleySmith&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=DavidJohnson&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=EmilyJones&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=JacobSmith&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=NicholasWilliams&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=JoshuaBrown&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=MadisonJohnson&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=AlyssaJones&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=MatthewSmith&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=RachelWilliams&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=JaneDoe&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=BobBuilder&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=SamanthaS&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=MichaelM&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=EmilyE&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=JoshuaJ&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=AshleyA&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=MatthewM&backgroundType=gradientLinear" },
      { type: "user", url: "https://api.dicebear.com/5.x/identicon/svg?seed=DanielD&backgroundType=gradientLinear" },
      
      // Server images for Demo_User's servers (3 servers)
      { type: "server", url: "https://api.dicebear.com/5.x/identicon/svg?seed=GamingServer&backgroundType=gradientLinear" },
      { type: "server", url: "https://api.dicebear.com/5.x/identicon/svg?seed=TechTalkServer&backgroundType=gradientLinear" },
      { type: "server", url: "https://api.dicebear.com/5.x/identicon/svg?seed=MusicLoversServer&backgroundType=gradientLinear" },
      
      // Additional server images for other servers
      { type: "server", url: "https://api.dicebear.com/5.x/identicon/svg?seed=GardeningServer&backgroundType=gradientLinear" },
      { type: "server", url: "https://api.dicebear.com/5.x/identicon/svg?seed=FishingServer&backgroundType=gradientLinear" },
      { type: "server", url: "https://api.dicebear.com/5.x/identicon/svg?seed=CookingServer&backgroundType=gradientLinear" },
      
      // Message images (optional, for message attachments)
      { type: "message", url: "https://api.dicebear.com/5.x/identicon/svg?seed=message1&backgroundType=gradientLinear" },
      { type: "message", url: "https://api.dicebear.com/5.x/identicon/svg?seed=message2&backgroundType=gradientLinear" },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Images", null, {});
  }
};
