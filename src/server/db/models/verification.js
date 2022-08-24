/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * verification model to save hashes for when account is made
 */

const crypto = require("crypto");
const Sequelize = require("sequelize");
const db = require("../db");

const Verification = db.define("verification", {
  hash: {
    type: Sequelize.STRING,
  },
  userId: {
    type: Sequelize.INTEGER,
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

  // For whatever reason this only works when i require it here...
  // why cant these packages be normal...
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: ver.email, // Change to your recipient
    from: process.env.VERIFICATION_EMAIL, // Change to your verified sender
    subject: "Dabney Hovse Email Verification",
    text: `Hello, Please verify your email by clicking the link below: https://dabney.caltech.edu/verify/${hash}`,
    html: `Hello, <br>Please verify your email by clicking the link below:<br><br><a href="https://dabney.caltech.edu/verify/${hash}">https://dabney.caltech.edu/verify/${hash}</a>`,
  };
  sgMail
    .send(msg)
    .then(() => {})
    .catch((error) => {
      console.error(error);
    });
};

Verification.beforeCreate(createHash);
Verification.beforeBulkCreate((verifications) => {
  verifications.forEach(createHash);
});

module.exports = Verification;
