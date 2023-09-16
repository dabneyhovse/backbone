/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * Simmple seed script for users, havnt tested this yet,
 * just a copy pase from a different project
 */
// const prompt = require("prompt");

require("dotenv").config();

// if (module === require.main) {
//   console.log("Updating Users");
//   prompt.start();
//   prompt.get(["DATABASE_URL"], (err, result) => {
//     if (result.DATABASE_URL !== "") {
//       console.log("Updating with db:\t", result.DATABASE_URL);
//       process.env.DATABASE_URL = result.DATABASE_URL;
//     }
//     load_and_run();
//   });
// }

async function load_and_run() {
  const { User } = require("../../server/db/models");

  async function seed_users() {
    console.log("Seeding User 1");
    await User.create({
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      telegram_id: "569239019",
      isAdmin: true,
      password: "password",
    });

    await User.create({
      firstName: "Test2",
      lastName: "User2",
      username: "testuser2",
      isAdmin: false,
      password: "password",
    });
  }
  await seed_users();
}

module.exports = { seed_users: load_and_run };
