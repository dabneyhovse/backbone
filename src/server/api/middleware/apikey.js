/**
 * Just another middleware function, seperated out as it imports
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
  // if not in query, then check body. If its neither it'll be undefined so we good
  let { api_key } = req.query.api_key !== undefined ? req.query : req.body;

  // no key, just move on
  if (api_key == undefined) {
    next();
    return;
  }

  // check for match with custom method, see key model in db
  apiKeyMatch = await Key.findMatch(api_key);

  // doesnt match any api key, just ignore
  // could have this throw an error but meh
  // the middleware later will error if it needed it
  if (apiKeyMatch == undefined) {
    next();
    return;
  }

  // attach api_key obj with list of scopes to the req
  // map the scope to just the name, as thats what
  // the hasApiScope middleware checks
  req.api_key = {
    id: apiKeyMatch.id,
    name: apiKeyMatch.name,
    description: apiKeyMatch.description,
    scopes:
      apiKeyMatch.scopes == undefined
        ? []
        : apiKeyMatch.scopes.map((scope) => scope.name),
  };

  next();
};

module.exports = { populateApiKey };
