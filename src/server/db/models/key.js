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
const Scope = require("./scope");
const crypto = require("crypto");

const Key = db.define("key", {
  /**
   * name of the service using the key
   */
  name: {
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
  hash: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue("hash");
    },
    unique: true,
  },

  /**
   * the api key (unhashed), set to null after a few minutes of existing
   */
  unhashed: {
    type: Sequelize.STRING,
  }
});

// generate a new api key,
Key.generateKey = (key) => {
  const buffer = crypto.randomBytes(32);
  apikey = buffer.toString("base64");

  key.hash = apikey;
  key.unhashed = apikey;
};

// compare key function, probably not used
Key.prototype.correctKey = (candidateKey) =>
  Key.encryptKey(candidateKey) === this.hash();

// encrypt function
Key.encryptKey = (plainText) =>
  crypto.createHash("RSA-SHA256").update(plainText).digest("hex");

// input the pain key (from request), and find then entry that
// matches the encrypted version.
Key.findMatch = async (key) => {
  hash = Key.encryptKey(key);
  key = await Key.findOne({ where: { hash }, include: Scope });
  return key;
};

// encrypt the key on changes
const setKeyValue = (key) => {
  if (key.changed("hash")) {
    key.hash = Key.encryptKey(key.hash());
  }
};

// generate the key value
Key.beforeCreate(Key.generateKey);
// then hash it here
Key.beforeCreate(setKeyValue);
// and on any other updates
Key.beforeUpdate(setKeyValue);
Key.beforeBulkCreate((keys) => {
  keys.forEach(setSaltAndKey);
});

module.exports = Key;
