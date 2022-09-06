/**
 * Author:	Nick Jasinski
 * Date:		2022-08-23
 *
 * File that tells backbone about what services have been installed
 *
 * see the exmample service github for what info the config on that end needs
 *
 * if you've developed your own service and want it integrated into the website make a pull request
 * on the mirror branch of the backbone github. It is expected that you test your own code with backbone first
 * though.
 */

const moduleServiceNames = ["service-example"];
const builtInServiceNames = ["social-calendar", "about-services"];

let moduleServices = [];
let moduleImports = {};
if (typeof window !== "undefined" && typeof window.document !== "undefined") {
  // only does this in browser, webpack is mean and cant do dynamic imports with the names maping rn
  let service_example_config = require("service-example");
  moduleServices = [service_example_config];
  moduleImports = {
    "service-example": {
      config: require("service-example"),
      ...(service_example_config.importReact
        ? {
            react: import("service-example/React"),
          }
        : {}),
      ...(service_example_config.importAdmin
        ? {
            admin: import("service-example/Admin"),
          }
        : {}),
      ...(service_example_config.importRedux
        ? {
            redux: import("service-example/Redux"),
          }
        : {}),
    },
  };

  import("service-example/React");
} else {
  moduleServices = moduleServiceNames.map((name) => require(`${name}`));
}

module.exports = {
  builtInServices: builtInServiceNames.map((name) => require(`./${name}.js`)),
  moduleServices,
  moduleImports,
};
