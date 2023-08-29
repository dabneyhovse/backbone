/**
 * Author:	Nick Jasinski
 * Date:		2022-08-23
 *
 * config file for the built in service "about-services"
 */

module.exports = {
  /**
   * The name of the service, this is what you will see on the navbar dropdown of the main dabney website
   */
  name: "Print",

  /**
   * A description of the service that will be given along with the name (above) on the services page
   */
  description: "Dabney Hovse's print service",

  /**
   * the route you want your service to occupy ie "example" gives the service dabney.caltech.edu/example/*
   * simply use your own routes to get varried routes from the base ie
   * dabney.caltech.edu/example/about and dabney.caltech.edu/example/home
   * would be two different routes
   *
   * if your route overlaps with an existing one the serivce that has been up longer will recieve the route,
   * and the other will not be connected
   *
   * do not request a route if your service is external (no react) or built in (leave route as null)
   */
  route: "",
  href: "https://print.dabney.caltech.edu/",

  /**
   * If backbone should add the route about to the router
   * (usually true, but false for smth like the about services service)
   * as its built in and already has routes
   */
  createRoute: false,

  /**
   * the name of the module (string|null)
   *    string is module name so each part can import based on it
   *    ie import "moduleName/server"
   *
   *    null for built in
   */
  moduleName: null,

  /**
   * navlink type (href|react-router)
   *
   * href will be a normal link while react will use a link container
   */
  routeType: "href",

  /**
   * if the service should be displayed in the navbar
   */
  displayInNav: true,

  /**
   * Describes what section the dropdown item appears in
   *
   * options are ("b","m","t")
   *
   * "b" => bottom
   * "m" => middle
   * "t" => top
   */
  dropdownItemPosition: "t",

  /**
   * Tool tip to display when hovering over the link in the services dropdown
   * try to keep the text short
   */
  tooltip: "Dabney Print Service",

  /**
   *  Amount of authorization that the user needs to view the service
   *  possible values:
   *    -1 => prefrosh only                         (lol this isnt real, we cant check)
   *    0 => no login required                      (or 1/2/3/4 reqs)
   *    1 => login required (non darbs can access)  (or 2/3/4 reqs)
   *    2 => login & socialDarb required            (or 3/4 reqs)
   *    3 => login & fullDarb required              (or 4 reqs)
   *    4 => admin status required
   *    5 => login but only non darbs
   *    6 => login but only social darbs
   *    7 => login but only full darbs
   *
   *  I'm not sure why someone would want the 5-7 settings but i'm including it
   *  just so every config is possible.
   */
  requiredAuth: 0,

  /**
   * Similar to before, but simply restricts to current students only.
   *
   * Yeah the current student status of users will be self declared in the
   * profile settings section, so I imagine itll be annoying to verify, but
   * comptrollers wil have easy access to change user statuses
   *
   * To avoid annoying debate later, yes I'm going to include students on temp leave
   * y'all can bicker about this however you want but its best to default to yes
   * and deal with exceptions later.
   */
  requireCurrentStudent: false,

  /**
   * the below are all false since this is a built in service
   */
  importDb: false,
  importReact: false,
  importExpress: false,
  importAdmin: false,
  importRedux: false,
};
