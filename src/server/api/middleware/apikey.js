/**
 * Just another middleware functino, seperated out
 *
 */


const { Key, Scope } = require("../../db/models");
// middleware generator, will allow the request if
// the req.query.api_key exists and has the perm
// TODO add actual apikey db
const hasApiKey = (perm) => async (req, res, next) => {
  try {

    const key = await Key.findOne({where:{value:}})
    if (!req.query.api_key) {
      // no api key
      err = new Error("missing api key");
      err.status = 400;
      throw err;
    }

    // TODO api key doesnt have perms for the action
    // if (not perm in key.perms) {
    //   // no api key
    //   err = new Error(
    //     `api key does not have scope ${perm}, request the scope from a comptroller`
    //   );
    //   err.status = 403;
    //   throw err;
    // }

    if (process.env.TEMP_API_KEY == req.query.api_key) {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { hasApiKey };
