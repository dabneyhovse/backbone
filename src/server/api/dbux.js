const router = require("express").Router();
const { User } = require("../db/models");
const { hasApiKey } = require("./middleware");
module.exports = router;

/**
 * GET /api/dbux
 * get the current dbux balance for the given user
 *
 * req.query.telegram_id
 *  the telegram id
 *
 * req.query.user_id
 *  the user id (from backbone database)
 *
 * RETURNS:
 *  404 if no user is found
 *  200 on success & returns user bal
 */
router.get("/", hasApiKey("dbux-get"), async (req, res, next) => {
  try {
    let user;

    // get user either with uid or telegram id
    if (!!req.query.user_id) {
      user_id = parseInt(req.query.user_id);
      console.log(user_id);
      user = await User.findByPk(user_id);
    } else if (!!req.query.telegram_id) {
      user = null;
    }

    // no user so 404
    if (!user) {
      await res.sendStatus(404);
      return;
    }

    res.status(200).json(user.tokens);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/dbux/remove
 * remove dbux from a user account
 *
 * (if you dont want to give a key access to generate dbux)
 *
 * takes user_id or telegram_id and removes the given amount of
 * dbux from the user if they have it.
 *
 * req.query.telegram_id
 *  the telegram id
 *
 * req.query.user_id
 *  the user id (from backbone database)
 *
 * req.query.amount
 *  the amount of dbux to remove
 *
 * req.query.api_key
 *  the api key of the user
 *
 * RETURNS:
 *  404 if no user is found
 *  500 if insufficient dbux or other error
 *  200 on success & returns new user bal
 */
router.put("/remove", hasApiKey("dbux-remove"), async (req, res, next) => {
  try {
    let user;

    amount = parseFloat(req.query.amount);
    if (isNaN(amount)) {
      err = new Error("Bad param: amount is not valid float");
      err.status = 400;
      throw err;
    } else if (amount < 0) {
      err = new Error("Bad param: amount must be greater than 0");
      err.status = 400;
      throw err;
    }

    // get user either with uid or telegram id
    if (!!req.query.user_id) {
      user_id = parseInt(req.query.user_id);
      user = await User.findByPk(user_id);
    } else if (!!req.query.telegram_id) {
      user = null;
    }

    // no user so 404
    if (!user) {
      await res.sendStatus(404);
      return;
    }

    // user found, now try to remove dbux
    if (user.tokens >= req.query.amount) {
      user.tokens -= req.query.amount;
    } else {
      err = new Error("user has insufficient dbux for this operation");
      err.status = 500;
      throw err;
    }

    res.json(user.tokens);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/dbux/update
 * update dbux in a user account
 *
 * takes user_id or telegram_id and updates the amount of
 * dbux from the user if they have it (if removing).
 *
 * req.query.telegram_id
 *  the telegram id
 *
 * req.query.user_id
 *  the user id (from backbone database)
 *
 * req.query.amount
 *  the amount of dbux to give (negative to remove)
 *
 * req.query.api_key
 *  the api key of the user
 *
 * RETURNS:
 *  404 if no user is found
 *  500 if insufficient dbux or other error
 *  200 on success & returns new user bal
 */
router.put("/update", hasApiKey("dbux-update"), async (req, res, next) => {
  try {
    let user;

    amount = parseFloat(req.query.amount);
    if (isNaN(amount)) {
      err = new Error("Bad param: amount is not valid float");
      err.status = 400;
      next(err);
    }

    // get user either with uid or telegram id
    if (!!req.query.user_id) {
      user_id = parseInt(req.query.user_id);
      user = await User.findByPk(user_id);
    } else if (!!req.query.telegram_id) {
      user = await User.find({
        where: {
          telegram_id: req.query.telegram_id,
        },
      });
    }

    // no user so 404
    if (!user) {
      await res.sendStatus(404);
      return;
    }

    // user found, now try to update dbux
    if (user.tokens + amount >= 0) {
      user.tokens += amount;
      await user.save();
    } else {
      err = new Error("user has insufficient dbux for this operation");
      err.status = 500;
      throw err;
    }

    res.json(user.tokens);
  } catch (error) {
    next(error);
  }
});
