/**
 * Just another middleware functino, seperated out as it imports
 * database stuff
 */

const { Key, Scope } = require("../../db/models");

/**
 * Check if there is an api key in
 * the query params or body params and then
 * populate the req with an api key object which we
 * expect to have all the fields of the api key instance from the db
 * with the addition of a "scopes" field which
 * is an array of strings representing the scope
 *
 * key object:
 *
 *
 * @param {*} req the incoming request
 * @param {*} res the response obj
 * @param {*} next next
 */
const populateApiKey = async (req, res, next) => {
  // TODO

  Key.find

};

module.exports = { hasApiKey };
