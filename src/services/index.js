/**
 * Author:	Nick Jasinski
 * Date:		2022-08-23
 *
 * File that tells backbone about what services have been installed, this does not install a service,
 * but rather tells backbone what has been installed so it knows how to build navbars
 *
 * actual service components should be lazy loaded in the following places (client):
 *  - src/client/routes.js (if service has react component)
 *
 *
 * see the exmample service github for what info the config on that end needs
 *
 * if you've developed your own service and want it integrated into the website make a pull request
 * on the mirror branch of the backbone github. It is expected that you test your own code with backbone first
 * though.
 */

// const moduleServiceNames = ["service-frotator"];
const builtInServiceNames = [
  "social-calendar",
  "wiki-service",
  "dmail-service",
  "print-service",
];
// all config information that toplevel backbone structure needs
let serviceConfigs = [
  ...builtInServiceNames.map((name) => require(`./${name}.js`)),
  // require("service-example/Config"),
  require("service-frotator/Config"),
];

module.exports = {
  serviceConfigs,
};
