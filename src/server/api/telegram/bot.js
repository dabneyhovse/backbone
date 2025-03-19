// /**
//  * The server bot instance to import from elsewhere
//  */
// // TODO overall rate limit?

// const { Telegraf } = require("telegraf");
// const { Verification, User } = require("../../db/models");

// const bot = new Telegraf(process.env.TELEGRAM_BOT_KEY);
// module.exports = bot;

// // Placeholder start command
// bot.command("start", async (ctx) => {
//   // TODO: check if user already exists?
//   userId = ctx.from.id;
//   user = await User.findOne({
//     where: {
//       telegram_id: `${userId}`,
//     },
//   });

//   if (!!user) {
//     ctx.reply(
//       "This telegram account is already linked to a Dabney account... This bot doesnt do anything else right now lol."
//     );
//     return;
//   }
//   ctx.reply(
//     "Hello there, to link your telegram account to your Dabney™ account please use /link."
//   );
// });

// // Link telegram_id into the user
// bot.command("link", async (ctx) => {
//   // delete any that have a matching telegram id
//   chatId = ctx.update.message.chat.id;
//   userId = ctx.from.id;

//   // only let people link in dms
//   if (chatId !== userId) {
//     ctx.reply(
//       `Please link your account by <a href="t.me/${process.env.TELEGRAM_BOT_USERNAME}/">directly messaging me</a>.`,
//       {
//         parse_mode: "HTML",
//         link_preview_options: {
//           prefer_small_media: true,
//         },
//       }
//     );
//   }

//   // check to see if already linked
//   user = await User.findOne({
//     where: {
//       telegram_id: `${userId}`,
//     },
//   });

//   if (!!user) {
//     ctx.reply("This telegram account is already linked to a Dabney account.");
//     return;
//   }

//   // check if there is aready a ver
//   ver = await Verification.findOne({
//     where: {
//       emailType: "telegram",
//       email: `${userId}`,
//     },
//   });

//   // basic rate limit
//   if (ver) {
//     wait = Date.now() - ver.createdAt;
//     // ms -> seconds for a full min
//     if (wait < 60 * 1000) {
//       ctx.reply(
//         `<b>You already have an active verification code: <code>${ver.hash}</code></b>.\n\nIf this code is faulty you can request a new one in a minute. If the issue persists, message the comptrollers.`,
//         {
//           parse_mode: "HTML",
//         }
//       );
//       return;
//     }
//   }

//   // remove any previous verifications
//   ver = await Verification.destroy({
//     where: {
//       emailType: "telegram",
//       email: `${userId}`,
//     },
//   });

//   // make a new one
//   ver = await Verification.create({
//     emailType: "telegram",
//     userId: undefined,
//     email: userId,
//   });

//   ctx.reply(
//     `<b>Your verification code is <code>${ver.hash}</code></b> (click to copy)\n\nDon't share this lol.\n\nEnter it on your profile page on the <a href = "https://dabney.caltech.edu">Dabney House website</a> to link your account.`,
//     {
//       parse_mode: "HTML",
//       link_preview_options: {
//         prefer_small_media: true,
//       },
//     }
//   );
// });

// // Enable graceful stop
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
