/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * Middleware for the api rooutes to use as needed
 */

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const isLoggedIn = (req, res, next) => {
  if (req.user || req.query.local == process.env.LOCAL) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const isNotLoggedIn = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.sendStatus(403);
  }
};

// middleware generator, will allow the request if
// the req.query.api_key exists and has the perm
// TODO add actual apikey db
const hasApiKey = (perm) => (req, res, next) => {
  try {
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

module.exports = { isLoggedIn, isAdmin, isNotLoggedIn, upload, hasApiKey };
