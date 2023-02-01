'use strict';
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        username: "Demo_User",
        email: "demo@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "demolition",
      },
      {
        username: "kevbot",
        email: "kevbot@yapyap.io",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        username: "jairbot",
        email: "jairbot@yapyap.io",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        username: "JohnSmith",
        email: "JohnSmith@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "JohnS",
        },
        {
        username: "EmilyBrown",
        email: "EmilyBrown@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "EmiB",
        },
        {
        username: "MichaelJohnson",
        email: "MichaelJohnson@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "MikeJ",
        },
        {
        username: "JessicaWilliams",
        email: "JessicaWilliams@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "JessW",
        },
        {
        username: "MatthewJones",
        email: "MatthewJones@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "MattJ",
        },
        {
        username: "AshleySmith",
        email: "AshleySmith@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "AshS",
        },
        {
        username: "DavidJohnson",
        email: "DavidJohnson@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "DaveJ",
        },
        {
        username: "EmilyJones",
        email: "EmilyJones@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "EmiJ",
        },
        {
        username: "JacobSmith",
        email: "JacobSmith@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "JakeS",
        },
        {
        username: "NicholasWilliams",
        email: "NicholasWilliams@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "NickW",
        },
        {
        username: "JoshuaBrown",
        email: "JoshuaBrown@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "JoshB",
        },
        {
        username: "MadisonJohnson",
        email: "MadisonJohnson@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "MadJ",
        },
        {
        username: "AlyssaJones",
        email: "AlyssaJones@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "AlyJ",
        },
        {
        username: "MatthewSmith",
        email: "MatthewSmith@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "MattS",
        },
        {
        username: "RachelWilliams",
        email: "RachelWilliams@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "RachW",
        },
        {username: "JaneDoe", email: "JaneDoe@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "JaneD"},
        {username: "BobBuilder", email: "BobBuilder@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "BobB"},
        {username: "SamanthaS", email: "SamanthaS@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Samantha"},
        {username: "MichaelM", email: "MichaelM@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Michael"},
        {username: "EmilyE", email: "EmilyE@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Emily"},
        {username: "JoshuaJ", email: "JoshuaJ@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Joshua"},
        {username: "AshleyA", email: "AshleyA@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Ashley"},
        {username: "MatthewM", email: "MatthewM@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Matthew"},
        {username: "DanielD", email: "DanielD@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Daniel"},
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("Users", {
      username: { [Op.in]: ["Demo_User", "kevbot", "jairbot", "JohnSmith", "EmilyBrown", "MichaelJohnson", "JessicaWilliams", "MatthewJones", "AshleySmith", "DavidJohnson", "EmilyJones", "JacobSmith", "NicholasWilliams", "JoshuaBrown", "MadisonJohnson", "AlyssaJones", "MatthewSmith", "RachelWilliams"] }
  }, {});
  }
};
