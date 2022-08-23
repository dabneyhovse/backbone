/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * Simple user sequelize model. Password is automatically salted
 */

const crypto = require("crypto");
const Sequelize = require("sequelize");
const db = require("../db");
const Verification = require("./verification");

const User = db.define("user", {
  /**
   * below three are obvious
   */
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  username: {
    type: Sequelize.STRING,
  },
  /**
   * the below two are emails for verifaction and contact purposes
   */
  personalEmail: {
    type: Sequelize.STRING,
  },
  caltechEmail: {
    type: Sequelize.STRING,
  },
  /**
   * optional telegram linking
   */
  telegram_id: {
    type: Sequelize.STRING,
    defaultValue: null,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  password: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue("password");
    },
  },
  /**
   * used to decode password
   */
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue("salt");
    },
  },
  passwordReset: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  /**
   * below two fields are for account verification
   * mainly verify caltech email
   */
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  /**
   * DBux owned by the user
   */
  tokens: {
    type: Sequelize.DOUBLE,
    defaultValue: 0,
  },
});

User.prototype.correctPassword = function (candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password();
};

User.generateSalt = function () {
  return crypto.randomBytes(16).toString("base64");
};

User.encryptPassword = function (plainText, salt) {
  return crypto
    .createHash("RSA-SHA256")
    .update(plainText)
    .update(salt)
    .digest("hex");
};

const setSaltAndPassword = (user) => {
  if (user.changed("password")) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};

const setVerification = (user) => {
  Verification.create({
    userId: user.id,
    email: user.personalEmail,
    emailType: "personal",
  });
  Verification.create({
    userId: user.id,
    email: user.caltechEmail,
    emailType: "caltech",
  });
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate((users) => {
  users.forEach(setSaltAndPassword);
  users.forEach(setVerification);
});

User.beforeCreate(setVerification);
module.exports = User;
