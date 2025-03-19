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
  name: "Wiki",

  /**
   * A description of the service that will be given along with the name (above) on the services page
   */
  description: "Dabney Hovse's wiki",

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
  route: "wiki",
  href: "https://dabney.caltech.edu/wiki/",

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
  tooltip: "Dabney wiki",

  /**
   *  OpenID Connect claims (as strings) that the user needs to view the service
   *  Administrators can create new roles and make roles from other clients visible
   *  to Backbone in the Keycloak admin console.
   */
  requiredClaims: [],

  /**
   * the below are all false since this is a built in service
   */
  importDb: false,
  importReact: false,
  importExpress: false,
  importAdmin: false,
  importRedux: false,
};
