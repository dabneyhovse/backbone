/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * Api index file
 *
 * // TODO: dynasmic import of routes from services
 * // TODO: implement telegram bot for verification
 */

const router = require("express").Router();
module.exports = router;

router.use("/users", require("./users"));
// TODO: router.use("/bot", require("./bot"));
// TODO dynamic import

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
