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
  if (req.user) {
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

module.exports = { isLoggedIn, isAdmin, isNotLoggedIn, upload };
