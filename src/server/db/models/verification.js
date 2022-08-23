/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * verification model to save hashes for when account is made
 */

const crypto = require("crypto");
const Sequelize = require("sequelize");
const db = require("../db");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Verification = db.define("user", {
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

const createHash = (ver) => {
  ver.hash = crypto.createHash("sha256");

  // TODO send email

  // console.log("sending email");
  // const msg = {
  //   to: ver.email,
  //   from: process.env.VERIFICATION_EMAIL,
  //   subject: "Dabney Hovse Email Verification",
  //   text: "Please verify your email by clicking the link below:\ndabney.calech.edu/verify/${hash}",
  //   html: `<p>Please verify your email by clicking the link below:</p><br><a href = "dabney.calech.edu/verify/${hash}">dabney.calech.edu/verify/${hash}</a>`,
  // };
  // sgMail
  //   .send(msg)
  //   .then(() => {
  //     console.log("Email sent");
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
};

Verification.beforeCreate(createHash);
Verification.beforeBulkCreate((verifications) => {
  verifications.forEach(createHash);
});

module.exports = Verification;
