/**
 * Author:	Nick Jasinski
 * Date:		2024-02-14
 *
 * Model for managing api keys
 * each instance represents an api key for a service
 * each bot / service that wants to use the api
 * should probaby have its own key
 */

const Sequelize = require("sequelize");
const db = require("../db");

const Key = db.define("key", {
  /**
   * name of the service using the key
   */
  service: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },

  /**
   * description of the service
   */
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

  /**
   * the api key (hashed)
   */
  value: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue("value");
    },
  },

  /**
   * used to decode value
   */
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue("salt");
    },
  },
});

Key.prototype.correctKey = function (candidateKey) {
  return User.encryptKey(candidateKey, this.salt()) === this.key();
};

Key.generateSalt = function () {
  return crypto.randomBytes(16).toString("base64");
};

Key.encryptKey = function (plainText, salt) {
  return crypto
    .createHash("RSA-SHA256")
    .update(plainText)
    .update(salt)
    .digest("hex");
};

const setSaltAndKey = (key) => {
  if (key.changed("value")) {
    key.salt = Key.generateSalt();
    key.password = Key.encryptPassword(key.password(), key.salt());
  }
};

Key.beforeCreate(setSaltAndKey);
Key.beforeUpdate(setSaltAndKey);
Key.beforeBulkCreate((keys) => {
  keys.forEach(setSaltAndKey);
});

module.exports = Key;