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
        imageId: 1,
      },
      {
        username: "kevbot",
        email: "kevbot@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        imageId: 2,
      },
      {
        username: "jairbot",
        email: "jairbot@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        imageId: 3,
      },
      {
        username: "JohnSmith",
        email: "JohnSmith@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "JohnS",
        imageId: 4,
        },
        {
        username: "EmilyBrown",
        email: "EmilyBrown@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "EmiB",
        imageId: 5,
        },
        {
        username: "MichaelJohnson",
        email: "MichaelJohnson@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "MikeJ",
        imageId: 6,
        },
        {
        username: "JessicaWilliams",
        email: "JessicaWilliams@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "JessW",
        imageId: 7,
        },
        {
        username: "MatthewJones",
        email: "MatthewJones@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "MattJ",
        imageId: 8,
        },
        {
        username: "AshleySmith",
        email: "AshleySmith@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "AshS",
        imageId: 9,
        },
        {
        username: "DavidJohnson",
        email: "DavidJohnson@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "DaveJ",
        imageId: 10,
        },
        {
        username: "EmilyJones",
        email: "EmilyJones@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "EmiJ",
        imageId: 11,
        },
        {
        username: "JacobSmith",
        email: "JacobSmith@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "JakeS",
        imageId: 12,
        },
        {
        username: "NicholasWilliams",
        email: "NicholasWilliams@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "NickW",
        imageId: 13,
        },
        {
        username: "JoshuaBrown",
        email: "JoshuaBrown@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "JoshB",
        imageId: 14,
        },
        {
        username: "MadisonJohnson",
        email: "MadisonJohnson@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "MadJ",
        imageId: 15,
        },
        {
        username: "AlyssaJones",
        email: "AlyssaJones@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "AlyJ",
        imageId: 16,
        },
        {
        username: "MatthewSmith",
        email: "MatthewSmith@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "MattS",
        imageId: 17,
        },
        {
        username: "RachelWilliams",
        email: "RachelWilliams@yapyap.io",
        hashedPassword: bcrypt.hashSync("password"),
        alias: "RachW",
        imageId: 18,
        },
        {username: "JaneDoe", email: "JaneDoe@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "JaneD", imageId: 19},
        {username: "BobBuilder", email: "BobBuilder@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "BobB", imageId: 20},
        {username: "SamanthaS", email: "SamanthaS@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Samantha", imageId: 21},
        {username: "MichaelM", email: "MichaelM@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Michael", imageId: 22},
        {username: "EmilyE", email: "EmilyE@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Emily", imageId: 23},
        {username: "JoshuaJ", email: "JoshuaJ@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Joshua", imageId: 24},
        {username: "AshleyA", email: "AshleyA@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Ashley", imageId: 25},
        {username: "MatthewM", email: "MatthewM@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Matthew", imageId: 26},
        {username: "DanielD", email: "DanielD@yapyap.io", hashedPassword: bcrypt.hashSync("password"), alias: "Daniel", imageId: 27},
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("Users", {
      username: { [Op.in]: ["Demo_User", "kevbot", "jairbot", "JohnSmith", "EmilyBrown", "MichaelJohnson", "JessicaWilliams", "MatthewJones", "AshleySmith", "DavidJohnson", "EmilyJones", "JacobSmith", "NicholasWilliams", "JoshuaBrown", "MadisonJohnson", "AlyssaJones", "MatthewSmith", "RachelWilliams"] }
  }, {});
  }
};
