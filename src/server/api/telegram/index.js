const router = require("express").Router();
const bot = require("./bot");
const { User } = require("../db/models");
const { hasApiKey } = require("../middleware");
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
 * GET /api/telegram/user?telegram_id={}
 *
 * get basic darb info by their telegram_id
 *
 *
 * req.query.telegram_id
 *  the telegram id
 *
 * req.query.api_key
 *  the api key of the user
 *
 * returns json
 * {
 *   id
 *   firstName,
 *   lastName,
 *   username,
 *   profile : { photo, room, bio }
 * }
 *
 */
router.get("/user", hasApiKey("telegram-user"), async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { telegram_id: req.query.telegram_id },
      include: ["id", "firstName", "lastName", "username", "profile"],
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
