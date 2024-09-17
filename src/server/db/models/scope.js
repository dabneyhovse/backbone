// /**
//  * Author:	Nick Jasinski
//  * Date:		2024-02-14
//  *
//  * Model for integration with dokuwiki sqlauth,
//  * represents what group a user is in
//  */

// const Sequelize = require("sequelize");
// const db = require("../db");


// const Scope = db.define("scope", {
//   /**
//    * name of the scope
//    */
//   name: {
//     type: Sequelize.STRING,
//     unique: true,
//     allowNull: false,
//   },

//   /**
//    * description of the scope, ie what it gives perms to
//    */
//   description: {
//     type: Sequelize.TEXT,
//     allowNull: false,
//   },
// });

// module.exports = Scope;
