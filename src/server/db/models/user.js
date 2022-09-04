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
    defaultValue: "",
  },
  lastName: {
    type: Sequelize.STRING,
    defaultValue: "",
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  /**
   * for admin perms
   */
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
   * DBux owned by the user
   */
  tokens: {
    type: Sequelize.DOUBLE,
    defaultValue: 0,
  },

  /**
   * status as current student
   */
  currentStudent: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
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
  /**
   * Cell contact info
   */
  phone: {
    type: Sequelize.STRING,
    defaultValue: "",
  },
  /**
   * Caltech specific information below
   *
   * uuid, and then room number
   */
  uuid: {
    type: Sequelize.INTEGER,
    defaultValue: 42069,
  },
  profile: {
    type: Sequelize.JSON,
    defaultValue: {
      photo: "/resources/images/defaultProfile.png",
      room: "420 Dabney Hovse",
      bio: "",
    },
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

const setVerification = async (user) => {
  await Verification.create({
    userId: user.id,
    email: user.personalEmail,
    emailType: "personal",
  });
  await Verification.create({
    userId: user.id,
    email: user.caltechEmail,
    emailType: "caltech",
  });
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate((users) => {
  users.forEach(setSaltAndPassword);
});

User.afterCreate(setVerification);
User.afterBulkCreate((users) => {
  users.forEach(setVerification);
});

module.exports = User;
