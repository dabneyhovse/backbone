/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * verification model to save hashes for when account is made
 */

const crypto = require("crypto");
const Sequelize = require("sequelize");
const db = require("../db");

const sendEmail = require("module-dabney-email");

const Verification = db.define("verification", {
  hash: {
    type: Sequelize.STRING,
  },
  emailType: {
    type: Sequelize.ENUM(["personal", "caltech"]),
  },
  email: {
    type: Sequelize.STRING,
  },
});

const createHash = async (ver, options) => {
  let notUnique = true;
  let hash = "";
  while (notUnique) {
    hash = crypto
      .createHmac("sha256", process.env.HASH_SECRET)
      .update(`${Math.random()}`)
      .digest("hex");

    let duplicates = await Verification.findAll({
      where: {
        hash,
      },
    });
    notUnique = duplicates.length > 0;
  }
  ver.hash = hash;

  await sendEmail(
    ver.email,
    "Dabney Hovse Email Verification",
    `Hello, <br>Please verify your email by clicking the link below:<br><br><a href="https://dabney.caltech.edu/verify#${hash}">https://dabney.caltech.edu/verify#${hash}</a>`
  );
};

Verification.beforeCreate(createHash);
Verification.beforeBulkCreate((verifications) => {
  verifications.forEach(createHash);
});

module.exports = Verification;
