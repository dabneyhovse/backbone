const router = require("express").Router();
const bot = require("./bot");
const { User } = require("../../db/models");
const { hasApiScope } = require("module-middleware");
module.exports = router;

/**
 * Set the bot API endpoint for webhook,
 * or start in polling mode if NODE_ENV is develop
 *
 * POST /api/telegram/TELEGRAM_WEBHOOK_SECRET
 */
async function launchBot() {
  if ((process.env.NODE_ENV = "development")) {
    // polling instead in dev mode
    bot.launch();
    console.log("Started telegram bot in polling mode.\n");
  } else {
    botListener = await bot.createWebhook({
      domain: process.env.TELEGRAM_WEBHOOK_DOMAIN,
      port: 443,
      hookPath: `/api/telegram/${process.env.TELEGRAM_WEBHOOK_SECRET}`,
    });

    router.use(`/${process.env.TELEGRAM_WEBHOOK_SECRET}`, botListener);
    console.log("Started telegram bot in webhook mode.\n");
  }
} 

launchBot();

/**
 * these are seperate from the user cause they are telegram id based, meant for
 * bots
 * */

/**
 * GET /api/telegram/isdarb
 *
 * req.query.telegram_id:
 *    the telegram id you want to check
 *
 * req.query.api_key:
 *    api key with scope "telegram-isdarb"
 *
 * returns json
 *    .id : backbone internal user id
 *    .firstname : firstname that the user has set in bio
 *    .lastname : lastname that the user has set in bio
 *    .username : user's username
 *    .profile : json object with more details
 *        { photo, room, bio }
 */
router.get("/user", hasApiScope("telegram-user"), async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { telegram_id: req.query.telegram_id },
      attributes: ["id", "firstName", "lastName", "username", "profile"],
    });

    if (user == null) {
      err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    res.json(user).status(200);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/telegram/isdarb
 *
 * req.query.telegram_id:
 *    the telegram id you want to check
 *
 * req.query.api_key:
 *    api key with scope "telegram-isdarb"
 *
 * returns json
 *    .darb : true if darb & telegram account linked, false otherwise
 */
router.get(
  "/isdarb",
  hasApiScope("telegram-isdarb"),
  async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { telegram_id: req.query.telegram_id },
      });

      res.json({ darb: user == null }).status(200);
    } catch (error) {
      next(error);
    }
  }
);
