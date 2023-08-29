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
 *
 * @param {express router} apiRouter
 */
function attachServices(apiRouter) {
  console.log("Attaching service api routes...");
  /**
   * only need these json files loaded while
   * loading this so seems prudent to do this
   *
   * kinda cursed but i dont want to fix it yet srry
   */
  const { serviceConfigs} = require("../../services");
  const allServices = serviceConfigs;

  // TODO: possibly differientate between Express and Api in the future

  let count = 0;
  allServices.forEach((service) => {
    if (service.importExpress) {
      apiRouter.use(
        `/${service.route}`,
        require(`${service.moduleName}/Express`)
      );
      count++;
      console.log(
        `\t[${service.name}]:\tattached api routes at /api/${service.route}/`
      );
    } else {
      console.log(`\t[${service.name}]:\tdoes not have api routes`);
    }
  });
  console.log(`Attached ${count} service api Route(s)\n`);
}

// attach base backbone routes
router.use("/users", require("./users"));
router.use("/affiliations", require("./affiliations"));
router.use("/groups", require("./groups"));
// TODO: router.use("/bot", require("./bot"));

// attach routes for services
attachServices(router);

router.use((req, res, next) => {
  const error = new Error("API Route Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
