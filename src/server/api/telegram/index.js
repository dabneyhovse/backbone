const router = require("express").Router();
const bot = require("./bot");
// const { User } = require("../db/models");
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
 * check if telegram id is darb
 *
 * TODO: add api key check func
 *
 *
 * GET /api/telegram/user?telegram_id={}
 */
// router.get("/user", async (req, res, next) => {
//   try {
//     const user = await User.find({
//       where: { telegram_id: req.query.telegram_id },
//     });
//     if( user == null){
//       err = new Error("User not found")
//     }
//     res.status(200).json();
//   } catch (error) {
//     next(error);
//   }
// });
