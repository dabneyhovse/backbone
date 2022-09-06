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

module.exports = {
  builtInServices: builtInServiceNames.map((name) => require(`./${name}.js`)),
  moduleServices: moduleServiceNames.map((name) => {
    let res;
    if (
      typeof window !== "undefined" &&
      typeof window.document !== "undefined"
    ) {
      // only for browser
      import("react-bootstrap/Container");
      return import(`${name}/submodules/Config`);
    } else {
      // This is for the serverside
      res = require(`${name}/submodules/Config`);
    }
    console.log("hello there2");

    return res;
  }),
};
