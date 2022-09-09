/**
 * Author:	Nick Jasinski
 * Date:		2022-09-09
 *
 * Model for integration with dokuwiki sqlauth,
 * represents what group a user is in
 */

const Sequelize = require("sequelize");
const db = require("../db");

const Group = db.define("group", {
  /**
   * name of the group
   */
  groupName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },

  /**
   * description of the group
   */
  description: {
    type: Sequelize.TEXT,
  },
});

module.exports = Group;
