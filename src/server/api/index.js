/**
 * Author:	Nick Jasinski
 * Date:		2022-08-15
 *
 * Api index file
 *
 * // TODO: implement telegram bot for verification
 */

const router = require("express").Router();

/**
 * attaches all services apis to the router
 * @param {express router} apiRouter
 */
function attachServices(apiRouter) {
  /**
   * only need these json files loaded while
   * loading this so seems prudent to do this
   */
  const { builtInServices, moduleServices } = require("../../services");
  const allServices = [...builtInServices, ...moduleServices];

  // TODO: possiby differientate between Express and Api in the future
  allServices.forEach((service) => {
    if (service.importExpress) {
      apiRouter.use(
        `${sevice.route}`,
        require(`${service.moduleName}/Express`)
      );
    }
  });
}

module.exports = router;

router.use("/users", require("./users"));
router.use("/affiliations", require("./affiliations"));
// TODO: router.use("/bot", require("./bot"));
attachServices(router);

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
